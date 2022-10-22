import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';
import mysql, { ServerlessMysql } from 'serverless-mysql';
import { getConnectionOptions } from 'packages/utils/db';
import winston from 'winston';
import { DateTime } from 'luxon';
import { getDBSessionLimits } from 'packages/utils/env';
import { Parser } from 'node-sql-parser';

if (!process.env.DATABASE_URL) {
  winston.error('Must provide DATABASE_URL in the env variable.');
  process.exit();
}

if (!process.env.DATABASE_URL_AP) {
  winston.error('Must provide DATABASE_URL_AP in the env variable.');
  process.exit();
}

if (!process.env.DATABASE_URL_TP) {
  winston.error('Must provide DATABASE_URL_TP in the env variable.');
  process.exit();
}

const conn = mysql({
  backoff: 'decorrelated',
  base: 5,
  cap: 200,
  config: getConnectionOptions(process.env.DATABASE_URL)
});

const APconn = mysql({
  backoff: 'decorrelated',
  base: 5,
  cap: 200,
  config: getConnectionOptions(process.env.DATABASE_URL_AP)
});

const TPConn = mysql({
  backoff: 'decorrelated',
  base: 5,
  cap: 200,
  config: getConnectionOptions(process.env.DATABASE_URL_TP)
});

export interface QueryRequest {
  sql: string;
}

export interface QueryResult {
  verifyStart: DateTime;
  verifyEnd: DateTime;
  verifyCost: number;
  queueStart: DateTime;
  queueEnd: DateTime;
  queueCost: number;
  executeStart: DateTime;
  executeEnd: DateTime;
  executeCost: number;
  totalCost: number;
  isAP: boolean;
  sql: string;
  data: any;
}

export interface ErrorResult {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QueryResult | ErrorResult>
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({
      message: "You must be signed in to before you request this API.",
    })
    return;
  }

  const sql = req.body.sql.trim();
  try {
    const result = await executeQuery(sql);
    res.status(200).send(result);
  } catch(err:any) {
    console.log('Failed to execute adhoc query: ', sql, err);
    let code = 500, message = 'Failed to execute adhoc query.';
    if (err instanceof APIError) {
      code = err.code;
      message = err.message;
    } else if (err.sqlMessage) {
      message = err.sqlMessage
    }
    res.status(code).send({
      message: message
    });
  } finally {
    conn.end();
    APconn.end();
    TPConn.end();
  }
}

export class APIError extends Error {
  constructor(readonly code: number, readonly  message: string) {
      super(message);
  }
}

export class SQLVerifyError extends APIError {
  constructor(readonly  message: string, sql: string) {
    super(400, message);
  }
}

async function executeQuery(sql:string):Promise<QueryResult> {
  const totalStart = DateTime.now();

  // Verify.
  const verifyStart = DateTime.now();
  let isAP = false;
  if (isCommandSQL(sql)) {
    isAP = false;
  } else {
    verifySQL(sql);
    isAP = await isAPQuery(conn, sql);
  }
  const verifyEnd = DateTime.now();
  const verifyCost = verifyEnd.diff(verifyStart, 'milliseconds').milliseconds / 1000;

  // Queue.
  const queueStart = DateTime.now();
  const executeConn = isAP ? APconn : TPConn;
  await executeConn.connect();
  await prepareLimitedSession(executeConn, isAP);
  const queueEnd = DateTime.now();
  const queueCost = queueEnd.diff(queueStart, 'milliseconds').milliseconds / 1000;

  // Execute
  const executeStart = DateTime.now();
  const data = await conn.query(sql);
  const executeEnd = DateTime.now();
  const executeCost = executeEnd.diff(executeStart, 'milliseconds').milliseconds / 1000;

  const totalCost = DateTime.now().diff(totalStart, 'milliseconds').milliseconds / 1000;
  return {
    verifyStart,
    verifyEnd,
    verifyCost,
    queueStart,
    queueEnd,
    queueCost,
    executeStart,
    executeEnd,
    executeCost,
    totalCost,
    isAP,
    sql,
    data
  }
}

async function isAPQuery(conn: ServerlessMysql, sql: string):Promise<boolean> {
  const explainResult = await conn.query<any[]>(`EXPLAIN FORMAT='brief' ${sql}`);
  return explainResult.some((row) => {
    return typeof row.task === 'string' && row.task.includes('tiflash');
  })
}

async function prepareLimitedSession(conn:ServerlessMysql, isAP: boolean) {
  const limits = [
    ...getDBSessionLimits('PLAYGROUND_SESSION_'),
    ...(isAP ? getDBSessionLimits('PLAYGROUND_SESSION_AP_') : getDBSessionLimits('PLAYGROUND_SESSION_TP_'))
  ];
  limits.forEach(async (command) => {
    await conn.query(command);
  });
}

const TABLE_NAME = `[a-zA-Z][a-zA-Z0-9_]+`;
const SHOW_STATEMENT_PATTERN = new RegExp(`^SHOW\\s*(TABLES|DATABASES|VARIABLES)\\s*(LIKE\\s*(["'](.+)["']))*(;)*$`, 'i');
const SHOW_INDEXES_PATTERN = new RegExp(`SHOW\\s*INDEXES\\s*FROM\\s*(${TABLE_NAME})\\s*(;)*$`, 'i')
const DESC_STATEMENT_PATTERN = new RegExp(`^DESC\\s*(${TABLE_NAME})\\s*(;)*$`, 'i');

function verifySQL(sql:string):boolean {
  const parser = new Parser();
  let statements;
  try {
    statements = parser.astify(sql);
  } catch(err) {
    throw new SQLVerifyError(`'Failed to parse this SQL.`, sql);
  }

  let statement;
  if (Array.isArray(statements)) {
    if (statements.length !== 1) {
      throw new SQLVerifyError('Do not support multiple statements in one SQL.', sql);
    } else {
      statement = statements[0];
    }
  } else if (statements !== null && typeof statements === 'object') {
    statement = statements;
  } else {
    throw new SQLVerifyError('Unknown statements in this SQL.', sql);
  }

  const type:unknown = statement.type;
  if (type !== 'select' && type !== 'show') {
    throw new SQLVerifyError('Only support execute select / show / desc type statement.', sql);
  }

  // TODO: Add SQL verify rules.
  
  return true
}

function isCommandSQL(sql:string): boolean {
  if (SHOW_STATEMENT_PATTERN.test(sql)) {
    return true;
  } else if (SHOW_INDEXES_PATTERN.test(sql)) {
    return true;
  } else if (DESC_STATEMENT_PATTERN.test(sql)) {
    return true;
  }
  return false;
}
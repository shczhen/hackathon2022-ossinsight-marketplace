import { DateTime } from 'luxon';
import { ConnectionOptions } from 'mysql';
import { Parser } from 'node-sql-parser';
import mysql, { ServerlessMysql } from 'serverless-mysql';
import { APIError } from 'types/common';
import { Query } from 'types/query.schema';
import winston from 'winston';
import { getDBSessionLimits } from '../utils/env';

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

export class SQLVerifyError extends APIError {
    constructor(readonly  message: string, sql: string) {
      super(400, message);
    }
}

export function getConnectionOptions(databaseURL: string, options?: ConnectionOptions) {
    const url = new URL(databaseURL);
    const dbHost = url.hostname;
    const dbName = url.pathname.replaceAll('/', '');
    const dbPort = parseInt(url.port || "4000");
    const dbUser = url.username;
    const dbPass = url.password;
    const defaultOptions = {
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPass,
        decimalNumbers: true,
        timezone: 'Z'
    };    
    return Object.assign(defaultOptions, options);
}

export function getCommonConn():ServerlessMysql {
    if (!process.env.DATABASE_URL) {
        winston.error('Must provide DATABASE_URL in the env variable.');
        process.exit();
    }

    return mysql({
        backoff: 'decorrelated',
        base: 5,
        cap: 200,
        config: getConnectionOptions(process.env.DATABASE_URL)
    });      
}

export function getAPConn():ServerlessMysql {
    if (!process.env.DATABASE_URL_AP) {
        winston.error('Must provide DATABASE_URL_AP in the env variable.');
        process.exit();
    }

    return mysql({
        backoff: 'decorrelated',
        base: 5,
        cap: 200,
        config: getConnectionOptions(process.env.DATABASE_URL_AP)
    });      
}

export function getTPConn():ServerlessMysql {
    if (!process.env.DATABASE_URL_TP) {
        winston.error('Must provide DATABASE_URL_TP in the env variable.');
        process.exit();
    }

    return mysql({
        backoff: 'decorrelated',
        base: 5,
        cap: 200,
        config: getConnectionOptions(process.env.DATABASE_URL_TP)
    });      
}

export async function executeQuery(conn: ServerlessMysql, APConn:ServerlessMysql, TPConn:ServerlessMysql, sql:string):Promise<QueryResult> {
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
    const executeConn = isAP ? APConn : TPConn;
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
  
export async function isAPQuery(conn: ServerlessMysql, sql: string):Promise<boolean> {
    const explainResult = await conn.query<any[]>(`EXPLAIN FORMAT='brief' ${sql}`);
    return explainResult.some((row) => {
      return typeof row.task === 'string' && row.task.includes('tiflash');
    })
}
  
export async function prepareLimitedSession(conn:ServerlessMysql, isAP: boolean) {
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

export async function getQueryResult(conn: ServerlessMysql, APConn:ServerlessMysql, TPConn:ServerlessMysql, sql: string, query: Query, values: Partial<{
    [key: string]: string | string[];
}>) {
  
    let template = sql;
    query.parameters.forEach(({ name, defaultValue, type, placeholder }) => {
        const value = values[name] ?? defaultValue;

        if (!placeholder) {
            throw new APIError(400, `Missing placeholder for parameter ${name}`);
        }
        if (!value) {
            throw new APIError(400, `Missing value for parameter ${name}`);
        }

        let processedValue: string;
        switch (type) {
            case 'string':
            case 'number':
                processedValue = String(value);
                break;
            case 'array':
                processedValue = handleArrayValue(value);
                break;
            default:
                throw new APIError(400, `Unsupported parameter type ${type}`);
        }

        template = template.replaceAll(placeholder, processedValue);
    });
  
    const res = await executeQuery(conn, APConn, TPConn, template);
    return res.data;
}

function handleArrayValue(value: any) {
    const arrValues = [];

    if (Array.isArray(value)) {
        for (let v of value) {
        arrValues.push(value);
        }
    } else {
        arrValues.push(value);
    }

    return arrValues.join(', ');
}
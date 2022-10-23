import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';
import { executeQuery, getAPConn, getCommonConn, getTPConn, QueryResult } from 'packages/db/db';
import { APIError, ErrorResult } from 'types/common';

const conn = getCommonConn();
const APConn = getAPConn();
const TPConn = getTPConn();

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

  const sql = req.body.sql;
  try {
    const result = await executeQuery(conn, APConn, TPConn, sql);
    res.status(200).send(result);
  } catch(err:any) {
    console.log('Failed to execute this query: ', sql, err);
    let code = 500, message = 'Failed to execute this query.';
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
    APConn.end();
    TPConn.end();
  }
}

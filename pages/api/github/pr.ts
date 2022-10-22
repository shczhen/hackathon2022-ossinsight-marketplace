import vm from 'node:vm';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import axios from 'lib/axios';

import { getUserDetails, createPr } from 'lib/github';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }
  const { login } = await getUserDetails(session.accessToken);

  if (!['shczhen', 'shczhen-bot'].includes(login)) {
    res.status(401).end();
    return;
  }

  const { sql, js, option } = req?.body || {};

  await axios.post(
    `https://api.github.com/repos/shczhen/hackathon2022-ossinsight-marketplace/actions/workflows/plugin-pr.yml/dispatches`,
    {
      // ref: 'main',
      ref: 'add-pr-api',
      inputs: {
        plugin: `${login}-${new Date().getTime()}`,
        sql,
        js,
        option,
      },
    },
    {
      headers: {
        Accept: `application/vnd.github+json`,
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  res.status(200).end();
}

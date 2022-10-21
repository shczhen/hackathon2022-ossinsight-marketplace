import vm from 'node:vm';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import {
  simpleGit,
  SimpleGit,
  CleanOptions,
  SimpleGitOptions,
} from 'simple-git';
import { writeFileSync, mkdirSync } from 'fs';

import { getUserDetails } from 'lib/github';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // const session = await unstable_getServerSession(req, res, authOptions);
  // if (!session) {
  //   res.status(401).end();
  //   return;
  // }
  // const { login } = await getUserDetails(session.accessToken);
  const login = 'test';
  const { sql, js, option } = req?.body || {};

  const options: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
  };

  const git: SimpleGit = simpleGit(options).clean(CleanOptions.FORCE);

  await git.clone(
    `https://.:${process.env.GITHUB_BOT_TOKEN}@github.com/czhen-bot/hackathon2022-ossinsight-marketplace.git`
  );
  const git2: SimpleGit = simpleGit(
    `${process.cwd()}/hackathon2022-ossinsight-marketplace`,
    {
      binary: 'git',
    }
  );

  const branchName = `login-${new Date().getTime()}`;

  await git2.addConfig('user.name', 'github-actions');
  await git2.addConfig('user.email', 'github-actions@github.com');
  await git2.pull();
  await git2.checkout(`-b${branchName}`);

  mkdirSync(
    `${process.cwd()}/hackathon2022-ossinsight-marketplace/plugin-test/${branchName}`,
    { recursive: true }
  );
  writeFileSync(
    `${process.cwd()}/hackathon2022-ossinsight-marketplace/plugin-test/${branchName}/query.sql`,
    sql
  );

  await git2.add(
    `${process.cwd()}/hackathon2022-ossinsight-marketplace/plugin-test/${branchName}`
  );
  await git2.commit('add plugin');
  await git2.push(['-u', 'origin', branchName]);

  res.status(200).json({ id: branchName });
}

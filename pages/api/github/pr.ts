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

  const options: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
  };

  const git: SimpleGit = simpleGit(options).clean(CleanOptions.FORCE);

  await git.clone(
    `https://${process.env.GITHUB_BOT_TOKEN}@github.com/czhen-bot/hackathon2022-ossinsight-marketplace.git`
  );
  await git.pull();
  await git.checkout(`-b${new Date().getTime()}`);
  await git.push([' -u', 'origin', 'HEAD']);

  res.status(200).json({});

  // const { scripts, data } = req?.body || {};

  // const context = { data: data, result: null };
  // vm.createContext(context); // Contextify the object.

  // // Code Example:
  // // function main(data) {
  // // const dataLength = data.length;
  // // result.length = dataLength;
  // // return result;
  // // };
  // const code = `${scripts} result = option;`;

  // // console.log(context);

  // try {
  //   vm.runInContext(code, context);
  // } catch (error: any) {
  //   console.log(error);
  //   res.status(500).json({ error: error.message });
  //   return;
  // }
  // res.status(200).json({ ...context });
}

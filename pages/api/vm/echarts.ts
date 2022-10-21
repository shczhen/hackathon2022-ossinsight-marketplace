import vm from 'node:vm';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }

  const { scripts, data } = req?.body || {};

  const context = { data: ['test1', 'test2'], result: null };
  vm.createContext(context); // Contextify the object.

  const code = scripts;
  vm.runInContext(code, context);

  res.status(200).json({ ...context });
}

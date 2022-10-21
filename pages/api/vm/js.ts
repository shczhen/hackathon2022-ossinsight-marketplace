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

  const context = { data: data.data, result: null };
  vm.createContext(context); // Contextify the object.

  // Code Example:
  // function main(data) {
  // const dataLength = data.length;
  // result.length = dataLength;
  // return result;
  // };
  const code = `${scripts} result = main(data);`;

  // console.log(context);

  try {
    vm.runInContext(code, context);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json({ ...context });
}

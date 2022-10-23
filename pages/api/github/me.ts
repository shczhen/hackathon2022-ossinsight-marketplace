import { getOctokit } from 'lib/github';
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

  const userOctokit = getOctokit(session.accessToken);
  const { data } = await userOctokit.rest.users.getAuthenticated();

  res.status(200).json(data);
}

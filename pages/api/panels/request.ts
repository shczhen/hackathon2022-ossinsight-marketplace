import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getOctokit } from 'lib/github';
import { Panel } from 'types/panel.schema';
import { Query } from 'mysql';
import { APIError } from '../sql/execute';
import winston from 'winston';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
  }
}

if (!process.env.GITHUB_TOKEN) {
  throw new Error('Must provide GITHUB_TOKEN in the env variable.');
}
const octokit = getOctokit(process.env.GITHUB_TOKEN);
const TRUSTED_USERS = ['shczhen', 'shczhen-bot', 'Mini256', 'Icemap'];
const CONFIG_REPO = {
  owner: 'shczhen',
  repo: 'hackathon2022-ossinsight-marketplace',
};

export interface NewPanelRequest {
  panel: Panel;
  query: Query;
  script: string;
  sql: string;
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

  // TODO: limit who can make a new panel request.
  const userOctokit = getOctokit(session.accessToken);
  const {
    data: { login },
  } = await userOctokit.rest.users.getAuthenticated();
  if (!TRUSTED_USERS.includes(login)) {
    res.status(401).end();
    return;
  }

  try {
    createPanelRequest(req.body || {});
    res.status(200).end();
  } catch (err) {
    winston.error(`Failed to create a new panel request: ${err}`);
    res.status(500).end();
  }
}

export class NewPanelRequestError extends APIError {
  constructor(message: string) {
    super(400, message);
  }
}

// Create a pull request to add new plugin.
async function createPanelRequest(request: NewPanelRequest) {
  const { panel, query, script, sql } = request;
  const panelName = panel.name;

  if (!panelName) {
    throw new NewPanelRequestError('The panel name is required.');
  }

  // TODO: validate the new panel request.

  // TODO: avoid duplicated new panel request workflow.
  await octokit.rest.actions.createWorkflowDispatch({
    owner: 'shczhen',
    repo: 'hackathon2022-ossinsight-marketplace',
    workflow_id: 'new-panel-request.yml',
    ref: 'main',
    inputs: {
      panelName: panel.name,
      panel: JSON.stringify(panel),
      query: JSON.stringify(query),
      script,
      sql,
    },
  });

  // TODO: return the pull request URL. (difficult)
}

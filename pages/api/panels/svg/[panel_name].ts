import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Panel } from 'types/panel.schema';
import { Query } from 'types/query.schema';
import { getAPConn, getCommonConn, getQueryResult, getTPConn } from 'packages/db/db';
import { renderSVG } from 'packages/panel/svg';
import { getChartOption } from 'packages/panel/chart';

export const PANEL_CONFIG_DIR = path.join(process.cwd(), 'configs', 'panels');
export const PANEL_CONFIG_FILE = 'panel.json';
export const QUERY_CONFIG_FILE = 'query.json';
export const RENDER_SCRIPT_FILE = 'render.js';
export const TEMPLATE_SQL_FILE = 'template.sql';

const conn = getCommonConn();
const APConn = getAPConn();
const TPConn = getTPConn();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const panelName = req.query.panel_name as string;
  if (!panelName) {
    res.status(400).end();
    return;
  }

  const panelConfigPath = path.join(PANEL_CONFIG_DIR, panelName, 'panel.json');
  if (!fs.existsSync(panelConfigPath)) {
    res.status(500).send('The panel config not found.');
    return;
  }
  const panelConfigJSON = fs.readFileSync(panelConfigPath, 'utf8');
  const panelConfig:Panel = JSON.parse(panelConfigJSON);
  
  const queryConfigPath = path.join(PANEL_CONFIG_DIR, panelName, 'query.json');
  const queryConfigJSON = fs.readFileSync(queryConfigPath, 'utf8');
  const queryConfig:Query = JSON.parse(queryConfigJSON);

  const renderScriptPath = path.join(PANEL_CONFIG_DIR, panelName, 'render.js');
  const renderScript:string = fs.readFileSync(renderScriptPath, 'utf8');

  const templateSQLPath = path.join(PANEL_CONFIG_DIR, panelName, 'template.sql');
  const templateSQL:string = fs.readFileSync(templateSQLPath, 'utf8');
  
  const data = await getQueryResult(conn, APConn, TPConn, templateSQL, queryConfig, req.query);
  const options = await getChartOption(renderScript, data);
  const svg = renderSVG(options);

  let renderCacheTTL = panelConfig.render?.cache?.ttl;
  if (renderCacheTTL === undefined || renderCacheTTL === null) {
    renderCacheTTL = 60 * 60 * 24;  //24 hours by default.
  }

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': `public, max-age=${renderCacheTTL}`,
  });
  res.write(svg);
  res.end(); 
}

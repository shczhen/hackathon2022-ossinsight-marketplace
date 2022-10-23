import type { NextApiRequest, NextApiResponse } from 'next';
import { getAPConn, getCommonConn, getQueryResult, getTPConn } from 'packages/db/db';
import { renderSVG } from 'packages/panel/svg';
import { getChartOption } from 'packages/panel/chart';
import { getPanelFullConfig } from 'packages/panel/config';

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

  const { panelConfig, queryConfig, templateSQL, renderScript } = await getPanelFullConfig(panelName);
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

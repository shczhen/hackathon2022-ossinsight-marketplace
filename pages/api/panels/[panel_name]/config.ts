import { NextApiRequest, NextApiResponse } from "next";
import { getPanelFullConfig, PanelFullConfig } from "packages/panel/config";
import { APIError, ErrorResult } from "types/common";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PanelFullConfig | ErrorResult>
) {
    const panelName = req.query.panel_name as string;
    if (!panelName) {
      res.status(400).end();
      return;
    }

    try {
      const fullConfig = getPanelFullConfig(panelName);
      res.status(200).send(fullConfig);
    } catch(err:any) {
      let code = 500, message = `Failed to get full config for ${panelName} panel.`;
      if (err instanceof APIError) {
        code = err.code;
        message = err.message;
      }
      console.log(`Failed to get full config for ${panelName} panel.`, err);
      res.status(code).send({
        message: message
      });
    } finally {
      res.end();
    }
}
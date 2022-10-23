import path from "path";
import fs from 'fs';
import { APIError } from "types/common";
import { Panel } from "types/panel.schema";
import { Query } from "types/query.schema";

export interface PanelFullConfig {
    panelConfig: Panel;
    queryConfig: Query;
    renderScript: string;
    templateSQL: string;
}

export const PANEL_CONFIG_DIR = path.join(process.cwd(), 'configs', 'panels');
export const PANEL_CONFIG_FILE = 'panel.json';
export const QUERY_CONFIG_FILE = 'query.json';
export const RENDER_SCRIPT_FILE = 'render.js';
export const TEMPLATE_SQL_FILE = 'template.sql';

export function getPanelFullConfig(panelName:string):PanelFullConfig {
    const panelConfigPath = path.join(PANEL_CONFIG_DIR, panelName, 'panel.json');
    console.log(panelConfigPath);
    
    if (!fs.existsSync(panelConfigPath)) {
        throw new APIError(404, 'Panel config file not found.');
    }
    const panelConfigJSON = fs.readFileSync(panelConfigPath, 'utf8');
    const panelConfig:Panel = JSON.parse(panelConfigJSON);

    console.log(PANEL_CONFIG_DIR);
    
    const queryConfigPath = path.join(PANEL_CONFIG_DIR, panelName, 'query.json');
    const queryConfigJSON = fs.readFileSync(queryConfigPath, 'utf8');
    const queryConfig:Query = JSON.parse(queryConfigJSON);

    const renderScriptPath = path.join(PANEL_CONFIG_DIR, panelName, 'render.js');
    const renderScript:string = fs.readFileSync(renderScriptPath, 'utf8');

    const templateSQLPath = path.join(PANEL_CONFIG_DIR, panelName, 'template.sql');
    const templateSQL:string = fs.readFileSync(templateSQLPath, 'utf8');

    return {
        panelConfig,
        queryConfig,
        renderScript,
        templateSQL
    }
}
import fs from 'fs';
import path from 'path';
import { Query } from "types/query.schema";

export class QueryManager {
    private queries: Map<string, Query> = new Map();

    constructor(readonly configDir: string) {
        travelDir(configDir, (p) => {
            if (fs.existsSync(path.join(p, './query.json'))) {
                this.loadQuery(p);
            }
        });
    }

    loadQuery(p: string) {
        const configFile = path.join(p, './query.json');
        const configJSON = fs.readFileSync(configFile, 'utf8');
        const query:Query = JSON.parse(configJSON);

        // Notice: Prioritize the template sql in the configuration file.
        if (!query.sql) {
            const templateFile = path.join(p, './template.sql');
            const templateSQL = fs.readFileSync(templateFile, 'utf8');
            query.sql = templateSQL;
        }

        this.queries.set(query.name, query);
    }

    getQuery(name: string): Query | undefined {
        return this.queries.get(name);
    }
}

function travelDir(root: string, visitor: (path: string) => void) {
    const entries = fs.readdirSync(root, { withFileTypes: true});
    for (let entry of entries) {
        if (entry.isDirectory()) {
            const pwd = path.join(root, entry.name);
            visitor(pwd);
            travelDir(pwd, visitor);
        }
    }
}
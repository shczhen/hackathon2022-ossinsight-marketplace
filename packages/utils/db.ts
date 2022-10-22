import { ConnectionOptions } from 'mysql';

export function getConnectionOptions(databaseURL: string, options?: ConnectionOptions) {
    const url = new URL(databaseURL);
    const dbHost = url.hostname;
    const dbName = url.pathname.replaceAll('/', '');
    const dbPort = parseInt(url.port || "4000");
    const dbUser = url.username;
    const dbPass = url.password;
    const defaultOptions = {
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPass,
        decimalNumbers: true,
        timezone: 'Z'
    };    
    return Object.assign(defaultOptions, options);
}
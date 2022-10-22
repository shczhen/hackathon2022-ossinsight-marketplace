import path from 'path';
import { QueryManager } from '../../packages/query/QueryManager';

const queriesDir = path.join(__dirname, '../../configs/queries');
const queryManager = new QueryManager(queriesDir);

console.log(queryManager.getQuery('events-total'));

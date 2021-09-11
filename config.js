import { join, dirname } from 'path';
import { Low, JSONFileSync } from 'lowdb';
import { fileURLToPath } from 'url';
import lodash from 'lodash';

const __dirname = dirname(fileURLToPath(import.meta.url));

//Use JSON file for storage
const dbFile = join(__dirname, 'db.json');
const adapter = new JSONFileSync(dbFile);
const database = new Low(adapter);

//Read data from JSON file, this will set db.data content
await database.read();

//If file.json doesn't exists, db.data will be null
//So set the default data
database.data = database.data || { books: [] };
database.chain = lodash.chain(database.data);

await database.write();
export default database;

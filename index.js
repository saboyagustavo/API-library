import { join, dirname } from 'path';
import { Low, JSONFileSync } from 'lowdb';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import booksRouter from './routes/books.js';

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
await database.write();

const app = express();
app.db = database;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/books', booksRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

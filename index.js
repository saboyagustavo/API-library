import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import booksRouter from './routes/books.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/books', booksRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

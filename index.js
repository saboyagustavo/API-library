import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import booksRouter from './routes/books.js';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';

const optionsJsdoc = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API',
    },
    servers: [
      {
        url: 'http://localhost:4444',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specsDocs = swaggerJSDoc(optionsJsdoc);

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specsDocs));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/books', booksRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

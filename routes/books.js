import { Router } from 'express';
import { nanoid } from 'nanoid';
import database from './../config.js';

const router = Router();
const idLength = 8;

//get all books
router.get('/', (request, response) => {
  const books = database.data.books;
  return response.status(200).send(books);
});

router.post('/', async (request, response) => {
  try {
    const booksDb = database;
    const { title, author } = request.body;

    if (!title || !author) {
      return response.status(422).send({ error: 'Missing required information about the book!' });
    }

    const book = {
      id: nanoid(idLength),
      title,
      author,
    };

    await booksDb.data.books.push(book);
    await booksDb.write();

    return response.sendStatus(201);
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});

router.get('/:id', (request, response) => {
  const book = database.chain.get('books').find({ id: request.params.id }).value();

  console.log('book', book);
  if (!book) {
    return response.status(404).send({ error: 'Book not found!' });
  }

  return response.status(200).send(book);
});

export default router;

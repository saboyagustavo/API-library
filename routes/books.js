import { Router } from 'express';
import { nanoid } from 'nanoid';
import database from './../config.js';

const { chain: db } = database;
const router = Router();
const idLength = 8;

router.get('/', (request, response) => {
  const books = db.get('books');
  return response.status(200).send(books);
});

router.post('/', async (request, response) => {
  try {
    const { title, author } = request.body;

    if (!title || !author) {
      return response.status(422).send({ error: 'Missing required information about the book!' });
    }

    const book = {
      id: nanoid(idLength),
      title,
      author,
    };

    await database.data.books.push(book);
    await database.write();

    return response.status(201).send(book);
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});

router.get('/:id', (request, response) => {
  const book = db.get('books').find({ id: request.params.id }).value();

  if (!book) {
    return response.status(404).send({ error: 'Book not found!' });
  }

  return response.status(200).send(book);
});

router.put('/:id', async (request, response) => {
  try {
    const targetBook = db.get('books').find({ id: request.params.id });

    if (!targetBook) {
      return response.status(404).send({ error: 'Book not found!' });
    }

    const { title, author } = request.body;
    if (!title && !author) {
      return response.status(422).send({ error: 'Missing required information about the book!' });
    }

    const editedBook = {
      ...targetBook.value(),
      title: title || targetBook.value().title,
      author: author || targetBook.value().author,
    };

    console.log(editedBook);
    await targetBook.assign(editedBook).value();
    await database.write();

    response.send(targetBook);
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const targetBook = db.get('books').find({ id: request.params.id }).value();

    if (!targetBook) {
      return response.status(404).send({ error: 'Book not found!' });
    }

    await db.get('books').remove({ id: request.params.id }).value();
    await database.write();

    response.sendStatus(200);
  } catch (error) {
    return response.status(500).send({ error: error.message });
  }
});
export default router;

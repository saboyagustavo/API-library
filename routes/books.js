import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();
const idLength = 8;

//get all books
router.get('/', (request, response) => {
  const books = request.app.db.data.books;
  return response.status(200).send(books);
});

router.post('/', async (request, response) => {
  try {
    const booksDb = request.app.db;
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

export default router;

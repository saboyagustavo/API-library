import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();
const idLength = 8;

router.get('/', (request, response) => {
  const books = request.app.db.data.books;
  response.status(200).send(books);
});

export default router;

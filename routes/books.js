import { Router } from 'express';
import { nanoid } from 'nanoid';
import database from './../config.js';

const { chain: db } = database;
const router = Router();
const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the book
 *        title:
 *          type: string
 *          description: The book title
 *        author:
 *          type: string
 *          description: The book author
 *      example:
 *        id: d213haK
 *        title: Clean Code
 *        author: Robert C. Martin
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', (request, response) => {
  const books = db.get('books');
  return response.status(200).send(books);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get('/:id', (request, response) => {
  const book = db.get('books').find({ id: request.params.id }).value();

  if (!book) {
    return response.status(404).send({ error: 'The book was not found!' });
  }

  return response.status(200).send(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       422:
 *         description: Missing required information about the book
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      422:
 *        description: Missing required information about the book
 *      500:
 *        description: Some error happened
 */
router.put('/:id', async (request, response) => {
  try {
    const targetBook = db.get('books').find({ id: request.params.id });

    if (!targetBook) {
      return response.status(404).send({ error: 'The book was not found!' });
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

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */
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

import express, { Request, Response } from 'express';
import db from '../../db';
import axios from 'axios';

const router = express.Router();

router.post('/feedback', async (req: Request, res: Response) => {
  const { email, feedback } = req.body;
  try {
    const query = `
        INSERT INTO doubledrop_feedback (email, feedback)
        VALUES ($1, $2);
    `;
    await db.query(query, [email, feedback]);
    res.status(201).send();
  } catch (error) {
    throw error;
  }
});

export default router;

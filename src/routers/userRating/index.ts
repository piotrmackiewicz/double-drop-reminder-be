import express, { Request, Response } from 'express';
import db from '../../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const uid = await req.app.locals.uid;
  const query = `
    SELECT id, match_id FROM doubledrop_users_ratings
    WHERE uid = $1
  `;
  try {
    const result = await db.query(query, [uid]);
    res.status(200).json(result.rows);
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req: Request, res: Response) => {
  const uid = await req.app.locals.uid;
  const { matchId, rate } = req.body;
  const client = await db.connect();

  const userRatingsQuery = `
    INSERT INTO doubledrop_users_ratings (id, uid, match_id, rating)
    VALUES ($1, $2, $3, $4)
  `;

  const matchesQuery = `
    UPDATE doubledrop_matches
    SET ${rate ? 'thumbs_up = thumbs_up + 1' : 'thumbs_down = thumbs_down + 1'}
    WHERE id = $1;
  `;

  try {
    await client.query('BEGIN');
    await client.query(userRatingsQuery, [uuidv4(), uid, matchId, rate]);
    await client.query(matchesQuery, [matchId]);
    await client.query('COMMIT');
    res.status(201).send();
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
});

export default router;

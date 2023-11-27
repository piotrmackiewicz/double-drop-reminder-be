import express, { Request, Response } from 'express';
import db from '../../db';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const uid = await req.app.locals.uid;
  const query = `
    SELECT thumb_up_matches_ids, thumb_down_matches_ids
    FROM doubledrop_users_ratings
    WHERE uid = $1;
  `;
  try {
    const result = await db.query(query, [uid]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req: Request, res: Response) => {
  const uid = await req.app.locals.uid;
  const { matchId, rate } = req.body;
  const client = await db.connect();

  const userRatingsQuery = `
    UPDATE doubledrop_users_ratings
    SET ${
      rate === 0
        ? 'thumb_down_matches_ids = ARRAY_APPEND(thumb_down_matches_ids, $1)'
        : 'thumb_up_matches_ids = ARRAY_APPEND(thumb_up_matches_ids, $1)'
    }
    WHERE uid = $2;
  `;

  const matchesQuery = `
    UPDATE doubledrop_matches
    SET ${
      rate === 0 ? 'thumbs_down = thumbs_down + 1' : 'thumbs_up = thumbs_up + 1'
    }
    WHERE id = $1;
  `;

  try {
    await client.query('BEGIN');
    await client.query(userRatingsQuery, [matchId, uid]);
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

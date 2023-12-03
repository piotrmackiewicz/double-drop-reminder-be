import express, { Request, Response } from 'express';
import db from '../../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { originTrackId, matchingTrackId } = req.body;
  const query = `
    INSERT INTO doubledrop_matches (id, track_1, track_2)
    VALUES ($1, $2, $3)
  `;
  try {
    await db.query(query, [uuidv4(), originTrackId, matchingTrackId]);
    res.status(204).send();
  } catch (error) {
    throw error;
  }
});

router.get('/', async (req: Request, res: Response) => {
  const ids = req.query.ids;
  if (!ids) {
    res.status(404).send();
  }

  const query = `
    SELECT id, track_1, track_2, thumbs_up, thumbs_down
    FROM doubledrop_matches
    WHERE id = ANY($1::varchar[])
  `;

  try {
    const result = await db.query(query, [ids]);
    res.status(200).json(result.rows);
  } catch (error) {
    throw error;
  }
});

router.get('/:trackId', async (req: Request, res: Response) => {
  const { trackId } = req.params;
  try {
    const query = `
      SELECT id, track_1, track_2, thumbs_up, thumbs_down
      FROM doubledrop_matches
      WHERE track_1 = $1 OR track_2 = $1
    `;
    const matchingTracks = await db.query(query, [trackId]);
    res.status(200).json(matchingTracks.rows);
  } catch (error) {
    throw error;
  }
});

export default router;

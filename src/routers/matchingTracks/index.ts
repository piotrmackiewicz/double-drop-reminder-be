import express, { Request, Response } from 'express';
import { Pool } from 'pg';

export default (db: Pool) => {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { originTrackId, matchingTrackId } = req.body;
    const query = `
      INSERT INTO doubledrop_matches (track_1, track_2)
      VALUES ($1, $2)
    `;
    try {
      await db.query(query, [originTrackId, matchingTrackId]);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  });

  router.get('/:trackId', async (req: Request, res: Response) => {
    const { trackId } = req.params;
    try {
      const query = `
        SELECT id, artist, title 
        FROM doubledrop_tracks
        WHERE id = ANY((SELECT track_1 FROM doubledrop_matches WHERE track_2 = $1))
        OR id = ANY((SELECT track_2 FROM doubledrop_matches WHERE track_1 = $1))
      `;
      const matchingTracks = await db.query(query, [trackId]);
      res.status(200).json(matchingTracks.rows);
    } catch (error) {
      throw error;
    }
  });

  return router;
};

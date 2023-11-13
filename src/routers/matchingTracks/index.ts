import express, { Request, Response } from 'express';
import { Pool } from 'pg';

export default (db: Pool) => {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { originTrackId, matchingTrackId } = req.body;
    const query = `
        UPDATE doubledrop_tracks
        SET matching_tracks = matching_tracks || array[$2]::integer[][]
        WHERE
            id = $1
            AND not(matching_tracks @> array[$2]::integer[][])
    `;
    try {
      await db.query(query, [originTrackId, matchingTrackId]);
      await db.query(query, [matchingTrackId, originTrackId]);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  });

  router.delete('/', async (req: Request, res: Response) => {
    const { originTrackId, matchingTrackId } = req.body;
    const query = `
        UPDATE doubledrop_tracks
        SET matching_tracks = array_remove(matching_tracks, $2)
        WHERE id = $1
    `;
    try {
      await db.query(query, [originTrackId, matchingTrackId]);
      await db.query(query, [matchingTrackId, originTrackId]);
      res.status(200).send();
    } catch (error) {
      throw error;
    }
  });

  router.get('/:trackId', async (req: Request, res: Response) => {
    const { trackId } = req.params;
    try {
      const query = `
        SELECT id, artist, title, matching_tracks
        FROM doubledrop_tracks WHERE id = ANY((SELECT matching_tracks FROM tracks WHERE id = $1)::integer[]) 
      `;
      const matchingTracks = await db.query(query, [trackId]);
      res.status(200).json(matchingTracks.rows);
    } catch (error) {
      throw error;
    }
  });

  return router;
};

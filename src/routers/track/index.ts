import express, { Request, Response } from 'express';
import { Pool } from 'pg';

export default (db: Pool) => {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { title, artist } = req.body;
    const query = `
        INSERT into doubledrop_tracks (artist, title) VALUES ($1, $2) RETURNING id, artist, title, matching_tracks;
    `;
    try {
      const result = await db.query(query, [artist, title]);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      throw error;
    }
  });

  router.get('/:trackId', async (req: Request, res: Response) => {
    const { trackId } = req.params;
    const query = `
      SELECT id, artist, title, matching_tracks, thumbs_up, thumbs_down FROM doubledrop_tracks WHERE id = $1
    `;
    try {
      const result = await db.query(query, [trackId]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      throw error;
    }
  });

  router.delete('/:trackId', async (req: Request, res: Response) => {
    const { trackId } = req.params;
    const query = `
        DELETE FROM doubledrop_tracks WHERE id = $1;
    `;
    const deleteMatchesQuery = `
        UPDATE doubledrop_tracks
        SET matching_tracks = array_remove(matching_tracks, $1)
    `;
    try {
      await db.query(query, [trackId]);
      await db.query(deleteMatchesQuery, [trackId]);
      res.status(200).send();
    } catch (error) {
      throw error;
    }
  });

  return router;
};

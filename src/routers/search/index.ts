import express, { Request, Response } from 'express';
import { Pool } from 'pg';

export default (db: Pool) => {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { field } = req.query;
    const { search } = req.body;
    let queryFields = "artist || ' ' || title";

    if (field === 'artist') {
      queryFields = 'artist';
    } else if (field === 'title') {
      queryFields = 'title';
    }
    let query = ` 
            SELECT id, title, artist, matching_tracks, thumbs_up, thumbs_down
            FROM doubledrop_tracks
            WHERE to_tsvector('simple', ${queryFields}) @@ to_tsquery('simple', $1);`;

    try {
      const results = await db.query(query, ["'" + search + "':*"]);
      res.status(200).json(results.rows);
    } catch (error) {
      throw error;
    }
  });

  return router;
};

import express, { Request, Response } from 'express';
import db from '../../db';

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
        SELECT tracks.id, tracks.artist, tracks.title, matches.id as match_id, matches.thumbs_up, matches.thumbs_down
        FROM doubledrop_matches as matches
        LEFT JOIN doubledrop_tracks as tracks ON (tracks.id = matches.track_1 OR tracks.id = matches.track_2) AND tracks.id != $1
        WHERE matches.track_1 = $1 OR matches.track_2 = $1
      `;
    const matchingTracks = await db.query(query, [trackId]);
    res.status(200).json(matchingTracks.rows);
  } catch (error) {
    throw error;
  }
});

export default router;

import express, { Request, Response } from 'express';
import db from '../../db';
import axios from 'axios';

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
            SELECT id, title, artist 
            FROM doubledrop_tracks
            WHERE to_tsvector('simple', ${queryFields}) @@ to_tsquery('simple', $1);`;

  try {
    const results = await db.query(query, ["'" + search + "':*"]);
    res.status(200).json(results.rows);
  } catch (error) {
    throw error;
  }
});

router.get('/get-spotify-token', async (req: Request, res: Response) => {
  const result = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  res.status(200).json({ accessToken: result.data.access_token });
});

export default router;

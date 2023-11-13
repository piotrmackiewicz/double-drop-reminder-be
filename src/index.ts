import express, { Request, Response } from 'express';
import searchRouter from './routers/search';
import matchingTracksRouter from './routers/matchingTracks';
import trackRouter from './routers/track';
import pool from './db';
// import cors from 'cors'
require('dotenv').config();

const port = process.env.PORT || 8080;

const app = express();

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/search', searchRouter(pool));
app.use('/matching-tracks', matchingTracksRouter(pool));
app.use('/track', trackRouter(pool));

// app.get('/', (_req: Request, res: Response) => {
//   return res.send('Express Typescript on Vercel');
// });

// app.get('/ping', (_req: Request, res: Response) => {
//   return res.send('pong 🏓');
// });

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

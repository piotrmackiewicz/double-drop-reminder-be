import express from 'express';
import searchRouter from './routers/search';
import matchingTracksRouter from './routers/matchingTracks';
import trackRouter from './routers/track';
import pool from './db';
import cors from 'cors';
require('dotenv').config();

const port = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    origin: 'https://double-drop-reminder-fe.vercel.app',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/search', searchRouter(pool));
app.use('/matching-tracks', matchingTracksRouter(pool));
app.use('/track', trackRouter(pool));

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

import express, { NextFunction, Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import authRouter from './routers/authRouter';
import searchRouter from './routers/search';
import matchesRouter from './routers/matches';
import trackRouter from './routers/track';
import userRatingRouter from './routers/userRating';
import cors from 'cors';
import admin from 'firebase-admin';
require('dotenv').config();

const port = process.env.PORT || 8080;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

admin.initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);

const app = express();

if (app.get('env') === 'development') {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: 'https://ddreminder.vercel.app',
    })
  );
}

const checkUser = async (idToken: string) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken.uid;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const idToken = req.headers.authorization;
    if (!idToken) {
      res.status(401).send();
    }
    const uid = checkUser(idToken);

    req.app.locals.uid = uid;
    next();
  } catch (err) {
    res.status(401).json(err);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', [authRouter(firebaseApp)]);
app.use('/search', [authMiddleware, searchRouter]);
app.use('/user-rating', [authMiddleware, userRatingRouter]);
app.use('/matches', [authMiddleware, matchesRouter]);
app.use('/track', [authMiddleware, trackRouter]);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

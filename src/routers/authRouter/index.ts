import express, { Request, Response } from 'express';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import db from '../../db';

export default (app: FirebaseApp) => {
  const router = express.Router();
  const auth = getAuth(app);

  router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = result.user;

      const query = `
        INSERT INTO doubledrop_users_ratings (uid) VALUES ($1)
      `;
      await db.query(query, [uid]);

      res.status(201).send();
    } catch (err) {
      throw err;
    }
  });

  return router;
};

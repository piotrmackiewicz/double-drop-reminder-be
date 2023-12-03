import express, { Request, Response } from 'express';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

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
      const user = result.user;
      await sendEmailVerification(result.user);

      res.status(201).send();
    } catch (err) {
      throw err;
    }
  });

  return router;
};

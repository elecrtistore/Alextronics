import { Request, Response } from 'express';
import { getRoleForEmail } from '../utils/userRoles';

export async function getProfile(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const role = getRoleForEmail(firebaseUser.email);
  res.json({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.name || firebaseUser.email,
    role
  });
}

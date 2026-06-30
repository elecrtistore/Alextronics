import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

export async function validateFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.locals.firebaseUser = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

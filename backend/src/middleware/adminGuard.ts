import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin';

function parseEmailList(value?: string) {
  return (value || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function adminGuard(req: Request, res: Response, next: NextFunction) {
  const firebaseUser = res.locals.firebaseUser;
  if (!firebaseUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const adminRecord = await Admin.findOne({ firebaseUID: firebaseUser.uid });
  if (adminRecord) return next();

  const adminEmails = parseEmailList(process.env.ADMIN_EMAILS);
  if (firebaseUser.email && adminEmails.includes(firebaseUser.email.trim().toLowerCase())) {
    return next();
  }

  return res.status(403).json({ message: 'Admin access required' });
}

import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getRoleForEmail } from '../utils/userRoles';
import Admin from '../models/Admin';
import { sendPasswordResetEmail } from './emailController';

export async function getProfile(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const role = await getRoleForEmail(firebaseUser.email, firebaseUser.uid);
  res.json({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.name || firebaseUser.email,
    role
  });
}

export async function updateProfile(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { displayName } = req.body;
  if (!displayName) {
    return res.status(400).json({ message: 'displayName is required' });
  }

  const role = await getRoleForEmail(firebaseUser.email, firebaseUser.uid);
  res.json({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName,
    role
  });
}

export async function signup(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  if (!firebaseUser || !firebaseUser.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { role, adminCode, displayName } = req.body;

  if (role === 'Admin') {
    const secretCode = process.env.ADMIN_SECRET_CODE;
    if (!secretCode || adminCode !== secretCode) {
      return res.status(403).json({ message: 'Invalid admin code.' });
    }

    await Admin.findOneAndUpdate(
      { firebaseUID: firebaseUser.uid },
      { firebaseUID: firebaseUser.uid, email: firebaseUser.email, role: 'admin' },
      { upsert: true, new: true }
    );
  }

  const assignedRole = role === 'Admin' ? 'Admin' : await getRoleForEmail(firebaseUser.email, firebaseUser.uid);
  res.json({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: displayName || firebaseUser.name || firebaseUser.email,
    role: assignedRole
  });
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const actionCodeSettings = {
      url: frontendUrl,
      handleCodeInApp: true,
    };

    const resetLink = await getAuth().generatePasswordResetLink(email, actionCodeSettings);
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'Password reset email sent' });
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      return res.json({ message: 'Password reset email sent' });
    }
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
}

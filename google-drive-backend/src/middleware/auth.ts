import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  uid?: string;
  email?: string;
}

export const authenticateFirebase = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split(' ')[1]; // ✅ Correct split

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email || undefined;
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

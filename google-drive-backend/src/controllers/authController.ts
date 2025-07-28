// controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  const { uid, email } = req;

  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing UID or email from token' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { id: uid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid, // Firebase UID
          email,
          firebaseUid: uid,
        },
      });
    } else {
      // Optionally update user info if needed
      user = await prisma.user.update({
        where: { id: uid },
        data: { email },
      });
    }

    res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

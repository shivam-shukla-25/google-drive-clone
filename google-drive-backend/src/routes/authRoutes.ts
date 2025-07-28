// routes/authRoutes.ts
import { Router } from 'express';
import { authenticateFirebase } from '../middleware/auth';
import { getCurrentUser } from '../controllers/authController';

const router = Router();

router.get('/me', authenticateFirebase, getCurrentUser);

export default router;


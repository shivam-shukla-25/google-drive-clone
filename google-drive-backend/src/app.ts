import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folderRoutes';
import fileRoutes from './routes/fileRoutes';
import { authenticateFirebase } from './middleware/auth'; // ✅ Correct middleware
import authRoutes from './routes/authRoutes';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Protected Routes
app.use('/folders', authenticateFirebase, folderRoutes); // ✅ Apply auth
app.use('/files', authenticateFirebase, fileRoutes);     // ✅ Apply auth

// Health check / base route
app.get('/', (_req, res) => {
  res.send('Google Drive Clone Backend');
});

export default app;

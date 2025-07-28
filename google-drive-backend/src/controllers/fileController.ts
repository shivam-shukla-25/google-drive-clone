import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import fs from 'fs';
import { File as MulterFile } from 'multer';
import { PrismaClient } from '@prisma/client';

interface MulterRequest extends Request {
  file?: MulterFile;
}

const prisma = new PrismaClient();

export const uploadFile = async (req: MulterRequest, res: Response) => {
  const userId = (req as any).uid;
  const folderId = req.body.folderId || 'root';
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Save metadata to Prisma (SQLite)
    const savedFile = await prisma.file.create({
      data: {
        name: file.originalname,
        url: file.path,
        size: file.size,
        contentType: file.mimetype,
        folderId: folderId === 'root' ? null : folderId,
        userId,
      },
    });
    res.status(201).json(savedFile);
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listFiles = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { folderId } = req.query;
  try {
    const files = await prisma.file.findMany({
      where: {
        userId,
        folderId: folderId ? String(folderId) : null,
      },
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};

export const getFileInfo = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { id } = req.params;
  try {
    const file = await prisma.file.findFirst({ where: { id, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get file' });
  }
};

export const renameFile = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { id } = req.params;
  let { name } = req.body;
  try {
    const file = await prisma.file.findFirst({ where: { id, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });
    // Preserve extension
    const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
    if (!name.endsWith(ext)) {
      name += ext;
    }
    // Rename file on disk
    const oldPath = file.url;
    const newPath = oldPath ? oldPath.replace(/[^/]+$/, name) : null;
    if (oldPath && newPath && fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }
    // Update DB metadata
    const updated = await prisma.file.update({
      where: { id },
      data: { name, url: newPath },
    });
    res.json({ message: 'File renamed', file: updated });
  } catch (err) {
    res.status(500).json({ message: 'Rename failed' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { id } = req.params;
  try {
    const file = await prisma.file.findFirst({ where: { id, userId } });
    if (!file) return res.status(404).json({ message: 'File not found' });
    // Delete file from local storage
    if (file.url && fs.existsSync(file.url)) {
      fs.unlinkSync(file.url);
    }
    await prisma.file.delete({ where: { id } });
    res.json({ message: 'File deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFolder = async (req: Request, res: Response) => {
  const { name, parentId } = req.body;
  const userId = (req as any).uid;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId: parentId || null,
        userId,
      },
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Failed to create folder' });
  }
};

export const listFolders = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: { children: true, files: true },
    });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch folders' });
  }
};

export const renameFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = (req as any).uid;

  try {
    const folder = await prisma.folder.updateMany({
      where: { id, userId },
      data: { name },
    });

    res.json({ message: 'Folder renamed', count: folder.count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rename folder' });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).uid;

  try {
    await prisma.folder.deleteMany({ where: { id, userId } });
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete folder' });
  }
};

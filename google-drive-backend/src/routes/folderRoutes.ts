import express from 'express';
import {
  createFolder,
  deleteFolder,
  listFolders,
  renameFolder,
} from '../controllers/folderController';

const router = express.Router();

router.post('/', createFolder);
router.get('/', listFolders);
router.patch('/:id', renameFolder);
router.delete('/:id', deleteFolder);

export default router;

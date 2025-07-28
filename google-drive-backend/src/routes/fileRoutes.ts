import { Router } from 'express';
import { uploadFile, listFiles, getFileInfo, renameFile, deleteFile } from '../controllers/fileController';
import { upload } from '../middleware/uploads';
import { authenticateFirebase } from '../middleware/auth';
const router = Router();

router.post('/upload',upload.single('file'), uploadFile);
router.get('/', listFiles);
router.get('/:id', getFileInfo);
router.put('/:id/rename', renameFile);
router.delete('/:id', deleteFile);

export default router;

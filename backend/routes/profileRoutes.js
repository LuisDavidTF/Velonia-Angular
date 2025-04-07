import express from 'express';
import { profileController } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/veryfyToken.js';

const router = express.Router();

router.get('/', verifyToken, profileController.getProfile);
router.put('/edit', verifyToken, profileController.updateProfile);

export default router;

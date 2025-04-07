import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.post('/logout', authController.logout);

export default router;

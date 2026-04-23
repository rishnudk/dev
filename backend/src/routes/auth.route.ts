import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/magic-link', authController.sendMagicLink);

router.get('/verify', authController.verifyToken);

router.get('/me', authMiddleware, authController.getMe);

export default router;
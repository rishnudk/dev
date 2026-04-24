import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.put('/profile', authMiddleware, userController.updateProfile)
router.get('/check-username/:username', authMiddleware, userController.checkUsername)


router.get('/:username', userController.getProfile)

export default router
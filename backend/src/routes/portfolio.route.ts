import { Router } from 'express'
import { portfolioController } from '../controllers/portfolio.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { uploadMiddleware } from '../middlewares/upload.middleware'

const router = Router()

// Public
router.get('/:id', portfolioController.getPortfolio)

// Protected
router.post(
  '/',
  authMiddleware,
  uploadMiddleware.single('heroImage'),  // multer handles the file
  portfolioController.createPortfolio
)

router.delete(
  '/:id',
  authMiddleware,
  portfolioController.deletePortfolio
)

export default router
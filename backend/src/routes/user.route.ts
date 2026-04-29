import { Router } from 'express'
import { userController }        from '../controllers/user.controller'
import { authMiddleware }        from '../middlewares/auth.middleware'
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware'

const router = Router()

// ── Protected ─────────────────────────────────────────────
router.put(
  '/profile',
  authMiddleware,
  userController.updateProfile
)

router.get(
  '/me/portfolios',
  authMiddleware,
  userController.getMyPortfolios
)

router.get(
  '/check-username/:username',
  authMiddleware,
  userController.checkUsername
)

// ── Public ────────────────────────────────────────────────
router.get(
  '/:username/profile',
  optionalAuthMiddleware,
  userController.getProfileWithStats
)

// Keep old route for backward compat
router.get(
  '/:username',
  userController.getProfile
)

export default router
import { Router } from 'express'
import { portfolioController } from '../controllers/portfolio.controller'
import { voteController }      from '../controllers/vote.controller'
import { authMiddleware }      from '../middlewares/auth.middleware'
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware'
import { uploadMiddleware }    from '../middlewares/upload.middleware'
import { voteLimiter } from '../middlewares/rateLimit.middleware'

const router = Router()

// ── Feed ─────────────────────────────────────────────────
router.get('/', optionalAuthMiddleware, portfolioController.getFeed)

// ── Single portfolio ──────────────────────────────────────
router.get('/:id', optionalAuthMiddleware, portfolioController.getPortfolio)

// ── Vote routes ───────────────────────────────────────────
router.post(
  '/:id/vote', 
  authMiddleware, voteLimiter,
  voteController.castVote
)

router.delete(
  '/:id/vote',
  authMiddleware, voteLimiter,
  voteController.removeVote
)

router.get(
  '/:id/vote',
  authMiddleware,
  voteController.getVoteStatus
)

router.get(
  '/:id/voters',
  voteController.getVoters
)

// ── Create + Delete portfolio ─────────────────────────────
router.post(
  '/',
  authMiddleware, voteLimiter, 
  uploadMiddleware.single('heroImage'),
  portfolioController.createPortfolio
)

router.delete(
  '/:id',
  authMiddleware,
  portfolioController.deletePortfolio
)

export default router
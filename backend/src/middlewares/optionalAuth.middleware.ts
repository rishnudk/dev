import { Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { AuthRequest } from '../types'

// Like authMiddleware but doesn't reject if no token
// Just attaches user if token exists
export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader?.startsWith('Bearer ')) {
      const token   = authHeader.split(' ')[1]
      req.user      = authService.verifyJwt(token)
    }
  } catch {
    // No token or invalid — just continue without user
  }

  next()
}
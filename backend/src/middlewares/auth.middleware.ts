import { Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { ApiResponse } from '../utils/ApiResponse'
import { AuthRequest } from '../types'

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        ApiResponse.error('No token provided')
      )
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1]

    // 3. Verify and decode
    const decoded = authService.verifyJwt(token)

    // 4. Attach user to request — available in all downstream handlers
    req.user = decoded

    next()

  } catch (error) {
    return res.status(401).json(
      ApiResponse.error('Unauthorized')
    )
  }
}
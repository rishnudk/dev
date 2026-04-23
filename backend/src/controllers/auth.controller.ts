import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { ApiResponse } from '../utils/ApiResponse'
import { AuthRequest } from '../types'

export const authController = {

  // POST /api/auth/magic-link
  async sendMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      if (!email || !email.includes('@')) {
        return res.status(400).json(
          ApiResponse.error('Please provide a valid email')
        )
      }

      const result = await authService.sendMagicLink(email.toLowerCase().trim())
      res.json(ApiResponse.success(result))

    } catch (error) {
      next(error)
    }
  },


  // GET /api/auth/verify?token=xxx
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query

      if (!token || typeof token !== 'string') {
        return res.status(400).json(
          ApiResponse.error('Token is required')
        )
      }

      const result = await authService.verifyMagicToken(token)
      res.json(ApiResponse.success(result))

    } catch (error) {
      next(error)
    }
  },


  // GET /api/auth/me  (protected)
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user!.userId)
      res.json(ApiResponse.success(user))
    } catch (error) {
      next(error)
    }
  }
}
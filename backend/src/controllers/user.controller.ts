import { Response, NextFunction } from 'express'
import { userService } from '../services/user.service'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthRequest } from '../types'
import { Field } from '@prisma/client'
import prisma from '../config/db'

export const userController = {

  // PUT /api/users/profile
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        name, username, field,
        bio, techStack, portfolioUrl,
        githubUrl, linkedinUrl, avatarUrl
      } = req.body

      // Basic validation
      if (!name || !username || !field) {
        throw ApiError.badRequest('Name, username and field are required')
      }

      if (!Object.values(Field).includes(field)) {
        throw ApiError.badRequest('Invalid field value')
      }

      if (!Array.isArray(techStack) || techStack.length === 0) {
        throw ApiError.badRequest('Select at least one tech stack item')
      }

      const user = await userService.updateProfile(req.user!.userId, {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        field,
        bio: bio?.trim(),
        techStack,
        portfolioUrl: portfolioUrl?.trim(),
        githubUrl: githubUrl?.trim(),
        linkedinUrl: linkedinUrl?.trim(),
        avatarUrl
      })

      res.json(ApiResponse.success(user, 'Profile updated successfully'))

    } catch (error) {
      next(error)
    }
  },


  // GET /api/users/:username
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const user = await userService.getProfile(username as string )
      res.json(ApiResponse.success(user))
    } catch (error) {
      next(error)
    }
  },


  // GET /api/users/check-username/:username
  async checkUsername(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params
      const result = await userService.checkUsername(
        username as string,
        req.user!.userId
      )
      res.json(ApiResponse.success(result))
    } catch (error) {
      next(error)
    }
  },

  // GET /api/users/:username/profile
  async getProfileWithStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username } = req.params
      const profile = await userService.getProfileWithStats(
        username as string,
        req.user?.userId
      )
      res.json(ApiResponse.success(profile))
    } catch (error) {
      next(error)
    }
  },


  // GET /api/users/me/portfolios
  // Get logged in user's own portfolios
  async getMyPortfolios(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const portfolios = await prisma.portfolio.findMany({
        where:   { userId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { votes: true } },
          tags:   { include: { tag: true } }
        }
      })

      const shaped = portfolios.map((p) => ({
        ...p,
        voteCount: p._count.votes,
        hasVoted:  false
      }))

      res.json(ApiResponse.success(shaped))
    } catch (error) {
      next(error)
    }
  }
}
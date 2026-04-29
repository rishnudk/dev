import { Response, NextFunction } from 'express'
import { portfolioService } from '../services/portfolio.service'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { AuthRequest } from '../types'

export const portfolioController = {

  // POST /api/portfolios
  async createPortfolio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, liveUrl, tags } = req.body
      const file = req.file

      // Validate required fields
      if (!title?.trim()) {
        throw ApiError.badRequest('Title is required')
      }
      if (!description?.trim()) {
        throw ApiError.badRequest('Description is required')
      }
      if (!liveUrl?.trim()) {
        throw ApiError.badRequest('Live URL is required')
      }
      if (!file) {
        throw ApiError.badRequest('Hero image is required')
      }

      // Parse tags — sent as JSON string from multipart form
      let parsedTags: string[] = []
      try {
        parsedTags = JSON.parse(tags || '[]')
      } catch {
        throw ApiError.badRequest('Invalid tags format')
      }

      if (parsedTags.length === 0) {
        throw ApiError.badRequest('Add at least one tag')
      }

      const portfolio = await portfolioService.createPortfolio(
        req.user!.userId,
        { title, description, liveUrl, tags: parsedTags },
        file.buffer,
        file.mimetype
      )

      res.status(201).json(
        ApiResponse.success(portfolio, 'Portfolio submitted successfully')
      )

    } catch (error) {
      next(error)
    }
  },


  // GET /api/portfolios/:id
  async getPortfolio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const portfolio = await portfolioService.getPortfolioById(
        req.params.id as string,
        req.user?.userId
      )
      res.json(ApiResponse.success(portfolio))
    } catch (error) {
      next(error)
    }
  },


  // DELETE /api/portfolios/:id
  async deletePortfolio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await portfolioService.deletePortfolio(
        req.params.id as string,
        req.user!.userId
      )
      res.json(ApiResponse.success(result))
    } catch (error) {
      next(error)
    }
  },
  
// GET /api/portfolios
  async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const feed   = (req.query.feed   as string) || 'trending'
      const field  = (req.query.field  as string) || 'ALL'
      const cursor = req.query.cursor  as string | undefined
      const limit  = Math.min(Number(req.query.limit) || 12, 50)

      if (!['trending', 'newest', 'top'].includes(feed)) {
        throw ApiError.badRequest('Invalid feed type')
      }

      const result = await portfolioService.getFeed({
        feed:  feed as 'trending' | 'newest' | 'top',
        field,
        cursor,
        limit,
        requestingUserId: req.user?.userId
      })

      res.json(ApiResponse.success(result))
    } catch (error) {
      next(error)
    }
  }

}
import { Response, NextFunction } from 'express'
import { voteService } from '../services/vote.service'
import { ApiResponse } from '../utils/ApiResponse'
import { AuthRequest } from '../types'

export const voteController = {

  // POST /api/portfolios/:id/vote
  async castVote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await voteService.toggleVote(
        req.user!.userId,
        req.params.id as string
      )

      const message = result.voted
        ? 'Vote cast successfully'
        : 'Vote removed successfully'

      res.json(ApiResponse.success(result, message))

    } catch (error) {
      next(error)
    }
  },


  // DELETE /api/portfolios/:id/vote
  // Calls same toggleVote — result tells us what happened
  async removeVote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await voteService.toggleVote(
        req.user!.userId,
        req.params.id as string
      )

      res.json(ApiResponse.success(result, 'Vote updated'))

    } catch (error) {
      next(error)
    }
  },


  // GET /api/portfolios/:id/vote
  async getVoteStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await voteService.getVoteStatus(
        req.user!.userId,
        req.params.id as string
      )

      res.json(ApiResponse.success(result))

    } catch (error) {
      next(error)
    }
  },


  // GET /api/portfolios/:id/voters
  async getVoters(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const voters = await voteService.getVoters(req.params.id as string)
      res.json(ApiResponse.success(voters))
    } catch (error) {
      next(error)
    }
  }
}
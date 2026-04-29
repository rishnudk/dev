import prisma from '../config/db'
import { ApiError } from '../utils/ApiError'
import { rankingService } from './ranking.service'

export const voteService = {

  // ── TOGGLE VOTE ──────────────────────────────────────────
  // One method handles both cast and remove
  async toggleVote(userId: string, portfolioId: string) {

    // 1. Check portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where:   { id: portfolioId },
      include: { _count: { select: { votes: true } } }
    })

    if (!portfolio) {
      throw ApiError.notFound('Portfolio not found')
    }

    // 2. Can't vote on your own portfolio
    if (portfolio.userId === userId) {
      throw ApiError.badRequest("You can't vote on your own portfolio")
    }

    // 3. Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_portfolioId: { userId, portfolioId }
      }
    })

    // 4. Run vote toggle + score update in ONE transaction
    // Either both succeed or both fail — no partial state
    const result = await prisma.$transaction(async (tx) => {

      let voteCount: number

      if (existingVote) {
        // ── Remove vote ──
        await tx.vote.delete({
          where: {
            userId_portfolioId: { userId, portfolioId }
          }
        })
        voteCount = portfolio._count.votes - 1

      } else {
        // ── Cast vote ──
        await tx.vote.create({
          data: { userId, portfolioId }
        })
        voteCount = portfolio._count.votes + 1
      }

      // 5. Recalculate trending score inside the same transaction
      const newScore = rankingService.calculateTrendingScore(
        voteCount,
        portfolio.createdAt
      )

      // 6. Update portfolio score
      const updated = await tx.portfolio.update({
        where: { id: portfolioId },
        data:  { trendingScore: newScore }
      })

      return {
        voted:         !existingVote,   // true = voted, false = unvoted
        voteCount,
        trendingScore: updated.trendingScore
      }
    })

    return result
  },


  // ── GET VOTE STATUS ──────────────────────────────────────
  // Check if a specific user has voted on a portfolio
  async getVoteStatus(userId: string, portfolioId: string) {
    const vote = await prisma.vote.findUnique({
      where: {
        userId_portfolioId: { userId, portfolioId }
      }
    })

    const portfolio = await prisma.portfolio.findUnique({
      where:   { id: portfolioId },
      include: { _count: { select: { votes: true } } }
    })

    return {
      hasVoted:  !!vote,
      voteCount: portfolio?._count.votes ?? 0
    }
  },


  // ── GET VOTERS ───────────────────────────────────────────
  // Who voted on a portfolio — useful for profile page later
  async getVoters(portfolioId: string) {
    const votes = await prisma.vote.findMany({
      where:   { portfolioId },
      include: {
        user: {
          select: {
            id: true, name: true,
            username: true, avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take:    20
    })

    return votes.map((v) => v.user)
  }
}
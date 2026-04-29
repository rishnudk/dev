import prisma from '../config/db'

export const rankingService = {

  calculateTrendingScore(upvotes: number, createdAt: Date): number {
    const ageInHours = (Date.now() - createdAt.getTime()) / 3600000
    const gravity    = 1.8
    return upvotes / Math.pow(ageInHours + 2, gravity)
  },


  // ── RECALCULATE ALL SCORES ───────────────────────────────
  // Run this periodically — scores decay over time
  async recalculateAllScores() {
    console.log('Recalculating trending scores...')

    const portfolios = await prisma.portfolio.findMany({
      include: { _count: { select: { votes: true } } }
    })

    // Update all scores in parallel
    await Promise.all(
      portfolios.map((p) => {
        const newScore = rankingService.calculateTrendingScore(
          p._count.votes,
          p.createdAt
        )
        return prisma.portfolio.update({
          where: { id: p.id },
          data:  { trendingScore: newScore }
        })
      })
    )

    console.log(`Updated scores for ${portfolios.length} portfolios`)
  }
}
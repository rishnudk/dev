export const rankingService = {

  // Hacker News ranking algorithm
  // More upvotes = higher score
  // Older posts decay over time
  calculateTrendingScore(upvotes: number, createdAt: Date): number {
    const ageInHours = (Date.now() - createdAt.getTime()) / 3600000
    const gravity    = 1.8

    return upvotes / Math.pow(ageInHours + 2, gravity)
  }
}
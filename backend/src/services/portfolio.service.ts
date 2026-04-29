import prisma from '../config/db'
import { ApiError } from '../utils/ApiError'
import { uploadService } from './upload.service'

interface CreatePortfolioInput {
  title:       string
  description: string
  liveUrl:     string
  tags:        string[]
}

export const portfolioService = {

  // ── CREATE PORTFOLIO ─────────────────────────────────────
  async createPortfolio(
    userId:      string,
    input:       CreatePortfolioInput,
    imageBuffer: Buffer,
    imageMime:   string
  ) {
    // 1. Check user is onboarded
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.isOnboarded) {
      throw ApiError.badRequest('Complete your profile before submitting')
    }

    // 2. Upload hero image to Cloudinary
    const heroImageUrl = await uploadService.uploadHeroImage(
      imageBuffer,
      imageMime,
      userId
    )

    // 3. Find or create tags
    const tagRecords = await Promise.all(
      input.tags.map((name) =>
        prisma.tag.upsert({
          where:  { name: name.toLowerCase() },
          update: {},
          create: { name: name.toLowerCase() }
        })
      )
    )

    // 4. Create portfolio with tags in one transaction
    const portfolio = await prisma.$transaction(async (tx) => {
      const created = await tx.portfolio.create({
        data: {
          userId,
          title:        input.title,
          description:  input.description,
          liveUrl:      input.liveUrl,
          heroImageUrl,
          trendingScore: 0,
        }
      })

      // Connect tags
      await tx.portfolioTag.createMany({
        data: tagRecords.map((tag) => ({
          portfolioId: created.id,
          tagId:       tag.id
        }))
      })

      return created
    })

    // 5. Return with full relations
    return prisma.portfolio.findUnique({
      where:   { id: portfolio.id },
      include: {
        user: {
          select: {
            id: true, name: true,
            username: true, avatarUrl: true, field: true
          }
        },
        tags:   { include: { tag: true } },
        _count: { select: { votes: true } }
      }
    })
  },


  // ── GET SINGLE PORTFOLIO ─────────────────────────────────
  async getPortfolioById(id: string, requestingUserId?: string) {
    const portfolio = await prisma.portfolio.findUnique({
      where:   { id },
      include: {
        user: {
          select: {
            id: true, name: true, username: true,
            avatarUrl: true, field: true, techStack: true,
            bio: true, githubUrl: true, linkedinUrl: true
          }
        },
        tags:   { include: { tag: true } },
        _count: { select: { votes: true } },
        // Check if requesting user has voted
        votes: requestingUserId
          ? { where: { userId: requestingUserId } }
          : false
      }
    })

    if (!portfolio) throw ApiError.notFound('Portfolio not found')

    return {
      ...portfolio,
      voteCount:   portfolio._count.votes,
      hasVoted:    requestingUserId
        ? portfolio.votes.length > 0
        : false
    }
  },


  // ── DELETE PORTFOLIO ─────────────────────────────────────
  async deletePortfolio(id: string, userId: string) {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } })

    if (!portfolio) throw ApiError.notFound('Portfolio not found')

    // Only the owner can delete
    if (portfolio.userId !== userId) {
      throw ApiError.unauthorized('You can only delete your own portfolios')
    }

    // Delete image from Cloudinary
    await uploadService.deleteImage(portfolio.heroImageUrl)

    // Delete from DB — cascade deletes votes and tags automatically
    await prisma.portfolio.delete({ where: { id } })

    return { message: 'Portfolio deleted' }
  }
}
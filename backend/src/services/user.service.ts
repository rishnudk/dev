import prisma from '../config/db'
import { ApiError } from '../utils/ApiError'
import { Field } from '@prisma/client'

interface UpdateProfileInput {
  name: string
  username: string
  field: Field
  bio?: string
  techStack: string[]
  portfolioUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  avatarUrl?: string
}

export const userService = {

  // ── UPDATE PROFILE ───────────────────────────────────────
  async updateProfile(userId: string, input: UpdateProfileInput) {

    // 1. Check username is not taken by someone else
    if (input.username) {
      const existing = await prisma.user.findUnique({
        where: { username: input.username }
      })

      if (existing && existing.id !== userId) {
        throw ApiError.badRequest('Username is already taken')
      }
    }

    // 2. Validate username format — only letters, numbers, underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(input.username)) {
      throw ApiError.badRequest(
        'Username must be 3-20 characters, letters numbers and underscores only'
      )
    }

    // 3. Update user and mark as onboarded
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...input,
        isOnboarded: true
      }
    })

    return user
  },


  // ── GET PUBLIC PROFILE ───────────────────────────────────
  async getProfile(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        field: true,
        techStack: true,
        portfolioUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        createdAt: true,
        portfolios: {
          orderBy: { trendingScore: 'desc' },
          include: {
            _count: { select: { votes: true } },
            tags: { include: { tag: true } }
          }
        }
      }
    })

    if (!user) throw ApiError.notFound('User not found')
    return user
  },


  // ── CHECK USERNAME AVAILABILITY ──────────────────────────
  async checkUsername(username: string, userId: string) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

    if (!usernameRegex.test(username)) {
      return { available: false, message: 'Invalid username format' }
    }

    const existing = await prisma.user.findUnique({
      where: { username }
    })

    if (existing && existing.id !== userId) {
      return { available: false, message: 'Username is taken' }
    }

    return { available: true, message: 'Username is available' }
  }
}
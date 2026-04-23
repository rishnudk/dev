import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import prisma from '../config/db'
import { emailService } from './email.service'
import { ApiError } from '../utils/ApiError'
import { JwtPayload } from '../types/auth.types'

export const authService = {

  // ── SEND MAGIC LINK ──────────────────────────────────────
  async sendMagicLink(email: string) {

    // 1. Find or create user
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({
        data: { email }
      })
    }

    // 2. Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex')

    // 3. Delete any existing unused tokens for this user
    await prisma.magicToken.deleteMany({
      where: { userId: user.id, used: false }
    })

    // 4. Save token to DB with 15 min expiry
    await prisma.magicToken.create({
      data: {
        token: rawToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    })

    // 5. Send the email
    await emailService.sendMagicLink(email, rawToken, user.name ?? undefined)

    return { message: 'Magic link sent. Check your email.' }
  },


  // ── VERIFY MAGIC TOKEN ───────────────────────────────────
  async verifyMagicToken(token: string) {

    // 1. Find the token in DB
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
      include: { user: true }
    })

    // 2. Token must exist
    if (!magicToken) {
      throw ApiError.badRequest('Invalid or expired link')
    }

    // 3. Token must not be used already
    if (magicToken.used) {
      throw ApiError.badRequest('This link has already been used')
    }

    // 4. Token must not be expired
    if (new Date() > magicToken.expiresAt) {
      throw ApiError.badRequest('This link has expired. Please request a new one.')
    }

    // 5. Mark token as used — can never be used again
    await prisma.magicToken.update({
      where: { token },
      data: { used: true }
    })

    // 6. Generate JWT
    const jwtToken = authService.generateJwt({
      userId: magicToken.user.id,
      email: magicToken.user.email
    })

    return {
      token: jwtToken,
      user: magicToken.user,
      isNewUser: !magicToken.user.isOnboarded
    }
  },


  // ── GENERATE JWT ─────────────────────────────────────────
  generateJwt(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as any
    })
  },


  // ── VERIFY JWT ───────────────────────────────────────────
  verifyJwt(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwtSecret) as JwtPayload
    } catch {
      throw ApiError.unauthorized('Invalid or expired token')
    }
  },


  // ── GET CURRENT USER ─────────────────────────────────────
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        field: true,
        techStack: true,
        portfolioUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        isOnboarded: true,
        createdAt: true,
      }
    })

    if (!user) throw ApiError.notFound('User not found')
    return user
  }
}
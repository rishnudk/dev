import rateLimit from 'express-rate-limit'

// Vote rate limit — max 30 votes per minute per IP
export const voteLimiter = rateLimit({
  windowMs:         60 * 1000,  // 1 minute
  max:              30,
  message:          { success: false, message: 'Too many votes, slow down' },
  standardHeaders:  true,
  legacyHeaders:    false,
})

// Submit rate limit — max 5 submissions per hour
export const submitLimiter = rateLimit({
  windowMs:         60 * 60 * 1000,  // 1 hour
  max:              5,
  message:          { success: false, message: 'Too many submissions, try again later' },
  standardHeaders:  true,
  legacyHeaders:    false,
})

// Auth rate limit — max 10 magic link requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,  // 15 minutes
  max:              10,
  message:          { success: false, message: 'Too many requests, try again later' },
  standardHeaders:  true,
  legacyHeaders:    false,
})
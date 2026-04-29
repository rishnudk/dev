export interface User {
  id:           string
  name:         string
  username:     string
  avatarUrl:    string | null
  field:        string | null
  bio:          string | null
  techStack:    string[]
  githubUrl:    string | null
  linkedinUrl:  string | null
  portfolioUrl: string | null
  isOnboarded:  boolean
}

export interface Portfolio {
  id:            string
  title:         string
  description:   string
  liveUrl:       string
  heroImageUrl:  string
  trendingScore: number
  createdAt:     string
  voteCount:     number
  hasVoted:      boolean
  user:          User
  tags:          { tag: { id: string; name: string } }[]
}

export type FeedType  = 'trending' | 'newest' | 'top'
export type FieldType = 'ALL' | 'FRONTEND' | 'BACKEND' |
                        'FULLSTACK' | 'MOBILE' | 'DEVOPS' |
                        'DATA' | 'DESIGN' | 'OTHER'

export interface FeedResponse {
  items:      Portfolio[]
  nextCursor: string | null
  hasMore:    boolean
}

export interface UserProfile {
  id:                  string
  name:                string
  username:            string
  avatarUrl:           string | null
  bio:                 string | null
  field:               string | null
  techStack:           string[]
  portfolioUrl:        string | null
  githubUrl:           string | null
  linkedinUrl:         string | null
  createdAt:           string
  portfolios:          Portfolio[]
  totalPortfolios:     number
  totalVotesReceived:  number
}
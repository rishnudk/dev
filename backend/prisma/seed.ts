import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Field } from '@prisma/client'

console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL)

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn']
})

async function main() {
  console.log('Seeding database...')

  // Create test users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@test.com',
      name: 'Alice Johnson',
      username: 'alice',
      field: Field.FRONTEND,
      bio: 'Frontend developer who loves animations',
      techStack: ['React', 'TypeScript', 'Tailwind'],
      isOnboarded: true,
    }
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@test.com',
      name: 'Bob Smith',
      username: 'bob',
      field: Field.FULLSTACK,
      bio: 'Full stack developer, Node.js enthusiast',
      techStack: ['Node.js', 'Next.js', 'PostgreSQL'],
      isOnboarded: true,
    }
  })

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React' } }),
    prisma.tag.create({ data: { name: 'Next.js' } }),
    prisma.tag.create({ data: { name: 'TypeScript' } }),
  ])

  // Create a portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: alice.id,
      title: "Alice's Portfolio",
      description: 'A clean minimal portfolio with smooth animations',
      liveUrl: 'https://alice.dev',
      heroImageUrl: 'https://picsum.photos/1200/630',
      trendingScore: 42.5,
      tags: {
        create: tags.map(tag => ({ tagId: tag.id }))
      }
    }
  })

  // Create a vote
  await prisma.vote.create({
    data: {
      userId: bob.id,
      portfolioId: portfolio.id
    }
  })

  console.log('Seeding complete!')
  console.log(`Created users: ${alice.name}, ${bob.name}`)
  console.log(`Created portfolio: ${portfolio.title}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
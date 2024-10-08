import { type Prisma, PrismaClient } from '@prisma/client'
import { ApolloError, ApolloServer } from 'apollo-server-micro'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { schema } from '../modules/graphql/schema'

const requerSSL = process.env.POSTGRES_SSL === 'true'


// Função para criar um cliente Prisma com logging
const createPrismaClientWithLogging = (datasource: string) => {
  const dbURL = requerSSL ? `${process.env.POSTGRES_URL}&schema=${datasource}` : `${process.env.POSTGRES_URL}?schema=${datasource}`
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbURL
      }
    },
    log: [{ emit: 'event', level: 'query' }]
  })

  prisma.$on('query', (e: Prisma.QueryEvent) => {
    console.log(`Query: ${e.query}`)
    console.log(`Params: ${e.params}`)
    console.log(`Duration: ${e.duration} ms`)
    console.log(`Datasource: ${datasource}`)
  })

  return prisma
}

const prismaClients: { [key: string]: PrismaClient } = {}

const getPrismaClient = (datasource: string) => {
  if (!prismaClients[datasource]) {
    prismaClients[datasource] = createPrismaClientWithLogging(datasource)
  }
  return prismaClients[datasource]
}

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => {
    const token = req?.headers.authorization || ''
    const datasource = (req?.headers.datasource as string) || 'public' // Use 'public' como fallback

    let user: string | JwtPayload | null = null

    if (token) {
      try {
        // Verificar e decodificar o token JWT
        user = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.JWT_SECRET as string
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        throw new ApolloError('Not authorized', 'UNAUTHORIZED')
      }
    }

    // Obter uma instância do Prisma específica para o tenant
    const prisma = getPrismaClient(datasource)

    return { req, res, prisma, user }
  }
})

export { server }

import 'reflect-metadata'
import http from 'http'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import express from 'express'
import consola from 'consola'
import Connection from './db/Connection'

async function main() {
  await Connection
  const app = express()
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
    }),
  })

  const httpServer = http.createServer(app)

  server.applyMiddleware({ app })
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen(process.env.PORT || 4000, () => {
    consola.ready({
      message: 'server started',
      badge: true,
    })
  })
}

main().catch((e) => {
  consola.error(e)
})

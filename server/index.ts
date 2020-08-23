import 'reflect-metadata'

import http from 'http'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import consola from 'consola'
import express from 'express'
import { buildSchema } from 'type-graphql'

import Connection from './db/Connection'
import routes from './routes'

async function main() {
  await Connection
  const app = express()

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
    }),
    context: (context) => ({
      req: context.req,
    }),
  })

  const httpServer = http.createServer(app)

  server.applyMiddleware({ app })
  server.installSubscriptionHandlers(httpServer)

  app.use(routes)

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

import 'reflect-metadata';

import { ApolloServer, PubSub } from 'apollo-server-express';
import consola from 'consola';
import express from 'express';
import http from 'http';
import path from 'path';
import { buildSchema } from 'type-graphql';

import customAuthChecker from './customAuthChecker';
import Connection from './db/Connection';
import routes from './routes';

async function main() {
  await Connection;
  const app = express();

  const pubSub = new PubSub();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
      authChecker: customAuthChecker,
    }),
    subscriptions: {
      path: '/subscriptions',
    },
    uploads: {
      maxFileSize: 10_000_000,
      maxFiles: 5,
    },
    context: (context) => ({
      req: context.req,
      res: context.res,
      pubSub,
    }),
  });

  const httpServer = http.createServer(app);

  app.use(routes);

  server.applyMiddleware({ app });
  server.installSubscriptionHandlers(httpServer);

  app.use('*', (_, res) => {
    res.status(404).json({
      status: 404,
      message: 'Not found',
    });
  });

  httpServer.listen(process.env.PORT || 4000, () => {
    consola.ready({
      message: 'server started',
      badge: true,
    });
  });
}

main().catch((e) => {
  consola.error(e);
});

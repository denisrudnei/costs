import 'reflect-metadata';

import http from 'http';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import consola from 'consola';
import express from 'express';
import { buildSchema } from 'type-graphql';

import Connection from './db/Connection';
import routes from './routes';
import customAuthChecker from './customAuthChecker';

async function main() {
  await Connection;
  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
      authChecker: customAuthChecker,
    }),
    context: (context) => ({
      req: context.req,
      res: context.res,
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

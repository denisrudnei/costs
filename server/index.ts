import 'reflect-metadata';

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import consola from 'consola';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import http from 'http';
import path from 'path';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground';
import customAuthChecker from './customAuthChecker';
import Connection from './db/Connection';
import routes from './routes';
import { SystemInfoService } from './services/SystemInfoService';

async function main() {
  await Connection;
  const app = express();

  const pubSub = new PubSub();

  await SystemInfoService.start(pubSub);

  const schema = await buildSchema({
    resolvers: [path.resolve(__dirname, 'resolvers/**/*')],
    authChecker: customAuthChecker,
    pubSub,
  });

  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
  }, {
    server: httpServer,
    path: '/subscriptions',
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    introspection: true,
    context: (context) => ({
      req: context.req,
      res: context.res,
      pubSub,
    }),
  });

  app.use(routes);

  await server.start();

  server.applyMiddleware({ app, path: '/graphql', cors: false });

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

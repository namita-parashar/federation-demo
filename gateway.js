require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const app = express();
const { env } = process;
const port = env.GATEWAY_PORT;
const domain_url = env.DOMAIN_URL;
const main_url = env.MAIN_URL;

const gateway = new ApolloGateway({
  serviceList: [{ name: "domains", url: domain_url }],

  __exposeQueryPlanExperimental: false,
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set("x-auth", context.token);
      },
    });
  },
});

(async () => {
  const server = new ApolloServer({
    gateway,
    engine: false,
    subscriptions: false,
    context: ({ req }) => {
      return {
        token: req.headers["x-auth"],
      };
    },
    formatError: (err) => ({ message: err.message, status: err.status }),
  });

  server.applyMiddleware({ app });

  app.listen({ port: port, url: main_url }, () =>
    console.log(`🚀 Server ready at ${main_url}`)
  );
  // app.listen().then(({ url }) => {
  //   console.log(`🚀 Server ready at ${url}`);
  // });
})();

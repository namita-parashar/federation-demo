const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fs = require("fs");
const domainAPI = require("./DataSource/DomainAPI.js");
const accountAPI = require("./DataSource/AccountAPI.js");
const registrarAPI = require("./DataSource/RegistrarAPI.js");
const addressAPI = require("./DataSource/AddressAPI.js");
const nameserverAPI = require("./DataSource/NameServerAPI.js");
const tldAPI = require("./DataSource/TldAPI.js");
const resolvers = require("./resolvers.js");

const typeDefs = gql(
  fs.readFileSync("./schema.graphql", { encoding: "utf-8" })
);

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),

  context: ({ req }) => {
    return {
      token: req.headers["x-auth"],
    };
  },
  dataSources: () => {
    return {
      domainAPI: new domainAPI(),
      accountAPI: new accountAPI(),
      registrarAPI: new registrarAPI(),
      addressAPI: new addressAPI(),
      nameserverAPI: new nameserverAPI(),
      tldAPI: new tldAPI(),
    };
  },
  formatError: (err) => ({ message: err.message, status: err.status }),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

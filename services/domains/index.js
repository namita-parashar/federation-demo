const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Domain @key(fields: "id") {
    id: ID!
    name: String
    userID:Int
    author: User
  }
  extend type Query {
    domains: [Domain]
  }
  extend type User @key(fields: "id") {
    id: ID! 
    username: String 
    domains: [Domain]
  }
`;

const resolvers = {
  Query: {
    domains(){
    return domains;
    // author(domain) {
    //   return { __typename: "User", id: domain.userID };
    // }
  },
},
  User: {
    domains(user) {
      return domains.filter(domain => domain.userID === user.id);
    },
    numberOfReviews(user) {
      return domains.filter(domain => domain.userID === user.id).length;
    },
    username(user) {
      const found = usernames.find(username => username.id === user.id);
      return found ? found.username : null;
    }
  },
  Product: {
    domains(product) {
      return domains.filter(domain => domain.product.upc === product.upc);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const usernames = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" }
];
const domains = [
  {
    id: "1",
    userID: "1",
    product: { upc: "1" },
    name: "Love it!"
  },
  {
    id: "2",
    userID: "1",
    product: { upc: "2" },
    name: "Too expensive."
  },
  {
    id: "3",
    userID: "2",
    product: { upc: "3" },
    name: "Could be better."
  },
  {
    id: "4",
    userID: "2",
    product: { upc: "1" },
    name: "Prefer something else."
  }
];

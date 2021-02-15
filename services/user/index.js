const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const domainAPI = require('./DataSource/DomainAPI.js');
const accountAPI = require('./DataSource/AccountAPI.js');
const registrarAPI = require('./DataSource/RegistrarAPI.js');
const addressAPI = require('./DataSource/AddressAPI.js');
const nameserverAPI = require('./DataSource/NameServerAPI.js');
const tldAPI = require('./DataSource/TldAPI.js');

const typeDefs = gql`
  extend type Query {
    user: User
    domain:domain
    registrar:[registrar]
    domain_availability(account:ID,domain:String):availableDomain
    nameserver(domain:Int):[nameserver]
    tlds(offset: Int, limit: Int):[tlddata]
  }
  extend type Mutation{
    createRegistrar(name:String, url: String, type:Int):registrar
    createAccount(email:String,api_key:String,api_user:String,username:String,registrar_id:Int,notes:String):account
    updateAccount(account:ID,email:String,api_key:String,api_user:String,username:String,registrar_id:Int,notes:String):account
    deleteAccount(account:ID):String,
    createDomain(account_id:Int,address_id:Int,name:String,whoisguard:Int,notes:String):buydomain
    updateDomain(domain:Int,notes:String):buydomain
    createAddress(account:Int, name:String, email:String,firstname:String, lastname: String, job_title:String,organization:String, address1:String, address2:String,city:String, phone:String, fax:String,state:String, zipcode:String, country:String):Address
    createNameServer(domain:Int, nameserver: String):nameserver
    createTld(account:Int):[tlddatacreate]
  }
  type tlddata @key(fields: "id"){
    id:Int
    tld:String
  }
  type tlddatacreate @key(fields: "name"){ 
    name:String
  }
  type nameserver @key(fields: "id"){
    id:Int
    nameserver1:String
    nameserver2:String
  }
  type Address @key(fields: "id"){ 
    id:Int
    email:String
    firstname:String
    lastname:String
    job_title:String
    organization:String
    address1:String
    address2:String
    city:String
    state:String
    zipcode:String
    country:String
    phone:String
    fax:String
  }
  type domain @key(fields: "id") {
    id: ID
    name: String
    account_id:Int
    address_id:Int
    domain_id:Int
    domain_expires:String
    whoisguard:Int
    autorenew:Int
    privacy:Int
    notes:String
    status:String
  }
  type buydomain @key(fields: "id") {
    id:Int
    name:String
    notes:String
  }
  
  type account @key(fields:"id"){
    id:ID
    email:String
    username:String
    api_key:String
    api_user:String
    currency:String
    balance:String
    notes:String
    user_id:Int
  }
   type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
    domain_id:Int
  }
  type registrar @key(fields: "id"){ 
    id:Int
    name:String
    url:String
  }
  type availableDomain{
    available:String
    definitive:String
    domain:String
  }
  extend type User @key(fields: "id") {
    accounts:[account]
    domains(account:Int):[domain]
    domain(domain:Int):domain
    account(account:Int):account
  }
  extend type domain @key(fields: "id"){
    user: User
  }
`;

const resolvers = {
  Query: {
    user: (root, args, context) => {return users.find(user => user.id === context.token)}, 
    registrar:async (_, __, {dataSources}) => { return result =  await dataSources.registrarAPI.getRegistrar();},
    accountBalance:async (_, account_id, {dataSources}) => { return result =  await dataSources.accountAPI.getAccountBalance(account_id);},
    domain_availability:async (_, args, {dataSources}) => { return result =  await dataSources.domainAPI.availability(args);},
    nameserver:async (_, data, {dataSources}) => { return result =  await dataSources.nameserverAPI.getNameServers(data.domain);},
    tlds:async(_,data,{dataSources}) => { return  result =  await dataSources.tldAPI.tld(data)}
  },
  Mutation:{
    createRegistrar:async (_, args, {dataSources}) => {return result = await dataSources.registrarAPI.createRegistrar(args);},
    createAccount:async (_,args,{dataSources}) => { return result = await dataSources.accountAPI.createAccount(args)},
    updateAccount:async (_,args,{dataSources}) => { return result = await dataSources.accountAPI.updateAccount(args)},
    deleteAccount:async(_,args,{dataSources}) =>{return result = await dataSources.accountAPI.deleteAccount(args)},
    createDomain:async (_,args,{dataSources}) => { const result = await dataSources.domainAPI.createDomain(args);
                                                    return result;},
    updateDomain:async (_,args,{dataSources}) => { const result = await dataSources.domainAPI.updateDomain(args);
                                                      return result;},
    createAddress:async (_,args,{dataSources}) => { const result = await dataSources.addressAPI.createAddress(args);
                                                        return result;},
    createNameServer:async (_,args,{dataSources}) => { const result = await dataSources.nameserverAPI.createNameServer(args);
                                                          return result;},
    createTld:async (_,args,{dataSources}) => {const result = await dataSources.tldAPI.createTld(args);
      return result;},
    
  },
  User: { 
    domains: async (user, data,{ dataSources }) => {
      const result = await dataSources.domainAPI.getDomains(data.account);
      return result.filter(domain => domain.user_id = user.id);
    },
    domain: async (user, data,{ dataSources }) => {
      return result = await dataSources.domainAPI.getDomain(data.domain);
    },
    accounts: async (user, __ ,{ dataSources }) => {
      const result = await dataSources.accountAPI.getAccounts();
      return result.filter(account => account.user_id = user.id);
    },
    account:async (user, data ,{ dataSources }) => {
      const result = await dataSources.accountAPI.getAccount(data.account);
      return result;
    },
   
    //  domains(user) {
    //   console.log(typeof domains);
    //   return domains.filter(domain => domain.userId === user.id);
    // }, 
    // __resolveReference(object) {
    //   return users.find(user => user.id === object.id);
    // }
  },
  domain: { 
    user(domain) {
      return users.find(user => user.id === domain.user_id);
    }, 
    // __resolveReference(object) {
    //   return domain.find(domain => domain.id === object.id);
    // }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: ({ req }) => {
        return {
          "token": req.headers['x-auth'],
        };
      },
  dataSources:()=>{
        return{ domainAPI: new domainAPI() ,accountAPI:new accountAPI(),registrarAPI:new registrarAPI(),addressAPI:new addressAPI(),nameserverAPI:new nameserverAPI(),tldAPI:new tldAPI()}
  },
  formatError: (err) =>({ message: err.message, status: err.status }), 
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

// const domains = [
// {
//   id:"1",
//   name:"abc.com",
//   userId:"1"
// },
// {
//   id:"2",
//   name:"xyz.com",
//   userId:"2"
// },
// {
//   id:"3",
//   name:"abc.com",
//   userId:"1"
// },
// {
//   id:"4",
//   name:"xyz.com",
//   userId:"2"
// },
// {
//   id:"5",
//   name:"abc.com",
//   userId:"1"
// },
// {
//   id:"6",
//   name:"xyz.com",
//   userId:"2"
// }
// ];
const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  }
];

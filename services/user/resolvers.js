const domainAPI = require('./DataSource/DomainAPI.js');
const accountAPI = require('./DataSource/AccountAPI.js');
const registrarAPI = require('./DataSource/RegistrarAPI.js');
const addressAPI = require('./DataSource/AddressAPI.js');
const nameserverAPI = require('./DataSource/NameServerAPI.js');
const tldAPI = require('./DataSource/TldAPI.js');


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
    },
    domain: { 
      user(domain) {
        return users.find(user => user.id === domain.user_id);
      }, 
    },
};
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
module.exports = resolvers;
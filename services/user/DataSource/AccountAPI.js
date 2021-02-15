const { RESTDataSource } = require('apollo-datasource-rest');

class AccountAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
  willSendRequest(request) {
    return request.headers.set('x-auth', this.context.token);
  }
  async getAccounts() {
    return this.get(`accounts`);
  }
  async getAccount(account) {
    return this.get(`account/${account}`);
  }
  async updateAccount(args) {
      return this.post(`account/${args.account}`,
      {account:args.account,email:args.email,api_key:args.api_key,api_user:args.api_user,username:args.username,registrar_id:args.registrar_id,notes:args.notes}
        );
  }
  async createAccount(args) {
    return this.post(`accounts`,
    {email:args.email,api_key:args.api_key,api_user:args.api_user,username:args.username,registrar_id:args.registrar_id,notes:args.notes}
      );
  }
  async deleteAccount(account) {
    //   console.log(account.account);
    return this.delete(`account/${account.account}`,
      );
}
async getAccounts() {
    return this.get(`accounts`);
  }
  async getAccountBalance(account_id){
    return this.get(`account/${account.account}/balance`);
  }
}

module.exports = AccountAPI;

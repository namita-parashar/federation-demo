const { RESTDataSource } = require('apollo-datasource-rest');

class NameServerAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
  willSendRequest(request) {
     request.headers.set('x-auth', this.context.token);
  }

  async getNameServers(domain) {
    const result = await this.get(`domain/${domain}/nameservers`);
    if(result.status == 403 ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }
  async createNameServer(args) {
    const result = await this.post(`domain/${args.domain}/nameservers`,{nameserver:args.nameserver});
    console.log(result);
    if(result.status == 403 ||result.status == 400 || result.code == 'INVALID_BODY' ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }
  
}
module.exports = NameServerAPI;

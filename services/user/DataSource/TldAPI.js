const { RESTDataSource } = require('apollo-datasource-rest');

class TldAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
  willSendRequest(request) {
     request.headers.set('x-auth', this.context.token);
  }

  async tld(data) {
    const result = await this.get(`tlds/${data.offset}/${data.limit}`);
    if(result.status == 403 ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }
  async createTld(account) {
    const result = await this.get(`tldss/${account}`);
    console.log(result);
    if(result.status == 403 ||result.status == 400  ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }

}
module.exports = TldAPI;

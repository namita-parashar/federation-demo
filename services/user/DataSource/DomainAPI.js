const { RESTDataSource } = require('apollo-datasource-rest');

class DomainAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
  willSendRequest(request) {
    // console.log(this.context.token);
     request.headers.set('x-auth', this.context.token);
  }

  async availability(args) {
    const result = await this.post(`availability/${args.account}`,{domain:args.domain});
    if(result.status == 403 ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }
  async getDomain(domain) {
    const result = await this.get(`domain/${domain}`);
    console.log(result.status);
    if(result.status == 403 ||result.status == 400  ){
      var err = new Error(result.message);
      err.status = 403;
      throw err;
     }
    else{
      return result;
    }
  }
  async getDomains(account) {
    const result = await this.get(`domains/${account}`);
    if(result.status == 403){
      var err = result.message;
      err.status = 403;
      throw err;
    }
    if(result['@attributes']){
      if(result['@attributes']['Status'] == 'ERROR'){
        var err =  result.Errors.Error;
        throw err;
      }
    }
    else{
      return result;
    }
  }
  async createDomain(args) {
    const result = await this.post(`buy`,{account_id:args.account_id,address_id:args.address_id,name:args.name,whoisguard:args.whoisguard,notes:args.notes});
    if(result.code == 'UNAVAILABLE_DOMAIN' || result.status == 400 || result.status == 403){
      var err = result.message;
      throw err;
    }
    else{
     return result;
    }
  }
  async updateDomain(args) {
    const result = await this.post(`domain/${args.domain}`,{notes:args.notes});
    if(result.status == 400 || result.status == 403){
      var err = result.message;
      throw err;
    }
    else{
     return result;
    }
  }
  // async renewDomain(args) {
  //   const result = await this.post(`domain/renew/${args.domain}`,{account_id:args.account_id,year:args.year});
  //   console.log(result);
  //   if(result.status == 400 || result.status == 403){
  //     var err = result.message;
  //     throw err;
  //   }
  //   else{
  //    return result;
  //   }
  // }
}
module.exports = DomainAPI;

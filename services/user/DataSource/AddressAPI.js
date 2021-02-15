const { RESTDataSource } = require('apollo-datasource-rest');

class AddressAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
  willSendRequest(request) {
    return request.headers.set('x-auth', this.context.token);
  }

  async createAddress(args) {
    const result = await this.post(`address/${args.account}`,
    {account_id:args.account, name: args.name, email:args.email,firstname:args.firstname, lastname: args.lastname, job_title:args.job_title,organization:args.organization, address1: args.address1, address2:args.address2,city:args.city, phone: args.phone, fax:args.fax,state:args.state, zipcode: args.zipcode, country:args.country}
      );
      if(result.status == 400 || result.status == 403){
        var err = result.message;
        throw err;
      }
      else{
       return result;
      }

  }
}
module.exports = AddressAPI;

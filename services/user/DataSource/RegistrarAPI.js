const { RESTDataSource } = require('apollo-datasource-rest');

class RegistrarAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost/domains/public/api/';
  }
//   willSendRequest(request) {
//     return request.headers.set('x-auth', this.context.token);
//   }
  async getRegistrar() {
    return this.get(`registrar`);
  }
  async createRegistrar(args) {
    return this.post(`registrar`,
    {name:args.name, url: args.url, type:args.type}
      );
  }
}
module.exports = RegistrarAPI;

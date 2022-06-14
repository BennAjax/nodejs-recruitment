const axios = require('axios');

class OmdbAdaptor {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://www.omdbapi.com', // TODO: add url
    });
  }

  async getMovie(title) {
    try {
      const result = await this.client.get(`/?t=${title}&apikey=731280a1`); // TODO: add api key
      return result.data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new OmdbAdaptor();

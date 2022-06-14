const axios = require('axios');

class OmdbAdaptor {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.OMDB_URL,
    });
  }

  async getMovie(title) {
    try {
      const result = await this.client.get(`/?t=${title}&apikey=${process.env.OMDB_API_KEY}`);
      return result.data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new OmdbAdaptor();

const nock = require('nock');
const Adaptor = require('./OmdbAdaptor');

let scope;
beforeAll(() => {
  scope = nock(process.env.OMDB_URL)
    .get(`/?t=snake&apikey=${process.env.OMDB_API_KEY}`)
    .reply(200, {
      data: {
        Title: 'Snake Eyes',
        Year: '1998',
        Rated: 'R',
        Released: '07 Aug 1998',
        Runtime: '98 min',
        Genre: 'Crime, Mystery, Thriller',
        Director: 'Brian De Palma',
        Writer: 'Brian De Palma, David Koepp',
        Actors: 'Nicolas Cage, Gary Sinise, John Heard',
        Plot: 'A shady police detective finds himself in the middle of a murder conspiracy at an important boxing match in an Atlantic City casino.',
        Language: 'English',
        Country: 'United States, Canada',
        Awards: '1 win & 4 nominations',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BNmZiODkzNWEtNDkxZC00NDg2LWFiYzktZjY2ZmUwMmM2ZmJlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '6.1/10' },
          { Source: 'Rotten Tomatoes', Value: '40%' },
          { Source: 'Metacritic', Value: '52/100' },
        ],
        Metascore: '52',
        imdbRating: '6.1',
        imdbVotes: '80,996',
        imdbID: 'tt0120832',
        Type: 'movie',
        DVD: '11 Sep 2007',
        BoxOffice: '$55,591,409',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True',
      },
    });
});

describe('OMDB Adaptor', () => {
  describe('constructor', () => {
    test('should initialize object', () => {
      expect(Adaptor.client).toBeTruthy();
      expect(Adaptor.client.defaults.baseURL).toEqual(process.env.OMDB_URL);
    });
  });

  describe('Method: getMovie', () => {
    test('should return a movie', async () => {
      const result = await Adaptor.getMovie('snake');

      expect(result.data).toBeInstanceOf(Object);
      expect(result.data.Title).toEqual('Snake Eyes');
      expect(result.data.Director).toEqual('Brian De Palma');
      scope.done();
    });

    test('should return null', async () => {
      const result = await Adaptor.getMovie('Snake');

      expect(result).toBeNull();
    });
  });
});

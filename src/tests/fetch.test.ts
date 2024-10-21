import axios from 'axios';
import {
  fetchHeroes,
  fetchHeroDetails,
  fetchFilms,
  fetchStarships,
} from '@/app/api/fetch';
import { Hero, Film, Starship } from '@/types/types';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Functions', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://swapi.dev/api';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchHeroes should return heroes', async () => {
    const heroesData = {
      data: {
        results: [{ name: 'Luke Skywalker', height: '172', mass: '77' }] as Hero[],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(heroesData);

    const heroes = await fetchHeroes();
    expect(heroes).toEqual(heroesData.data.results);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1');
  });

  test('fetchHeroDetails should return hero details', async () => {
    const heroDetails = {
      data: { name: 'Luke Skywalker', height: '172', mass: '77' } as Hero,
    };

    mockedAxios.get.mockResolvedValueOnce(heroDetails);

    const hero = await fetchHeroDetails('1');
    expect(hero).toEqual(heroDetails.data);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://swapi.dev/api/people/1'); // This line will check the correct URL
  });

  test('fetchFilms should return films', async () => {
    const filmUrls = ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'];
    const filmsData = [
      { title: 'Film 1' } as Film,
      { title: 'Film 2' } as Film,
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: filmsData[0] });
    mockedAxios.get.mockResolvedValueOnce({ data: filmsData[1] });

    const films = await fetchFilms(filmUrls);
    expect(films).toEqual(filmsData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(filmUrls.length);
  });

  test('fetchStarships should return starships', async () => {
    const starshipUrls = ['https://swapi.dev/api/starships/1/'];
    const starshipsData = [{ name: 'X-wing' } as Starship];

    mockedAxios.get.mockResolvedValueOnce({ data: starshipsData[0] });

    const starships = await fetchStarships(starshipUrls);
    expect(starships).toEqual(starshipsData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(starshipUrls.length);
  });
});

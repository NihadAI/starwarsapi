import axios from 'axios';
import { Hero, Film, Starship } from '@/types/types';

// Fetch All Heroes
export const fetchHeroes = async (): Promise<Hero[]> => {
  let allHeroes: Hero[] = [];
  let page = 1;

  try {
    while (true) {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/people/?page=${page}`);
      const heroes = response.data.results;

      allHeroes = [...allHeroes, ...heroes];

      // Stop fetching if less than 10 results (end of pagination)
      if (heroes.length < 10) break;

      page++;
    }
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error; // Re-throw the error for handling later
  }

  return allHeroes;
};

// Fetch Hero Details by ID
export const fetchHeroDetails = async (heroId: string): Promise<Hero> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/people/${heroId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hero details:', error);
      throw error;
    }
  };
  

// Fetch All Films
export const fetchFilms = async (filmUrls: string[]): Promise<Film[]> => {
    try {
      const filmRequests = filmUrls.map(url => axios.get(url));
      const filmResponses = await Promise.all(filmRequests);
      return filmResponses.map(response => response.data);
    } catch (error) {
      console.error('Error fetching films:', error);
      throw error;
    }
  };

// Fetch Film Details by ID
export const fetchFilmDetails = async (filmId: string): Promise<Film> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/films/${filmId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching film details:', error);
    throw error;
  }
};

// Fetch All Starships
export const fetchStarships = async (starshipUrls: string[]): Promise<Starship[]> => {
    try {
      const starshipRequests = starshipUrls.map(url => axios.get(url));
      const starshipResponses = await Promise.all(starshipRequests);
      return starshipResponses.map(response => response.data);
    } catch (error) {
      console.error('Error fetching starships:', error);
      throw error;
    }
  };

// Fetch Starship Details by ID
export const fetchStarshipDetails = async (starshipId: string): Promise<Starship> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/starships/${starshipId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching starship details:', error);
    throw error;
  }
};

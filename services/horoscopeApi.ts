import axios from 'axios';

const BASE_URL = 'http://cms.buzlylabs.com/horoscope_api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export interface HoroscopeResponse {
  date: string;
  horoscope: string;
  sign: string;
  sign_name?: string;
  horoscopes?: Array<{
    name: string;
    text: string;
  }>;
}

export interface ChineseHoroscopeResponse {
  date: string;
  horoscope: string;
  animal: string;
}

export interface MatchResponse {
  compatibility: number;
  description: string;
}

export const getDailyHoroscope = async (zodiacId: number, date: string): Promise<HoroscopeResponse> => {
  try {
    const response = await api.get(`/daily/${zodiacId}/${date}/`);
    return response.data;
  } catch (error) {
    console.error('Error in getDailyHoroscope:', error);
    throw error;
  }
};

export const getWeeklyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  try {
    const response = await api.get(`/weekly/${zodiacId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getWeeklyHoroscope:', error);
    throw error;
  }
};

export const getMonthlyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  try {
    const response = await api.get(`/monthly/${zodiacId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getMonthlyHoroscope:', error);
    throw error;
  }
};

export const getYearlyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  try {
    const response = await api.get(`/yearly/${zodiacId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getYearlyHoroscope:', error);
    throw error;
  }
};

export const getFullHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  try {
    const response = await api.get(`/full/${zodiacId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getFullHoroscope:', error);
    throw error;
  }
};

export const getChineseDailyHoroscope = async (chineseId: number, date: string): Promise<ChineseHoroscopeResponse> => {
  try {
    const response = await api.get(`/chinese/${chineseId}/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error in getChineseDailyHoroscope:', error);
    throw error;
  }
};

export const getChineseYearlyHoroscope = async (chineseId: number): Promise<ChineseHoroscopeResponse> => {
  try {
    const response = await api.get(`/chinese_yearly/${chineseId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getChineseYearlyHoroscope:', error);
    throw error;
  }
};

export const getChineseFullHoroscope = async (chineseId: number): Promise<ChineseHoroscopeResponse> => {
  try {
    const response = await api.get(`/chinese_full/${chineseId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getChineseFullHoroscope:', error);
    throw error;
  }
};

export const getLoveMatch = async (sign1: string, sign2: string): Promise<MatchResponse> => {
  try {
    const response = await api.get(`/lovematch/${sign1}/${sign2}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLoveMatch:', error);
    throw error;
  }
};

export const getFriendMatch = async (sign1: string, sign2: string): Promise<MatchResponse> => {
  try {
    const response = await api.get(`/friendmatch/${sign1}/${sign2}`);
    return response.data;
  } catch (error) {
    console.error('Error in getFriendMatch:', error);
    throw error;
  }
};

export const searchDreamBook = async (word: string) => {
  try {
    const response = await api.get(`/dreambook/search/?s=${word}`);
    return response.data;
  } catch (error) {
    console.error('Error in searchDreamBook:', error);
    throw error;
  }
};

export const getDreamBookWord = async (wordId: number) => {
  try {
    const response = await api.get(`/dreambook/get_word/?word_id=${wordId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getDreamBookWord:', error);
    throw error;
  }
};
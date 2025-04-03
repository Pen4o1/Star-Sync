import axios from 'axios';

const BASE_URL = 'http://cms.buzlylabs.com/horoscope_api';

export interface HoroscopeResponse {
  date: string;
  horoscope: string;
  sign: string;
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
  const response = await axios.get(`${BASE_URL}/daily/${zodiacId}/${date}/`);
  return response.data;
};

export const getWeeklyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/weekly/${zodiacId}`);
  return response.data;
};

export const getMonthlyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/monthly/${zodiacId}`);
  return response.data;
};

export const getYearlyHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/yearly/${zodiacId}`);
  return response.data;
};

export const getFullHoroscope = async (zodiacId: number): Promise<HoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/full/${zodiacId}`);
  return response.data;
};

export const getChineseDailyHoroscope = async (chineseId: number, date: string): Promise<ChineseHoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/chinese/${chineseId}/${date}`);
  return response.data;
};

export const getChineseYearlyHoroscope = async (chineseId: number): Promise<ChineseHoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/chinese_yearly/${chineseId}`);
  return response.data;
};

export const getChineseFullHoroscope = async (chineseId: number): Promise<ChineseHoroscopeResponse> => {
  const response = await axios.get(`${BASE_URL}/chinese_full/${chineseId}`);
  return response.data;
};

export const getLoveMatch = async (sign1: string, sign2: string): Promise<MatchResponse> => {
  const response = await axios.get(`${BASE_URL}/lovematch/${sign1}/${sign2}`);
  return response.data;
};

export const getFriendMatch = async (sign1: string, sign2: string): Promise<MatchResponse> => {
  const response = await axios.get(`${BASE_URL}/friendmatch/${sign1}/${sign2}`);
  return response.data;
};

export const searchDreamBook = async (word: string) => {
  const response = await axios.get(`${BASE_URL}/dreambook/search/?s=${word}`);
  return response.data;
};

export const getDreamBookWord = async (wordId: number) => {
  const response = await axios.get(`${BASE_URL}/dreambook/get_word/?word_id=${wordId}`);
  return response.data;
}; 
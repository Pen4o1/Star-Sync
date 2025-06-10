import axios from 'axios'
import Constants from 'expo-constants'

// Use a CORS proxy for development environment
const isDevelopment = __DEV__
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
const BASE_URL = isDevelopment
  ? `${PROXY_URL}http://cms.buzlylabs.com/horoscope_api`
  : 'http://cms.buzlylabs.com/horoscope_api'

export const getDailyHoroscope = async (zodiacId, date) => {
  const response = await axios.get(`${BASE_URL}/daily/${zodiacId}/${date}/`)
  return response.data
}

export const getWeeklyHoroscope = async (zodiacId) => {
  const response = await axios.get(`${BASE_URL}/weekly/${zodiacId}`)
  return response.data
}

export const getMonthlyHoroscope = async (zodiacId) => {
  const response = await axios.get(`${BASE_URL}/monthly/${zodiacId}`)
  return response.data
}

export const getYearlyHoroscope = async (zodiacId) => {
  const response = await axios.get(`${BASE_URL}/yearly/${zodiacId}`)
  return response.data
}

export const getFullHoroscope = async (zodiacId) => {
  const response = await axios.get(`${BASE_URL}/full/${zodiacId}`)
  return response.data
}

export const getChineseDailyHoroscope = async (chineseId, date) => {
  const response = await axios.get(`${BASE_URL}/chinese/${chineseId}/${date}`)
  return response.data
}

export const getChineseYearlyHoroscope = async (chineseId) => {
  const response = await axios.get(`${BASE_URL}/chinese_yearly/${chineseId}`)
  return response.data
}

export const getChineseFullHoroscope = async (chineseId) => {
  const response = await axios.get(`${BASE_URL}/chinese_full/${chineseId}`)
  return response.data
}

export const getLoveMatch = async (sign1, sign2) => {
  const response = await axios.get(`${BASE_URL}/lovematch/${sign1}/${sign2}`)
  return response.data
}

export const getFriendMatch = async (sign1, sign2) => {
  const response = await axios.get(`${BASE_URL}/friendmatch/${sign1}/${sign2}`)
  return response.data
}

export const searchDreamBook = async (word) => {
  const response = await axios.get(`${BASE_URL}/dreambook/search/?s=${word}`)
  return response.data
}

export const getDreamBookWord = async (wordId) => {
  const response = await axios.get(
    `${BASE_URL}/dreambook/get_word/?word_id=${wordId}`
  )
  return response.data
}

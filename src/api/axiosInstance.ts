import axios from 'axios'

export const baseURL = 'http://had360.runasp.net'

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

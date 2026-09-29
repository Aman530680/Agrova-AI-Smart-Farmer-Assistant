import axios from 'axios'

const rawBase = import.meta.env.VITE_API_URL || '/api'
const cleanBase = rawBase.replace(/\/+$/, '')
export const API_BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getAuthToken() {
  return localStorage.getItem('token')
}

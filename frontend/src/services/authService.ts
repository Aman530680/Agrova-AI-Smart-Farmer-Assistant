import { api } from '../lib/api'
import type { User } from '../types'

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password })
  return { token: data.access_token as string, user: data.user as User }
}

export async function register(payload: {
  name: string
  email: string
  password: string
  primary_language: string
}) {
  const { data } = await api.post('/auth/register', payload)
  return { token: data.access_token as string, user: data.user as User }
}

export function demoSession() {
  const user: User = {
    id: 'demo-rajesh',
    name: 'Rajesh Kumar',
    email: 'rajesh@agrova.ai',
    primary_language: 'en',
  }
  return { token: 'demo-token', user }
}

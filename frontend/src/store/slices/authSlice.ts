import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  primary_language: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const getInitialToken = (): string | null => {
  return localStorage.getItem('token')
}

const getInitialUser = (): User | null => {
  const userJson = localStorage.getItem('user')
  try {
    return userJson ? JSON.parse(userJson) : null
  } catch {
    return null
  }
}

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

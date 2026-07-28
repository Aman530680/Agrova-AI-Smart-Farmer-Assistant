import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import i18n from '../../i18n/config'

interface SettingsState {
  theme: 'light' | 'dark'
  language: string
}

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark'
  if (saved) return saved
  return 'dark' // Default to dark for rich aesthetics
}

const getInitialLanguage = (): string => {
  return localStorage.getItem('i18nextLng') || 'en'
}

const initialState: SettingsState = {
  theme: getInitialTheme(),
  language: getInitialLanguage(),
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
      localStorage.setItem('i18nextLng', action.payload)
      i18n.changeLanguage(action.payload)
    },
  },
})

export const { setTheme, setLanguage } = settingsSlice.actions
export default settingsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import i18n from '../../i18n/config'

interface SettingsState {
  theme: 'light'
  language: string
}

const getInitialLanguage = (): string => {
  return localStorage.getItem('i18nextLng') || 'en'
}

const initialState: SettingsState = {
  theme: 'light',
  language: getInitialLanguage(),
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state) {
      state.theme = 'light'
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
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

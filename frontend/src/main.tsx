import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import './i18n/config'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/ui/Toast'

const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.remove('dark')
if (savedTheme !== 'light') localStorage.setItem('theme', 'light')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)

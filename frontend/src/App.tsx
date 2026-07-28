import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store'

// Global Pages
import Landing from './pages/Landing'
import LanguageSelect from './pages/LanguageSelect'
import Login from './pages/Login'
import Register from './pages/Register'

// Layout & Dashboard
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'

// Module Pages
import ChatbotModule from './pages/modules/ChatbotModule'
import PestModule from './pages/modules/PestModule'
import WeatherModule from './pages/modules/WeatherModule'
import MarketModule from './pages/modules/MarketModule'
import CropModule from './pages/modules/CropModule'
import SchemesModule from './pages/modules/SchemesModule'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Language Select */}
        <Route path="/" element={<Landing />} />
        <Route path="/language" element={<LanguageSelect />} />

        {/* Authentication Routes (Public Only) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Dashboard Area */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Index Dashboard page */}
          <Route index element={<Dashboard />} />

          {/* Core Modules */}
          <Route path="chatbot" element={<ChatbotModule />} />
          <Route path="pest" element={<PestModule />} />
          <Route path="weather" element={<WeatherModule />} />
          <Route path="market" element={<MarketModule />} />
          <Route path="crop" element={<CropModule />} />
          <Route path="schemes" element={<SchemesModule />} />
        </Route>

        {/* Fallback to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

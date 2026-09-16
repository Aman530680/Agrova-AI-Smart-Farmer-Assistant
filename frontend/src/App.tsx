import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import LanguageSelect from './pages/LanguageSelect'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ChatbotModule from './pages/modules/ChatbotModule'
import PestModule from './pages/modules/PestModule'
import WeatherModule from './pages/modules/WeatherModule'
import MarketModule from './pages/modules/MarketModule'
import CropModule from './pages/modules/CropModule'
import SchemesModule from './pages/modules/SchemesModule'
import Profile from './pages/Profile'
import SettingsPage from './pages/Settings'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chatbot" element={<ChatbotModule />} />
          <Route path="pest" element={<PestModule />} />
          <Route path="weather" element={<WeatherModule />} />
          <Route path="market" element={<MarketModule />} />
          <Route path="crop" element={<CropModule />} />
          <Route path="schemes" element={<SchemesModule />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

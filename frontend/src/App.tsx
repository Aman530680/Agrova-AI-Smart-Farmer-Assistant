import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Global Pages
import Landing from './pages/Landing'
import LanguageSelect from './pages/LanguageSelect'

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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Language Select */}
        <Route path="/" element={<Landing />} />
        <Route path="/language" element={<LanguageSelect />} />

        {/* Main Dashboard Area */}
        <Route path="/dashboard" element={<DashboardLayout />}>
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

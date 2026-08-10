import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EmergencySOSPage from './pages/EmergencySOSPage'
import QuickAlertPage from './pages/QuickAlertPage'
import { CheckInPage } from './pages/CheckInPage'
import { ContactsPage } from './pages/ContactsPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import GuardianDashboard from './pages/GuardianDashboard'
import GuardianAlertsPage from './pages/GuardianAlertsPage'
import GuardianCommunicationPage from './pages/GuardianCommunicationPage'

function ProtectedUserRoute({ children }: { children: React.ReactNode }) {
  const { userProfile, guardianUser } = useStore()
  if (!userProfile && !guardianUser) return <Navigate to="/" />
  if (guardianUser) return <Navigate to="/guardian" />
  return <>{children}</>
}

function ProtectedGuardianRoute({ children }: { children: React.ReactNode }) {
  const { guardianUser } = useStore()
  if (!guardianUser) return <Navigate to="/" />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user" element={<ProtectedUserRoute><Layout mode="user"><DashboardPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/sos" element={<ProtectedUserRoute><Layout mode="user"><EmergencySOSPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/quick-alert" element={<ProtectedUserRoute><Layout mode="user"><QuickAlertPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/checkin" element={<ProtectedUserRoute><Layout mode="user"><CheckInPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/contacts" element={<ProtectedUserRoute><Layout mode="user"><ContactsPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/history" element={<ProtectedUserRoute><Layout mode="user"><HistoryPage /></Layout></ProtectedUserRoute>} />
        <Route path="/user/settings" element={<ProtectedUserRoute><Layout mode="user"><SettingsPage /></Layout></ProtectedUserRoute>} />
        <Route path="/guardian" element={<ProtectedGuardianRoute><Layout mode="guardian"><GuardianDashboard /></Layout></ProtectedGuardianRoute>} />
        <Route path="/guardian/alerts" element={<ProtectedGuardianRoute><Layout mode="guardian"><GuardianAlertsPage /></Layout></ProtectedGuardianRoute>} />
        <Route path="/guardian/communication" element={<ProtectedGuardianRoute><Layout mode="guardian"><GuardianCommunicationPage /></Layout></ProtectedGuardianRoute>} />
        <Route path="/guardian/history" element={<ProtectedGuardianRoute><Layout mode="guardian"><HistoryPage /></Layout></ProtectedGuardianRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

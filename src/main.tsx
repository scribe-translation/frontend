import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import SpeakerShell from './components/Input/SpeakerShell.tsx'
import TranslationApp from './components/Output/TranslationApp.tsx'
import AuthPage from './components/Auth/AuthPage.tsx'
import ResetPasswordPage from './components/Auth/ResetPasswordPage.tsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { SessionCodeProvider } from './contexts/SessionContext'
import theme from './theme/theme'
import './index.css'

const App = () => {
  const hostname = window.location.hostname
  const subdomain = hostname.split('.')[0]
  const isDev = import.meta.env.VITE_NODE_ENV === 'dev'
  const isPlainLocalDevHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  
  // Check if there's a reset token in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const hasResetToken = urlParams.get('token') !== null;

  const speakerRoutes = (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={
          <ProtectedRoute fallback={<AuthPage />}>
            <SpeakerShell />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )

  const listenerRoutes = (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<TranslationApp />} />
      </Routes>
    </BrowserRouter>
  )
  
  if (subdomain === 'speaker') {
    return speakerRoutes
  } else if (subdomain === 'listener') {
    return listenerRoutes
  } else if (isDev && isPlainLocalDevHost) {
    // Dev fallback: http://localhost:5173/ or http://10.x.x.x:5173/ → listener
    // http://localhost:5173/speaker → speaker (requires /etc/hosts subdomains in prod-like dev)
    const path = window.location.pathname
    if (path.startsWith('/speaker')) {
      return speakerRoutes
    }
    return listenerRoutes
  } else if (hasResetToken) {
    // Allow reset-password on main domain if there's a token
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    )
  } else {
    return (<>404 - Not Found</>)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionCodeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SessionCodeProvider>
    </ThemeProvider>
  </React.StrictMode>
)

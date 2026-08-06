import React from 'react'
import { Box, useTheme } from '@mui/material'
import { useLocation } from 'react-router-dom'
import InputApp from './InputApp'
import ProfilePage from '../Profile/ProfilePage'
import AdminPage from '../Admin/AdminPage'

/**
 * Keeps InputApp mounted on all speaker routes so translation / socket sessions
 * survive opening /profile or /admin. Overlays are full-viewport layers on top.
 */
const SpeakerShell: React.FC = () => {
  const location = useLocation()
  const theme = useTheme()
  const showProfile = location.pathname === '/profile'
  const showAdmin = location.pathname === '/admin'

  const overlaySx = {
    position: 'fixed' as const,
    inset: 0,
    zIndex: theme.zIndex.modal,
    overflow: 'auto',
    backgroundColor: 'background.default',
  }

  return (
    <>
      <InputApp />
      {showProfile && (
        <Box sx={overlaySx}>
          <ProfilePage />
        </Box>
      )}
      {showAdmin && (
        <Box sx={overlaySx}>
          <AdminPage />
        </Box>
      )}
    </>
  )
}

export default SpeakerShell

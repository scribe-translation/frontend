import React from 'react'
import { Box, useTheme } from '@mui/material'
import { useLocation } from 'react-router-dom'
import InputApp from './InputApp'
import ProfilePage from '../Profile/ProfilePage'

/**
 * Keeps InputApp mounted on all speaker routes so translation / socket sessions
 * survive opening /profile. Profile is a full-viewport layer on top.
 */
const SpeakerShell: React.FC = () => {
  const location = useLocation()
  const theme = useTheme()
  const showProfile = location.pathname === '/profile'

  return (
    <>
      <InputApp />
      {showProfile && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: theme.zIndex.modal,
            overflow: 'auto',
            backgroundColor: 'background.default'
          }}
        >
          <ProfilePage />
        </Box>
      )}
    </>
  )
}

export default SpeakerShell

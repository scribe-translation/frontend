import React, { useState } from 'react'
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Container,
  Paper,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import Typography from '../UI/Typography'
import ProfileContent from './ProfileContent'
import SessionHistoryList from './SessionHistoryList'
import { useAuth } from '../../contexts/AuthContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: { xs: 1, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: 'background.default',
      paddingBottom: '2rem'
    }}>
      <Container maxWidth="md" disableGutters={isMobile}>
        <Box sx={{ py: { xs: 1, md: 4 }, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconButton onClick={() => navigate('/')} sx={{ color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="sectionHeader" sx={{ marginBottom: 0 }}>
            Account Settings
          </Typography>
        </Box>

        <Paper sx={{
          borderRadius: '2rem',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  py: 2
                }
              }}
            >
              <Tab label="History" id="profile-tab-0" />
              <Tab label="Profile Info" id="profile-tab-1" />
            </Tabs>
          </Box>

          <Box sx={{ px: { xs: 0, md: 4 }, minHeight: '60vh' }}>
            <TabPanel value={tabValue} index={0}>
              <SessionHistoryList />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ProfileContent user={user} />
              <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={logout}
                  sx={{ borderRadius: '2rem', px: 4 }}
                >
                  Logout
                </Button>
              </Box>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ProfilePage

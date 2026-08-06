import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  IconButton,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import Typography from '../UI/Typography'
import { useAuth } from '../../contexts/AuthContext'
import AdminOverviewTab from './AdminOverviewTab'
import AdminUsersTab from './AdminUsersTab'
import AdminLiveTab from './AdminLiveTab'
import AdminHistoryTab from './AdminHistoryTab'
import AdminSettingsTab from './AdminSettingsTab'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  )
}

const TABS = ['Overview', 'Users', 'Live', 'History', 'Settings'] as const

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [denied, setDenied] = useState(false)
  const navigate = useNavigate()
  const { user, tokens } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (user && !user.isAdmin) {
      setDenied(true)
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  if (!user?.isAdmin || !tokens?.accessToken) {
    return null
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: 'background.default',
      pb: { xs: 4, md: 5 },
    }}>
      <Container maxWidth="md" disableGutters={isMobile} sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          pt: { xs: 1.5, md: 3 },
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: 'background.default',
        }}>
          <IconButton onClick={() => navigate('/')} sx={{ color: 'primary.main' }} aria-label="Back to app">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="sectionHeader" sx={{ mb: 0, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Admin
          </Typography>
        </Box>

        <Box sx={{
          borderBottom: '1px solid rgba(155, 181, 209, 0.2)',
          position: 'sticky',
          top: { xs: 56, md: 72 },
          zIndex: 9,
          backgroundColor: 'background.default',
          mx: { xs: -0.5, md: 0 },
        }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons={false}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: 42,
              '& .MuiTabs-flexContainer': { gap: { xs: 0, md: 0.5 } },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                py: 1.25,
                px: { xs: 1.5, md: 2 },
                minHeight: 42,
                minWidth: 'auto',
                color: 'text.secondary',
                opacity: 0.75,
                '&.Mui-selected': {
                  color: 'primary.main',
                  opacity: 1,
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: 2,
                backgroundColor: 'primary.main',
              },
            }}
          >
            {TABS.map((label) => (
              <Tab key={label} label={label} disableRipple />
            ))}
          </Tabs>
        </Box>

        <Box>
          <TabPanel value={tabValue} index={0}>
            <AdminOverviewTab accessToken={tokens.accessToken} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AdminUsersTab accessToken={tokens.accessToken} currentUserId={user.id} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <AdminLiveTab accessToken={tokens.accessToken} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <AdminHistoryTab accessToken={tokens.accessToken} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <AdminSettingsTab accessToken={tokens.accessToken} />
          </TabPanel>
        </Box>
      </Container>

      <Snackbar
        open={denied}
        autoHideDuration={5000}
        onClose={() => setDenied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setDenied(false)} sx={{ width: '100%' }}>
          Admin access required
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminPage

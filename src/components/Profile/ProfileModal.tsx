import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import SecurityIcon from '@mui/icons-material/Security'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import EventIcon from '@mui/icons-material/Event'
import TimerIcon from '@mui/icons-material/Timer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Typography from '../UI/Typography'
import TOTPSetupModal from './TOTPSetupModal'
import { useAuth } from '../../contexts/AuthContext'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
  <Card sx={{ 
    flex: 1,
    maxWidth: '105px',
    background: `linear-gradient(135deg, ${color}26 0%, ${color}0D 100%)`,
    border: `1px solid ${color}4D`,
    borderRadius: '0.75rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${color}33`
    }
  }}>
    <CardContent sx={{ textAlign: 'center', padding: '0.75rem !important' }}>
      <Box sx={{ color, marginBottom: '0.25rem' }}>
        {icon}
      </Box>
      <Typography variant="sectionHeader" sx={{ fontSize: '1.125rem', fontWeight: 'bold', color }}>
        {value}
      </Typography>
      <Typography variant="captionText" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
)

interface User {
  id: number
  email: string
  name: string
  sessionCode?: string
  createdAt: string
  updatedAt?: string
  totpEnabled?: boolean
  totalSessions?: number
  totalUsageMinutes?: number
}

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  user: User | null
  isSocketConnected: boolean
  onLogout: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  user,
  isSocketConnected,
  onLogout
}) => {
  const { generateSessionCode, setSessionCode, clearSessionCode } = useAuth()
  const [totpSetupOpen, setTotpSetupOpen] = useState(false)
  const [totpEnabled, setTotpEnabled] = useState(user?.totpEnabled || false)
  const [sessionCodeError, setSessionCodeError] = useState<string | null>(null)
  const [totpError, setTotpError] = useState<string | null>(null)
  const [isEditingSessionCode, setIsEditingSessionCode] = useState(false)
  const [customSessionCode, setCustomSessionCode] = useState('')
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isSettingCode, setIsSettingCode] = useState(false)
  const [isClearingCode, setIsClearingCode] = useState(false)

  // Update TOTP status when user data changes
  useEffect(() => {
    setTotpEnabled(user?.totpEnabled || false)
  }, [user?.totpEnabled])
  
  const handleLogout = () => {
    onClose()
    onLogout()
  }

  const handleGenerateSessionCode = async () => {
    setIsGeneratingCode(true)
    setSessionCodeError(null)
    
    try {
      await generateSessionCode()
      setIsEditingSessionCode(false)
    } catch (error) {
      setSessionCodeError(error instanceof Error ? error.message : 'Failed to generate session code')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleSetCustomSessionCode = async () => {
    if (!customSessionCode.trim()) return
    
    // Validate session code format
    if (!/^[A-Z0-9]{3,8}$/.test(customSessionCode.trim().toUpperCase())) {
      setSessionCodeError('Session code must be 3-8 alphanumeric characters')
      return
    }
    
    setIsSettingCode(true)
    setSessionCodeError(null)
    
    try {
      await setSessionCode(customSessionCode.trim().toUpperCase())
      setCustomSessionCode('')
      setIsEditingSessionCode(false)
    } catch (error) {
      setSessionCodeError(error instanceof Error ? error.message : 'Failed to set session code')
    } finally {
      setIsSettingCode(false)
    }
  }

  const handleClearSessionCode = async () => {
    setIsClearingCode(true)
    setSessionCodeError(null)
    
    try {
      await clearSessionCode()
      setIsEditingSessionCode(false)
    } catch (error) {
      setSessionCodeError(error instanceof Error ? error.message : 'Failed to clear session code')
    } finally {
      setIsClearingCode(false)
    }
  }

  const handleCopySessionCode = () => {
    if (user?.sessionCode) {
      navigator.clipboard.writeText(user.sessionCode)
    }
  }

  const handleStartEditing = () => {
    setCustomSessionCode('')
    setIsEditingSessionCode(true)
    setSessionCodeError(null)
  }

  const handleCancelEditing = () => {
    setIsEditingSessionCode(false)
    setCustomSessionCode('')
    setSessionCodeError(null)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '2rem',
          padding: '1rem'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
        <Typography variant="sectionHeader">
          Profile
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', paddingTop: '0.5rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="sectionHeader" sx={{ fontSize: '1.5rem' }}>
              {user?.name}
            </Typography>
            <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '2rem',
            width: '100%',
            justifyContent: 'center'
          }}>
            <StatCard
              icon={<EventIcon sx={{ fontSize: 21 }} />}
              value={user?.totalSessions || 0}
              label="Sessions"
              color="#9BB5D1"
            />
            <StatCard
              icon={<TimerIcon sx={{ fontSize: 21 }} />}
              value={`${Math.floor(((user?.totalUsageMinutes || 0) / (user?.totalSessions || 1)) / 60)}h${Math.round(((user?.totalUsageMinutes || 0) / (user?.totalSessions || 1)) % 60)}m`}
              label="Avg. Time"
              color="#D2B48C"
            />
            <StatCard
              icon={<AccessTimeIcon sx={{ fontSize: 21 }} />}
              value={`${Math.floor((user?.totalUsageMinutes || 0) / 60)}h${Math.round((user?.totalUsageMinutes || 0) % 60)}m`}
              label="Total Time"
              color="#78B48C"
            />
          </Box>
        </Box>
        
        <Divider sx={{ margin: '1rem 0' }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <Box>
            <Typography variant="sectionHeader" sx={{ color: 'text.primary', marginBottom: '0.5rem' }}>
              Account Information
            </Typography>
            <Typography variant="bodyText" sx={{ color: 'text.secondary', marginBottom: '0.25rem' }}>
              <strong>Name:</strong> {user?.name}
            </Typography>
            <Typography variant="bodyText" sx={{ color: 'text.secondary', marginBottom: '0.25rem' }}>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
              <strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="sectionHeader" sx={{ marginBottom: '0.5rem' }}>
              Session Code Management
            </Typography>
            
            {!isEditingSessionCode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
                    <strong>Current Code:</strong> {user?.sessionCode || 'Not set'}
                  </Typography>
                  {user?.sessionCode && (
                    <Tooltip title="Copy to clipboard">
                      <IconButton size="small" onClick={handleCopySessionCode}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleGenerateSessionCode}
                    disabled={isGeneratingCode}
                    sx={{ borderRadius: '1rem' }}
                  >
                    {isGeneratingCode ? 'Generating...' : 'Generate New'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={handleStartEditing}
                    sx={{ borderRadius: '1rem' }}
                  >
                    Set Custom
                  </Button>
                  
                  {user?.sessionCode && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={handleClearSessionCode}
                      disabled={isClearingCode}
                      sx={{ borderRadius: '1rem' }}
                    >
                      {isClearingCode ? 'Clearing...' : 'Clear'}
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField
                  label="Custom Session Code"
                  value={customSessionCode}
                  onChange={(e) => setCustomSessionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                  placeholder="ABC123"
                  variant="outlined"
                  size="small"
                  helperText="3-8 alphanumeric characters"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '1rem',
                      fontFamily: 'monospace',
                      textAlign: 'center'
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSetCustomSessionCode}
                    disabled={!customSessionCode.trim() || isSettingCode}
                    sx={{ borderRadius: '1rem' }}
                  >
                    {isSettingCode ? 'Setting...' : 'Set Code'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancelEditing}
                    disabled={isSettingCode}
                    sx={{ borderRadius: '1rem' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
            
            {sessionCodeError && (
              <Alert severity="error" sx={{ marginTop: '0.5rem' }}>
                {sessionCodeError}
              </Alert>
            )}
          </Box>
          
          <Box>
            <Typography variant="sectionHeader" sx={{ marginBottom: '0.5rem' }}>
              Security Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={totpEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTotpSetupOpen(true)
                    } else {
                      // TODO: Add disable TOTP functionality
                      setTotpError('TOTP disable functionality not implemented yet')
                    }
                  }}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SecurityIcon sx={{ fontSize: 20 }} />
                  <Typography variant="bodyText">
                    Two-Factor Authentication (TOTP)
                  </Typography>
                </Box>
              }
            />
            {totpError && (
              <Alert severity="error" sx={{ marginTop: '0.5rem' }}>
                {totpError}
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingTop: '0.5rem' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ marginRight: '1rem', borderRadius: '2rem' }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: '2rem' }}
        >
          Logout
        </Button>
      </DialogActions>
      
      <TOTPSetupModal
        open={totpSetupOpen}
        onClose={() => setTotpSetupOpen(false)}
        onSuccess={() => {
          setTotpEnabled(true)
          setTotpSetupOpen(false)
          setTotpError(null)
        }}
        user={user}
      />
      
    </Dialog>
  )
}

export default ProfileModal

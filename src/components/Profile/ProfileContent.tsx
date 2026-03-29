import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Button
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import EventIcon from '@mui/icons-material/Event'
import TimerIcon from '@mui/icons-material/Timer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SecurityIcon from '@mui/icons-material/Security'
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
  userCode?: string
  createdAt: string
  updatedAt?: string
  totpEnabled?: boolean
  totalSessions?: number
  totalUsageMinutes?: number
}

interface ProfileContentProps {
  user: User | null
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const { generateUserCode, setUserCode, clearUserCode } = useAuth()
  const [totpSetupOpen, setTotpSetupOpen] = useState(false)
  const [totpEnabled, setTotpEnabled] = useState(user?.totpEnabled || false)
  const [userCodeError, setUserCodeError] = useState<string | null>(null)
  const [totpError, setTotpError] = useState<string | null>(null)
  const [isEditingUserCode, setIsEditingUserCode] = useState(false)
  const [customUserCode, setCustomUserCode] = useState('')
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isSettingCode, setIsSettingCode] = useState(false)
  const [isClearingCode, setIsClearingCode] = useState(false)

  useEffect(() => {
    setTotpEnabled(user?.totpEnabled || false)
  }, [user?.totpEnabled])

  const handleGenerateUserCode = async () => {
    setIsGeneratingCode(true)
    setUserCodeError(null)
    try {
      await generateUserCode()
      setIsEditingUserCode(false)
    } catch (error) {
      setUserCodeError(error instanceof Error ? error.message : 'Failed to generate user code')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleSetCustomUserCode = async () => {
    if (!customUserCode.trim()) return
    if (!/^[A-Z0-9]{3,8}$/.test(customUserCode.trim().toUpperCase())) {
      setUserCodeError('User code must be 3-8 alphanumeric characters')
      return
    }
    setIsSettingCode(true)
    setUserCodeError(null)
    try {
      await setUserCode(customUserCode.trim().toUpperCase())
      setCustomUserCode('')
      setIsEditingUserCode(false)
    } catch (error) {
      setUserCodeError(error instanceof Error ? error.message : 'Failed to set user code')
    } finally {
      setIsSettingCode(false)
    }
  }

  const handleClearUserCode = async () => {
    setIsClearingCode(true)
    setUserCodeError(null)
    try {
      await clearUserCode()
      setIsEditingUserCode(false)
    } catch (error) {
      setUserCodeError(error instanceof Error ? error.message : 'Failed to clear user code')
    } finally {
      setIsClearingCode(false)
    }
  }

  const handleCopyUserCode = () => {
    if (user?.userCode) {
      navigator.clipboard.writeText(user.userCode)
    }
  }

  return (
    <Box sx={{ padding: '1rem' }}>
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
            User Code Management
          </Typography>
          
          {!isEditingUserCode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
                  <strong>Current Code:</strong> {user?.userCode || 'Not set'}
                </Typography>
                {user?.userCode && (
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={handleCopyUserCode}>
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
                  onClick={handleGenerateUserCode}
                  disabled={isGeneratingCode}
                  sx={{ borderRadius: '1rem' }}
                >
                  {isGeneratingCode ? 'Generating...' : 'Generate New'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingUserCode(true)}
                  sx={{ borderRadius: '1rem' }}
                >
                  Set Custom
                </Button>
                
                {user?.userCode && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearUserCode}
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
                label="Custom User Code"
                value={customUserCode}
                onChange={(e) => setCustomUserCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                placeholder="ABC123"
                variant="outlined"
                size="small"
                helperText="3-8 alphanumeric characters"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '1rem',
                    fontFamily: 'monospace',
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSetCustomUserCode}
                  disabled={!customUserCode.trim() || isSettingCode}
                  sx={{ borderRadius: '1rem' }}
                >
                  {isSettingCode ? 'Setting...' : 'Set Code'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditingUserCode(false)}
                  disabled={isSettingCode}
                  sx={{ borderRadius: '1rem' }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
          
          {userCodeError && (
            <Alert severity="error" sx={{ marginTop: '0.5rem' }}>
              {userCodeError}
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
                  if (e.target.checked) setTotpSetupOpen(true)
                  else setTotpError('TOTP disable functionality not implemented yet')
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
    </Box>
  )
}

export default ProfileContent

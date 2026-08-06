import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material'
import Typography from '../UI/Typography'
import { adminService, AppSettings } from '../../services/adminService'
import { AdminDataCard } from './adminShared'

interface AdminSettingsTabProps {
  accessToken: string
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ accessToken }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const { settings: data } = await adminService.getSettings(accessToken)
      setSettings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load()
  }, [load])

  const handleToggle = async (enabled: boolean) => {
    setSaving(true)
    setMessage(null)
    try {
      const { settings: updated } = await adminService.patchSettings(accessToken, enabled)
      setSettings(updated)
      setMessage('Settings saved')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <AdminDataCard>
        <Typography variant="subsectionHeader" sx={{ mb: 1.5, fontSize: '1rem', fontStyle: 'normal' }}>
          Global settings
        </Typography>

        <FormControlLabel
          sx={{
            alignItems: 'flex-start',
            mx: 0,
            width: '100%',
            justifyContent: 'space-between',
            ml: 0,
            '& .MuiFormControlLabel-label': {
              pt: 0.75,
              lineHeight: 1.4,
              fontStyle: 'normal',
            },
          }}
          labelPlacement="start"
          control={
            <Switch
              checked={settings?.interimTranslationEnabled === true}
              onChange={(e) => handleToggle(e.target.checked)}
              disabled={saving}
            />
          }
          label="Interim translation"
        />
        <Typography
          variant="bodyText"
          sx={{ display: 'block', mt: 1, color: 'text.secondary', fontSize: '0.8rem', opacity: 0.75, fontStyle: 'normal' }}
        >
          When off, partial translations are suppressed to reduce API cost.
        </Typography>
      </AdminDataCard>
    </Box>
  )
}

export default AdminSettingsTab

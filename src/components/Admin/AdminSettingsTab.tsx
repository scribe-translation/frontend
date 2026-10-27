import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material'
import Typography from '../UI/Typography'
import { adminService, AdminUser, AppSettings } from '../../services/adminService'
import { AdminDataCard } from './adminShared'

interface AdminSettingsTabProps {
  accessToken: string
}

interface UserOption {
  id: string
  label: string
}

function userOption(user: AdminUser): UserOption {
  return {
    id: user.id,
    label: user.email || user.name || user.id,
  }
}

function optionsFor(users: AdminUser[], selectedIds: string[]): UserOption[] {
  const known = new Set(users.map((user) => user.id))
  const unknown = selectedIds
    .filter((id) => !known.has(id))
    .map((id) => ({ id, label: id }))
  return [...users.map(userOption), ...unknown]
}

function selectedOptions(options: UserOption[], selectedIds: string[]): UserOption[] {
  const byId = new Map(options.map((option) => [option.id, option]))
  return selectedIds.map((id) => byId.get(id) ?? { id, label: id })
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ accessToken }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [{ settings: data }, usersResult] = await Promise.all([
        adminService.getSettings(accessToken),
        adminService.getUsers(accessToken).catch(() => ({ users: [] as AdminUser[] })),
      ])
      setSettings({
        ...data,
        interimTranslationEnabledUserIds: data.interimTranslationEnabledUserIds ?? [],
        interimTranslationDisabledUserIds: data.interimTranslationDisabledUserIds ?? [],
      })
      setUsers(usersResult.users)
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

  const enabledIds = settings?.interimTranslationEnabledUserIds ?? []
  const disabledIds = settings?.interimTranslationDisabledUserIds ?? []
  const enabledOptions = useMemo(() => optionsFor(users, enabledIds), [users, enabledIds])
  const disabledOptions = useMemo(() => optionsFor(users, disabledIds), [users, disabledIds])

  const save = async (
    patch: Parameters<typeof adminService.patchSettings>[1],
    optimistic?: AppSettings
  ) => {
    const previous = settings
    if (optimistic) setSettings(optimistic)
    setSaving(true)
    setMessage(null)
    try {
      const { settings: updated } = await adminService.patchSettings(accessToken, patch)
      setSettings({
        ...updated,
        interimTranslationEnabledUserIds: updated.interimTranslationEnabledUserIds ?? [],
        interimTranslationDisabledUserIds: updated.interimTranslationDisabledUserIds ?? [],
      })
      setMessage('Settings saved')
      setError(null)
    } catch (err) {
      if (previous) setSettings(previous)
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (enabled: boolean) => {
    if (!settings) return
    save(
      { interimTranslationEnabled: enabled },
      { ...settings, interimTranslationEnabled: enabled }
    )
  }

  const handleEnabledUsers = (next: UserOption[]) => {
    if (!settings) return
    const nextEnabled = next.map((option) => option.id)
    const nextDisabled = disabledIds.filter((id) => !nextEnabled.includes(id))
    save(
      {
        interimTranslationEnabledUserIds: nextEnabled,
        interimTranslationDisabledUserIds: nextDisabled,
      },
      {
        ...settings,
        interimTranslationEnabledUserIds: nextEnabled,
        interimTranslationDisabledUserIds: nextDisabled,
      }
    )
  }

  const handleDisabledUsers = (next: UserOption[]) => {
    if (!settings) return
    const nextDisabled = next.map((option) => option.id)
    const nextEnabled = enabledIds.filter((id) => !nextDisabled.includes(id))
    save(
      {
        interimTranslationEnabledUserIds: nextEnabled,
        interimTranslationDisabledUserIds: nextDisabled,
      },
      {
        ...settings,
        interimTranslationEnabledUserIds: nextEnabled,
        interimTranslationDisabledUserIds: nextDisabled,
      }
    )
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
          When off, partial translations are suppressed to reduce API cost. Listed users override this switch.
        </Typography>

        <Autocomplete
          multiple
          options={enabledOptions}
          value={selectedOptions(enabledOptions, enabledIds)}
          onChange={(_event, value) => handleEnabledUsers(value)}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={saving}
          sx={{ mt: 2.5 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="On for these users"
              placeholder={enabledIds.length === 0 ? 'Search users' : ''}
            />
          )}
        />
        <Typography
          variant="bodyText"
          sx={{ display: 'block', mt: 1, color: 'text.secondary', fontSize: '0.8rem', opacity: 0.75, fontStyle: 'normal' }}
        >
          These speakers get interim translation even when the switch is off.
        </Typography>

        <Autocomplete
          multiple
          options={disabledOptions}
          value={selectedOptions(disabledOptions, disabledIds)}
          onChange={(_event, value) => handleDisabledUsers(value)}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={saving}
          sx={{ mt: 2.5 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Off for these users"
              placeholder={disabledIds.length === 0 ? 'Search users' : ''}
            />
          )}
        />
        <Typography
          variant="bodyText"
          sx={{ display: 'block', mt: 1, mb: 0, color: 'text.secondary', fontSize: '0.8rem', opacity: 0.75, fontStyle: 'normal' }}
        >
          These speakers skip interim translation even when the switch is on. A user can be on only one list. Everyone else follows the switch.
        </Typography>
      </AdminDataCard>
    </Box>
  )
}

export default AdminSettingsTab

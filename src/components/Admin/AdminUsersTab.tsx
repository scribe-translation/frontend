import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import Typography from '../UI/Typography'
import { adminService, AdminUser, formatUsageMinutes } from '../../services/adminService'
import { AdminDataCard, AdminTabHeader, useAdminMobile } from './adminShared'

type SortKey = 'name' | 'email' | 'totalUsageMinutes' | 'totalSessions' | 'lastActiveAt'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'totalUsageMinutes', label: 'Usage' },
  { value: 'totalSessions', label: 'Sessions' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'lastActiveAt', label: 'Last active' },
]

interface AdminUsersTabProps {
  accessToken: string
  currentUserId?: string | number
}

const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ accessToken, currentUserId }) => {
  const isMobile = useAdminMobile()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('totalUsageMinutes')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [confirmClear, setConfirmClear] = useState<AdminUser | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const { users: data } = await adminService.getUsers(accessToken)
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load()
  }, [load])

  const sorted = useMemo(() => {
    const copy = [...users]
    copy.sort((a, b) => {
      let av: string | number = 0
      let bv: string | number = 0
      switch (sortBy) {
        case 'name':
          av = a.name?.toLowerCase() || ''
          bv = b.name?.toLowerCase() || ''
          break
        case 'email':
          av = a.email?.toLowerCase() || ''
          bv = b.email?.toLowerCase() || ''
          break
        case 'lastActiveAt':
          av = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0
          bv = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0
          break
        default:
          av = a[sortBy] ?? 0
          bv = b[sortBy] ?? 0
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [users, sortBy, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  const toggleActive = async (user: AdminUser) => {
    setActionLoading(user.id)
    try {
      await adminService.patchUser(accessToken, user.id, { isActive: !user.isActive })
      setSnackbar(user.isActive ? 'User deactivated' : 'User reactivated')
      await load()
    } catch (err) {
      setSnackbar(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const clearSessionCode = async () => {
    if (!confirmClear) return
    setActionLoading(confirmClear.id)
    try {
      await adminService.patchUser(accessToken, confirmClear.id, {
        clearSessionCode: true,
        confirm: true,
      })
      setSnackbar('Session code cleared')
      setConfirmClear(null)
      await load()
    } catch (err) {
      setSnackbar(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const renderUserActions = (user: AdminUser) => (
    <Stack direction="row" spacing={0.5} justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
      {String(user.id) !== String(currentUserId) && (
        <Tooltip title={user.isActive ? 'Deactivate' : 'Reactivate'}>
          <span>
            <IconButton
              size="small"
              disabled={actionLoading === user.id}
              onClick={() => toggleActive(user)}
            >
              {user.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      )}
      {user.sessionCode && (
        <Tooltip title="Clear session code">
          <span>
            <IconButton
              size="small"
              disabled={actionLoading === user.id}
              onClick={() => setConfirmClear(user)}
            >
              <LinkOffIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <AdminTabHeader title={`${users.length} users`} onRefresh={load} refreshLabel="Refresh users" />

      {isMobile && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="admin-users-sort">Sort by</InputLabel>
            <Select
              labelId="admin-users-sort"
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            sx={{ minWidth: 72, flexShrink: 0 }}
          >
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </Stack>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isMobile ? (
        <Box>
          {sorted.map((user) => (
            <AdminDataCard key={user.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="bodyText" sx={{ fontWeight: 600, mb: 0.25, wordBreak: 'break-word', fontStyle: 'normal' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="bodyText" sx={{ color: 'text.secondary', wordBreak: 'break-all', display: 'block', fontSize: '0.8rem', opacity: 0.8, fontStyle: 'normal' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    backgroundColor: user.isActive ? 'rgba(39, 174, 96, 0.2)' : 'rgba(236, 240, 241, 0.08)',
                    color: user.isActive ? '#27AE60' : 'text.secondary',
                    border: 'none',
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.25 }}>
                <Typography variant="bodyText" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'normal' }}>
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{formatUsageMinutes(user.totalUsageMinutes)}</Box>
                  {' '}used
                </Typography>
                <Typography variant="bodyText" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'normal' }}>
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{user.totalSessions}</Box>
                  {' '}sessions
                </Typography>
                {user.sessionCode && (
                  <Typography variant="bodyText" sx={{ fontSize: '0.8rem', color: 'primary.main', fontWeight: 600, fontStyle: 'normal' }}>
                    {user.sessionCode}
                  </Typography>
                )}
              </Box>

              {user.lastActiveAt && (
                <Typography variant="bodyText" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.75rem', opacity: 0.7, fontStyle: 'normal' }}>
                  Last active {new Date(user.lastActiveAt).toLocaleString()}
                </Typography>
              )}

              {renderUserActions(user)}
            </AdminDataCard>
          ))}
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortBy === 'name'} direction={sortDir} onClick={() => handleSort('name')}>
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={sortBy === 'email'} direction={sortDir} onClick={() => handleSort('email')}>
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortBy === 'totalUsageMinutes'} direction={sortDir} onClick={() => handleSort('totalUsageMinutes')}>
                    Usage
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortBy === 'totalSessions'} direction={sortDir} onClick={() => handleSort('totalSessions')}>
                    Sessions
                  </TableSortLabel>
                </TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">{formatUsageMinutes(user.totalUsageMinutes)}</TableCell>
                  <TableCell align="right">{user.totalSessions}</TableCell>
                  <TableCell>
                    {user.sessionCode ? (
                      <Chip label={user.sessionCode} size="small" variant="outlined" />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{renderUserActions(user)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={!!confirmClear}
        onClose={() => setConfirmClear(null)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Clear session code?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clear the session code for {confirmClear?.email}? Listeners using this code will no longer connect.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmClear(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={clearSessionCode}>Clear</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar(null)} sx={{ width: '100%' }}>{snackbar}</Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminUsersTab

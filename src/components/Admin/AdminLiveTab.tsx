import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import Typography from '../UI/Typography'
import { adminService, LiveConnectionGroup } from '../../services/adminService'
import { AdminDataCard, AdminTabHeader, useAdminMobile } from './adminShared'
import { createHybridFlagElement } from '../../utils/flagEmojiUtils.tsx'
import { getCTLanguageInfo, normalizeSavedCTLanguage } from '../../enums/googleCTLangs'
import { resolveSTTLanguageInfo } from '../../enums/sttLanguages'

interface AdminLiveTabProps {
  accessToken: string
}

function languageDisplayName(lang: string): string {
  const ctLanguage = normalizeSavedCTLanguage(lang)
  if (ctLanguage) return getCTLanguageInfo(ctLanguage).name
  const sttInfo = resolveSTTLanguageInfo(lang)
  return sttInfo.name !== 'Unknown' ? sttInfo.name : lang
}

const LanguageFlags: React.FC<{ languages: string[] }> = ({ languages }) => {
  if (languages.length === 0) {
    return (
      <Typography variant="bodyText" sx={{ color: 'text.secondary', fontSize: '0.8rem', fontStyle: 'normal' }}>
        —
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
      {languages.map((lang) => (
        <Tooltip key={lang} title={languageDisplayName(lang)} arrow>
          <Chip
            size="small"
            variant="outlined"
            color="primary"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                {createHybridFlagElement(lang, 16)}
              </Box>
            }
            sx={{ '& .MuiChip-label': { px: 0.75, py: 0.25 } }}
          />
        </Tooltip>
      ))}
    </Box>
  )
}

const AdminLiveTab: React.FC<AdminLiveTabProps> = ({ accessToken }) => {
  const isMobile = useAdminMobile()
  const [groups, setGroups] = useState<LiveConnectionGroup[]>([])
  const [totalListeners, setTotalListeners] = useState(0)
  const [streamingCount, setStreamingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await adminService.getLiveConnections(accessToken)
      setGroups(data.groups)
      const listeners =
        typeof data.totalListeners === 'number'
          ? data.totalListeners
          : data.groups.reduce((sum, g) => sum + (g.listenerCount || 0), 0)
      setTotalListeners(listeners)
      setStreamingCount(data.streamingCount)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load live connections')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [load])

  if (loading && groups.length === 0 && !error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <AdminTabHeader
        subtitle={`${totalListeners} listeners · ${streamingCount} streaming · refreshes every 10s`}
        onRefresh={load}
        refreshLabel="Refresh live connections"
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {groups.length === 0 ? (
        <Typography variant="bodyText" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No active connections right now.
        </Typography>
      ) : isMobile ? (
        <Box>
          {groups.map((g) => (
            <AdminDataCard key={g.sessionCode}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="bodyText" sx={{ fontWeight: 600, color: 'primary.main', mb: 0, fontStyle: 'normal' }}>
                  {g.sessionCode}
                </Typography>
                <Chip
                  label={g.isStreaming ? 'Live' : 'Idle'}
                  size="small"
                  sx={{
                    backgroundColor: g.isStreaming ? 'rgba(231, 76, 60, 0.2)' : 'rgba(236, 240, 241, 0.08)',
                    color: g.isStreaming ? '#E74C3C' : 'text.secondary',
                    border: 'none',
                  }}
                />
              </Box>
              <Typography variant="bodyText" sx={{ fontSize: '0.875rem', mb: 1, wordBreak: 'break-all', fontStyle: 'normal' }}>
                {g.speakerEmail || 'No speaker email'}
              </Typography>
              <Typography variant="bodyText" sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'normal', mb: 1 }}>
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{g.listenerCount}</Box>
                {' '}listeners
              </Typography>
              <LanguageFlags languages={g.languages} />
            </AdminDataCard>
          ))}
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Session code</TableCell>
                <TableCell>Speaker</TableCell>
                <TableCell>Streaming</TableCell>
                <TableCell align="right">Listeners</TableCell>
                <TableCell>Languages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((g) => (
                <TableRow key={g.sessionCode} hover>
                  <TableCell>
                    <Chip label={g.sessionCode} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{g.speakerEmail || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={g.isStreaming ? 'Live' : 'Idle'}
                      color={g.isStreaming ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{g.listenerCount}</TableCell>
                  <TableCell>
                    <LanguageFlags languages={g.languages} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default AdminLiveTab

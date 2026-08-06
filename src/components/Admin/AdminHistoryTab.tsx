import React, { useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import Typography from '../UI/Typography'
import { adminService, AdminSession } from '../../services/adminService'
import { adminFieldRowSx, useAdminMobile } from './adminShared'

interface AdminHistoryTabProps {
  accessToken: string
}

const AdminHistoryTab: React.FC<AdminHistoryTabProps> = ({ accessToken }) => {
  const isMobile = useAdminMobile()
  const [email, setEmail] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Enter a user email to search')
      return
    }
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const { sessions: data } = await adminService.getSessions(accessToken, {
        email: email.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        limit: 50,
      })
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = keyword.trim()
    ? sessions.filter((s) =>
        s.fullText?.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        s.summary?.toLowerCase().includes(keyword.trim().toLowerCase())
      )
    : sessions

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          label="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          fullWidth
          autoComplete="email"
          inputMode="email"
        />
        <Box sx={adminFieldRowSx}>
          <TextField
            label="From date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label={isMobile ? 'Keyword filter' : 'Filter results by keyword (client-side)'}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="small"
          fullWidth
        />
        <Button
          variant="contained"
          fullWidth={isMobile}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, borderRadius: '2rem', py: 1.25 }}
        >
          Search sessions
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {searched && !loading && filtered.length === 0 && !error && (
        <Typography variant="bodyText" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No sessions found for this search.
        </Typography>
      )}

      {filtered.map((session) => (
        <Accordion
          key={session.id}
          disableGutters
          elevation={0}
          sx={{
            mb: 1.25,
            borderRadius: '0.75rem !important',
            backgroundColor: 'rgba(44, 62, 80, 0.45)',
            border: '1px solid rgba(155, 181, 209, 0.15)',
            '&:before': { display: 'none' },
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: { xs: 1.5, md: 2 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0, pr: 1 }}>
              <Typography variant="bodyText" sx={{ fontWeight: 600, mb: 0, fontSize: '0.875rem', fontStyle: 'normal' }}>
                {new Date(session.createdAt).toLocaleString()} · {session.sourceLanguage}
              </Typography>
              <Typography variant="bodyText" sx={{ color: 'text.secondary', fontSize: '0.75rem', opacity: 0.7, fontStyle: 'normal' }}>
                {session.characterCount} chars · {session.isActive ? 'Active' : 'Archived'}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: { xs: 1.5, md: 2 }, pt: 0 }}>
            {session.summary && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subsectionHeader" sx={{ fontSize: '0.8rem', mb: 0.5, fontStyle: 'normal' }}>
                  Summary
                </Typography>
                <Typography variant="bodyText" sx={{ fontSize: '0.875rem', fontStyle: 'normal' }}>
                  {session.summary}
                </Typography>
              </Box>
            )}
            <Typography variant="subsectionHeader" sx={{ fontSize: '0.8rem', mb: 0.5, fontStyle: 'normal' }}>
              Transcript
            </Typography>
            <Typography variant="bodyText" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', wordBreak: 'break-word', fontStyle: 'normal' }}>
              {session.fullText?.length > 2000
                ? `${session.fullText.slice(0, 2000)}…`
                : session.fullText}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default AdminHistoryTab

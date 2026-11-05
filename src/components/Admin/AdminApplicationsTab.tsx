import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
} from '@mui/material'
import Typography from '../UI/Typography'
import { adminService } from '../../services/adminService'
import {
  applicationStatusLabel,
  DiscountApplication,
} from '../../services/billingService'
import { AdminDataCard, AdminTabHeader, useAdminMobile } from './adminShared'

interface AdminApplicationsTabProps {
  accessToken: string
}

const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({ accessToken }) => {
  const isMobile = useAdminMobile()
  const [applications, setApplications] = useState<DiscountApplication[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('in_review')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const { applications: data } = await adminService.getApplications(
        accessToken,
        statusFilter || undefined
      )
      setApplications(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [accessToken, statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const review = async (
    id: string,
    status: 'complimentary' | 'discount' | 'declined'
  ) => {
    try {
      setActionLoading(id)
      await adminService.reviewApplication(accessToken, id, status)
      setSnackbar(`Marked as ${applicationStatusLabel(status)}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <Box>
      <AdminTabHeader
        title="Discount applications"
        subtitle="Review church and charity requests for complimentary use or 10% off."
      />

      <FormControl size="small" sx={{ mb: 2, minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="in_review">In review</MenuItem>
          <MenuItem value="complimentary">Complimentary</MenuItem>
          <MenuItem value="discount">10% off</MenuItem>
          <MenuItem value="declined">Declined</MenuItem>
          <MenuItem value="">All</MenuItem>
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
          No applications in this filter.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {applications.map((app) => (
            <AdminDataCard key={app.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="sectionHeader" sx={{ mb: 0.5, fontSize: '1.05rem' }}>
                    {app.organizationName}
                  </Typography>
                  <Typography variant="captionText" sx={{ color: 'text.secondary' }}>
                    {app.organizationType} · {app.city} · {app.role}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={applicationStatusLabel(app.status)}
                  color={app.status === 'in_review' ? 'warning' : 'default'}
                />
              </Box>

              <Typography variant="bodyText" sx={{ color: 'text.secondary', mt: 1 }}>
                {app.userName} ({app.userEmail})
              </Typography>
              {app.website && (
                <Typography variant="captionText" sx={{ display: 'block', mt: 0.5 }}>
                  <a href={app.website} target="_blank" rel="noreferrer">
                    {app.website}
                  </a>
                </Typography>
              )}

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="captionText" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                {app.organizationType === 'church' ? 'Statement of faith' : 'Description'}
              </Typography>
              <Typography
                variant="bodyText"
                sx={{
                  whiteSpace: 'pre-wrap',
                  maxHeight: isMobile ? 160 : 240,
                  overflow: 'auto',
                }}
              >
                {app.statementOrDescription}
              </Typography>

              {app.status === 'in_review' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={actionLoading === app.id}
                    onClick={() => review(app.id, 'complimentary')}
                  >
                    Complimentary
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={actionLoading === app.id}
                    onClick={() => review(app.id, 'discount')}
                  >
                    10% off
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    disabled={actionLoading === app.id}
                    onClick={() => review(app.id, 'declined')}
                  >
                    No discount
                  </Button>
                </Stack>
              )}
            </AdminDataCard>
          ))}
        </Stack>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  )
}

export default AdminApplicationsTab

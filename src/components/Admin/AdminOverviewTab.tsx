import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Alert } from '@mui/material'
import Typography from '../UI/Typography'
import { adminService, AdminStats, formatUsageMinutes } from '../../services/adminService'
import { AdminMetricRow, AdminTabHeader } from './adminShared'

interface AdminOverviewTabProps {
  accessToken: string
}

const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ accessToken }) => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await adminService.getStats(accessToken)
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [load])

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (error && !stats) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!stats) return null

  return (
    <Box>
      <AdminTabHeader
        title="Overview"
        subtitle="Refreshes every 15 seconds"
        onRefresh={load}
        refreshLabel="Refresh stats"
      />

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{
        borderRadius: '0.75rem',
        border: '1px solid rgba(155, 181, 209, 0.15)',
        backgroundColor: 'rgba(44, 62, 80, 0.35)',
        px: { xs: 1.5, md: 2 },
      }}>
        <AdminMetricRow label="Total users" value={stats.totalUsers} />
        <AdminMetricRow label="Active users" value={stats.activeUsers} />
        <AdminMetricRow label="Total usage" value={formatUsageMinutes(stats.totalUsageMinutes)} />
        <AdminMetricRow label="Live connections" value={stats.liveConnectionCount} />
        <AdminMetricRow label="Streaming now" value={stats.streamingCount} />
        <AdminMetricRow label="Session groups" value={stats.activeSessionGroups} divider={false} />
      </Box>

      <Typography
        variant="bodyText"
        sx={{
          display: 'block',
          mt: 2,
          fontSize: '0.75rem',
          color: 'text.secondary',
          opacity: 0.65,
          fontStyle: 'normal',
        }}
      >
        Live connection counts are from this server instance.
      </Typography>
    </Box>
  )
}

export default AdminOverviewTab

import React from 'react'
import { Box, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import Typography from '../UI/Typography'

export function useAdminMobile() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}

interface AdminMetricRowProps {
  label: string
  value: string | number
  hint?: string
  divider?: boolean
}

/** Single muted metric row — matches Scribe profile tone, not neon dashboard cards. */
export const AdminMetricRow: React.FC<AdminMetricRowProps> = ({
  label,
  value,
  hint,
  divider = true,
}) => (
  <>
    <Box sx={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 2,
      py: 1.75,
      px: { xs: 0.25, md: 0.5 },
    }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="bodyText"
          sx={{ mb: 0, fontSize: '0.9rem', color: 'text.secondary', fontStyle: 'normal' }}
        >
          {label}
        </Typography>
        {hint && (
          <Typography
            variant="bodyText"
            sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary', opacity: 0.7, fontStyle: 'normal' }}
          >
            {hint}
          </Typography>
        )}
      </Box>
      <Typography
        variant="sectionHeader"
        sx={{
          mb: 0,
          fontSize: { xs: '1.25rem', md: '1.35rem' },
          fontWeight: 600,
          color: 'primary.main',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Box>
    {divider && <Divider sx={{ borderColor: 'rgba(236, 240, 241, 0.08)' }} />}
  </>
)

interface AdminTabHeaderProps {
  title?: string
  subtitle?: string
  onRefresh?: () => void
  refreshLabel?: string
}

export const AdminTabHeader: React.FC<AdminTabHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  refreshLabel = 'Refresh',
}) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 1,
    mb: 1.5,
  }}>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      {title && (
        <Typography
          variant="subsectionHeader"
          sx={{ mb: subtitle ? 0.25 : 0, fontSize: '1rem', fontStyle: 'normal' }}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant="bodyText"
          sx={{ color: 'text.secondary', display: 'block', fontSize: '0.8rem', opacity: 0.75, fontStyle: 'normal' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
    {onRefresh && (
      <IconButton onClick={onRefresh} aria-label={refreshLabel} size="small" sx={{ flexShrink: 0, mt: -0.5 }}>
        <RefreshIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
)

interface AdminDataCardProps {
  children: React.ReactNode
}

export const AdminDataCard: React.FC<AdminDataCardProps> = ({ children }) => (
  <Box
    sx={{
      mb: 1.25,
      p: { xs: 1.5, md: 2 },
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(44, 62, 80, 0.45)',
      border: '1px solid rgba(155, 181, 209, 0.15)',
      '&:last-child': { mb: 0 },
    }}
  >
    {children}
  </Box>
)

export const adminFieldRowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
} as const

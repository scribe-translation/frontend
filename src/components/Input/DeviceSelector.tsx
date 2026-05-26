import React, { useEffect, useState } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip
} from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import RefreshIcon from '@mui/icons-material/Refresh'
import Typography from '../UI/Typography'

interface AudioDevice {
  deviceId: string
  label: string
  kind: string
}

interface DeviceSelectorProps {
  selectedDeviceId: string | null
  onDeviceChange: (deviceId: string) => void
  disabled?: boolean
  micAccessResetKey?: number
}

const PLACEHOLDER_DEVICE: AudioDevice = {
  deviceId: '',
  label: 'Microphone access required — tap Refresh',
  kind: 'audioinput',
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  selectedDeviceId,
  onDeviceChange,
  disabled = false,
  micAccessResetKey = 0,
}) => {
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasDeviceAccess, setHasDeviceAccess] = useState(false)

  useEffect(() => {
    setHasDeviceAccess(false)
    setDevices([])
  }, [micAccessResetKey])

  const getAudioDevices = async () => {
    setIsLoading(true)
    let probeStream: MediaStream | null = null
    try {
      probeStream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = deviceList
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
        }))
        .filter((device) => device.deviceId.length > 0)

      if (audioInputs.length === 0) {
        setDevices([])
        setHasDeviceAccess(false)
        return
      }

      setDevices(audioInputs)
      setHasDeviceAccess(true)

      if (audioInputs.length > 0 && !selectedDeviceId) {
        onDeviceChange(audioInputs[0].deviceId)
      }
    } catch (error) {
      console.error('Error accessing audio devices:', error)
      setDevices([])
      setHasDeviceAccess(false)
    } finally {
      probeStream?.getTracks().forEach((t) => t.stop())
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    getAudioDevices()
  }

  const handleDeviceChange = (event: { target: { value: string } }) => {
    const deviceId = event.target.value
    if (deviceId) {
      onDeviceChange(deviceId)
    }
  }

  const displayDevices =
    hasDeviceAccess && devices.length > 0 ? devices : [PLACEHOLDER_DEVICE]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <FormControl
        fullWidth
        size="small"
        disabled={disabled || isLoading || !hasDeviceAccess}
      >
        <InputLabel id="device-selector-label">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MicIcon sx={{ fontSize: 16 }} />
            <Typography variant="bodyText" sx={{ fontSize: '0.875rem' }}>
              Microphone
            </Typography>
          </Box>
        </InputLabel>
        <Select
          labelId="device-selector-label"
          value={selectedDeviceId || ''}
          onChange={handleDeviceChange}
          label="Microphone"
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            },
          }}
        >
          {displayDevices.map((device) => (
            <MenuItem
              key={device.deviceId || 'placeholder'}
              value={device.deviceId}
              disabled={!device.deviceId}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <MicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="bodyText" sx={{ fontSize: '0.875rem' }}>
                  {device.label}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title="Refresh devices (requests microphone access)" arrow placement="top">
        <IconButton
          onClick={handleRefresh}
          disabled={disabled || isLoading}
          size="small"
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(210, 180, 140, 0.1)',
            },
          }}
        >
          <RefreshIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default DeviceSelector

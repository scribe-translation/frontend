import React, { useEffect, useRef, useState } from 'react'
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import RefreshIcon from '@mui/icons-material/Refresh'
import Typography from '../UI/Typography'
import {
  DISPLAY_MEDIA_AUDIO_DEVICE_ID,
  DISPLAY_MEDIA_DEVICE_LABEL,
  isDisplayMediaCaptureSupported,
} from '../../utils/audioInputDevices'
import { findMatchingDevice, type SavedInputDevice } from '../../utils/inputDevicePrefs'

interface AudioDevice {
  deviceId: string
  label: string
  kind: string
  isDisplayMedia?: boolean
}

interface DeviceSelectorProps {
  selectedDeviceId: string | null
  savedDevice: SavedInputDevice | null
  onDeviceChange: (deviceId: string, label: string) => void
  onDeviceResolved: (deviceId: string) => void
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
  savedDevice,
  onDeviceChange,
  onDeviceResolved,
  disabled = false,
  micAccessResetKey = 0,
}) => {
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasDeviceAccess, setHasDeviceAccess] = useState(false)
  const savedDeviceRef = useRef(savedDevice)

  const displayMediaSupported = isDisplayMediaCaptureSupported()

  useEffect(() => {
    savedDeviceRef.current = savedDevice
  }, [savedDevice])

  useEffect(() => {
    setHasDeviceAccess(false)
    setDevices([])
  }, [micAccessResetKey])

  const resolveDeviceSelection = (allDevices: AudioDevice[]) => {
    const matched = findMatchingDevice(allDevices, savedDeviceRef.current)

    if (matched) {
      onDeviceResolved(matched.deviceId)
      return
    }

    if (allDevices.length > 0) {
      onDeviceResolved(allDevices[0].deviceId)
    }
  }

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

      const allDevices: AudioDevice[] = []

      if (displayMediaSupported) {
        allDevices.push({
          deviceId: DISPLAY_MEDIA_AUDIO_DEVICE_ID,
          label: DISPLAY_MEDIA_DEVICE_LABEL,
          kind: 'audioinput',
          isDisplayMedia: true,
        })
      }

      allDevices.push(...audioInputs)

      if (allDevices.length === 0) {
        setDevices([])
        setHasDeviceAccess(false)
        return
      }

      setDevices(allDevices)
      setHasDeviceAccess(true)
      resolveDeviceSelection(allDevices)
    } catch (error) {
      console.error('Error accessing audio devices:', error)

      if (displayMediaSupported) {
        const displayOnly: AudioDevice[] = [{
          deviceId: DISPLAY_MEDIA_AUDIO_DEVICE_ID,
          label: DISPLAY_MEDIA_DEVICE_LABEL,
          kind: 'audioinput',
          isDisplayMedia: true,
        }]
        setDevices(displayOnly)
        setHasDeviceAccess(true)
        resolveDeviceSelection(displayOnly)
      } else {
        setDevices([])
        setHasDeviceAccess(false)
      }
    } finally {
      probeStream?.getTracks().forEach((t) => t.stop())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAudioDevices()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load on mount and micAccessResetKey
  }, [micAccessResetKey])

  const handleRefresh = () => {
    getAudioDevices()
  }

  const handleSelectChange = (event: { target: { value: string } }) => {
    const deviceId = event.target.value
    if (!deviceId) {
      return
    }
    const device = devices.find((d) => d.deviceId === deviceId)
    const label = device?.label ?? deviceId
    onDeviceChange(deviceId, label)
  }

  const displayDevices =
    hasDeviceAccess && devices.length > 0 ? devices : [PLACEHOLDER_DEVICE]

  const inputLabel = displayMediaSupported ? 'Audio Input' : 'Microphone'

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
              {inputLabel}
            </Typography>
          </Box>
        </InputLabel>
        <Select
          labelId="device-selector-label"
          value={selectedDeviceId || ''}
          onChange={handleSelectChange}
          label={inputLabel}
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
                {device.isDisplayMedia ? (
                  <VolumeUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                ) : (
                  <MicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                )}
                <Typography variant="bodyText" sx={{ fontSize: '0.875rem' }}>
                  {device.label}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip
        title={
          displayMediaSupported
            ? 'Refresh microphones. Tab / System Audio uses screen-share to capture speaker output.'
            : 'Refresh devices (requests microphone access)'
        }
        arrow
        placement="top"
      >
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

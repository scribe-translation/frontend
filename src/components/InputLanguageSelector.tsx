import React, { useState } from 'react'
import { GoogleSTTLanguageCode, getAllSTTLanguages } from '../enums/googleSTTLangs'
import { MenuItem, Select, Box, Typography } from '@mui/material'
import { createHybridFlagElement } from '../utils/flagEmojiUtils.tsx'

interface InputLanguageSelectorProps {
  label: string
  selectedLanguage: GoogleSTTLanguageCode
  onLanguageChange: (language: GoogleSTTLanguageCode) => void
  compact?: boolean
}

const InputLanguageSelector: React.FC<InputLanguageSelectorProps> = ({
  label,
  selectedLanguage,
  onLanguageChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageSelect = (language: GoogleSTTLanguageCode) => {
    onLanguageChange(language)
    setIsOpen(false)
  }

  return (
    <Select
      value={selectedLanguage}
      onChange={(e) => handleLanguageSelect(e.target.value as GoogleSTTLanguageCode)}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      label={compact ? undefined : label}
      renderValue={(selected) => {
        const language = getAllSTTLanguages().find(lang => lang.code === selected);
        if (!language) return null;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', width: '100%' }}>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {createHybridFlagElement(language.code, compact ? 16 : 18)}
            </Box>
            <Typography 
              noWrap 
              sx={{ 
                fontSize: compact ? '11px' : 'inherit', 
                fontWeight: compact ? 600 : 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
                color: 'inherit'
              }}
            >
              {language.name}
            </Typography>
          </Box>
        );
      }}
      sx={{ 
        width: '100%',
        maxWidth: compact ? '100%' : '300px',
        minWidth: compact ? '0' : '200px',
        height: compact ? '48px' : 'auto',
        backgroundColor: compact ? '#435A73' : 'inherit',
        color: compact ? '#D7E4F2' : 'inherit',
        borderRadius: compact ? '14px' : '1rem',
        '& .MuiOutlinedInput-notchedOutline': {
          border: compact ? 'none' : undefined,
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: compact ? '14px' : '1rem',
          fontSize: compact ? '12px' : '1.1rem',
          fontWeight: compact ? 600 : 'normal',
        },
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: compact ? '0 10px' : undefined,
          overflow: 'hidden',
        },
        '& .MuiSvgIcon-root': {
          color: compact ? '#BFD0E0' : 'inherit',
          marginLeft: compact ? '-4px' : undefined,
        }
      }}
    >
      {getAllSTTLanguages().map((language) => (
        <MenuItem key={language.code} value={language.code} sx={{ fontSize: compact ? '12px' : '1rem' }}>
          <span style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>{createHybridFlagElement(language.code, compact ? 16 : 18)}</span>
          {language.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default InputLanguageSelector

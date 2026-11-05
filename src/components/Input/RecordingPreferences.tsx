import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface RecordingPrefs {
  storeText: boolean;
  generateSummary: boolean;
}

interface RecordingPreferencesProps {
  recordingPrefs: RecordingPrefs;
  setRecordingPrefs: (prefs: RecordingPrefs) => void;
  alwaysExpanded?: boolean;
  defaultExpanded?: boolean;
}

const RecordingPreferences: React.FC<RecordingPreferencesProps> = ({
  recordingPrefs,
  setRecordingPrefs,
  alwaysExpanded = false,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showContent = alwaysExpanded || expanded;

  const summaryBits: string[] = [];
  if (recordingPrefs.storeText) summaryBits.push('Store text');
  if (recordingPrefs.generateSummary) summaryBits.push('Summary');
  const summary = summaryBits.length > 0 ? summaryBits.join(' · ') : 'Off';

  const checkboxes = (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={recordingPrefs.storeText}
            onChange={(e) => setRecordingPrefs({ ...recordingPrefs, storeText: e.target.checked })}
          />
        }
        label={<Typography variant="bodyText" sx={{ fontSize: '0.85rem' }}>Store Text</Typography>}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={recordingPrefs.generateSummary}
            disabled={!recordingPrefs.storeText}
            onChange={(e) => setRecordingPrefs({ ...recordingPrefs, generateSummary: e.target.checked })}
          />
        }
        label={<Typography variant="bodyText" sx={{ fontSize: '0.85rem' }}>Generate Summary</Typography>}
      />
    </FormGroup>
  );

  if (alwaysExpanded) {
    return (
      <Box sx={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
        <Typography variant="subsectionHeader" sx={{ marginBottom: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
          Recording Preferences
        </Typography>
        {checkboxes}
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          cursor: 'pointer',
          gap: '0.75rem',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subsectionHeader" sx={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Recording Preferences
          </Typography>
          {!expanded && (
            <Typography variant="captionText" sx={{ display: 'block', fontSize: '0.75rem', opacity: 0.65, mt: 0.25 }}>
              {summary}
            </Typography>
          )}
        </Box>
        <ExpandMoreIcon
          sx={{
            opacity: 0.7,
            flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>
      <Collapse in={showContent}>
        <Box sx={{ padding: '0 1rem 1rem' }}>{checkboxes}</Box>
      </Collapse>
    </Box>
  );
};

export default RecordingPreferences;

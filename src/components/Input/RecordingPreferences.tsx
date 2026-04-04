import React from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export interface RecordingPrefs {
  storeText: boolean;
  generateSummary: boolean;
  generateFacebookPost: boolean;
}

interface RecordingPreferencesProps {
  recordingPrefs: RecordingPrefs;
  setRecordingPrefs: (prefs: RecordingPrefs) => void;
}

const RecordingPreferences: React.FC<RecordingPreferencesProps> = ({ recordingPrefs, setRecordingPrefs }) => {
  return (
    <Box sx={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
      <Typography variant="subsectionHeader" sx={{ marginBottom: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
        Recording Preferences
      </Typography>
      <FormGroup>
        <FormControlLabel 
          control={
            <Checkbox 
              size="small" 
              checked={recordingPrefs.storeText} 
              onChange={(e) => setRecordingPrefs({...recordingPrefs, storeText: e.target.checked})}
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
              onChange={(e) => setRecordingPrefs({...recordingPrefs, generateSummary: e.target.checked})}
            />
          } 
          label={<Typography variant="bodyText" sx={{ fontSize: '0.85rem' }}>Generate Summary</Typography>}
        />
        <FormControlLabel 
          control={
            <Checkbox 
              size="small" 
              checked={recordingPrefs.generateFacebookPost} 
              disabled={!recordingPrefs.storeText}
              onChange={(e) => setRecordingPrefs({...recordingPrefs, generateFacebookPost: e.target.checked})}
            />
          } 
          label={<Typography variant="bodyText" sx={{ fontSize: '0.85rem' }}>FB Post Draft</Typography>}
        />
      </FormGroup>
    </Box>
  );
};

export default RecordingPreferences;

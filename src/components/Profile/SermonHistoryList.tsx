import React, { useState, useEffect } from 'react'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material'
import { jsPDF } from 'jspdf'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Typography from '../UI/Typography'
import { useAuth } from '../../contexts/AuthContext'
import { CONFIG } from '../../config/urls'

interface Sermon {
  id: string
  fullText: string
  summary?: string
  facebookPost?: string
  sourceLanguage: string
  createdAt: string
}

const Subsection = ({ title, content, icon, defaultExpanded = false }: { title: string, content?: string, icon?: React.ReactNode, defaultExpanded?: boolean }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  if (!content) return null
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
  }

  return (
    <Box sx={{ marginBottom: '1.5rem' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon}
          <Typography variant="subsectionHeader" sx={{ marginBottom: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </Box>
        <Tooltip title={`Copy ${title}`}>
          <IconButton size="small" onClick={handleCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ 
          marginTop: '0.5rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '0.5rem',
          borderLeft: '3px solid rgba(155, 181, 209, 0.5)'
        }}>
          <Typography variant="bodyText" sx={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
            {content}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  )
}

const SermonHistoryList: React.FC = () => {
  const { tokens, isLoading: authLoading } = useAuth()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Snackbar feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  useEffect(() => {
    const fetchSermons = async () => {
      if (authLoading || !tokens?.accessToken) return
      
      try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/api/sermons`, {
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch history')
        
        const data = await response.json()
        setSermons(data.sermons || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [tokens?.accessToken, authLoading])

  const handleDelete = async () => {
    if (!deleteId || !tokens?.accessToken) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/sermons/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete session')
      }
      
      setSermons(sermons.filter(s => s.id !== deleteId))
      setSnackbar({ open: true, message: 'Session deleted successfully', severity: 'success' })
    } catch (err) {
      setSnackbar({ open: true, message: err instanceof Error ? err.message : 'Failed to delete session', severity: 'error' })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleDownloadPDF = (sermon: Sermon) => {
    try {
      const doc = new jsPDF()
      const dateStr = new Date(sermon.createdAt).toLocaleDateString(undefined, { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      // Document Header
      doc.setFontSize(22)
      doc.setTextColor(46, 69, 94) // Match app theme color
      doc.text('Scribe Recording Session', 20, 20)
      
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Date: ${dateStr}`, 20, 30)
      doc.text(`Session ID: ${sermon.id.toUpperCase()}`, 20, 37)
      
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 45, 190, 45)
      
      let cursorY = 55
      
      // Helper to add text block
      const addSection = (title: string, text: string) => {
        if (!text) return
        
        // Ensure title fits on the current page
        if (cursorY > 270) {
          doc.addPage()
          cursorY = 20
        }
        
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(46, 69, 94)
        doc.text(title, 20, cursorY)
        cursorY += 10
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        
        const splitText = doc.splitTextToSize(text, 170)
        
        for (let i = 0; i < splitText.length; i++) {
          if (cursorY > 280) {
            doc.addPage()
            cursorY = 20
          }
          doc.text(splitText[i], 20, cursorY)
          cursorY += 6
        }
        cursorY += 9 // Extra padding after section
      }
      
      addSection('SUMMARY', sermon.summary || 'No summary generated')
      addSection('FACEBOOK POST DRAFT', sermon.facebookPost || 'No FB post generated')
      addSection('FULL TRANSCRIPTION', sermon.fullText)
      
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Generated by Scribe', 190, 290, { align: 'right' });
      }
      
      doc.save(`scribe-session-${sermon.id.slice(-4)}.pdf`)
      setSnackbar({ open: true, message: 'PDF generated successfully', severity: 'success' })
    } catch (err) {
      console.error('PDF Generation Error:', err)
      setSnackbar({ open: true, message: 'Failed to generate PDF', severity: 'error' })
    }
  }

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: '2rem', color: 'error.main' }}>
        <Typography variant="bodyText">{error}</Typography>
      </Box>
    )
  }

  if (sermons.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
        <Typography variant="bodyText">No sessions recorded yet.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sermons.map((sermon) => (
        <Accordion 
          key={sermon.id}
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: '1rem !important',
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
              <Typography variant="bodyText" sx={{ fontWeight: '600', minWidth: '100px', opacity: 0.7 }}>
                {new Date(sermon.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
              </Typography>
              <Typography variant="bodyText" sx={{ fontWeight: '500', flex: 1 }}>
                Session {sermon.id.slice(-4).toUpperCase()}
              </Typography>
              <Chip 
                label={sermon.sourceLanguage.toUpperCase()} 
                size="small" 
                sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold', fontSize: '0.7rem' }} 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingTop: 0 }}>
            <Divider sx={{ marginBottom: '1.5rem', opacity: 0.1 }} />
            
            <Subsection title="Summary" content={sermon.summary} defaultExpanded={true} />
            <Subsection title="Facebook Post" content={sermon.facebookPost} />
            <Subsection title="Full Transcription Text" content={sermon.fullText} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button 
                size="small" 
                startIcon={<DeleteIcon />} 
                color="error" 
                sx={{ opacity: 0.8 }}
                onClick={() => setDeleteId(sermon.id)}
              >
                Delete
              </Button>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<DownloadIcon />} 
                sx={{ borderRadius: '0.5rem' }}
                onClick={() => handleDownloadPDF(sermon)}
              >
                Download PDF
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        PaperProps={{
          sx: { borderRadius: '1.5rem', padding: '1rem' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recording session? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem' }}>
          <Button onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained" 
            disabled={isDeleting}
            sx={{ borderRadius: '2rem', px: 3 }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '1rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SermonHistoryList

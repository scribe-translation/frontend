import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { CONFIG } from '../../config/urls';

interface EmailForgotPasswordFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailForgotPasswordForm: React.FC<EmailForgotPasswordFormProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(0);
      setEmail('');
      setToken('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [open]);

  // Check for token in URL when component mounts
  useEffect(() => {
    if (open) {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      if (tokenParam) {
        setToken(tokenParam);
        setStep(2); // Skip to password reset step
        verifyToken(tokenParam);
      }
    }
  }, [open]);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/verify-reset-token?token=${tokenToVerify}`);
      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }
      setSuccess('Token verified. You can now reset your password.');
    } catch (error) {
      setError('Invalid or expired reset token. Please request a new one.');
      setStep(0);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/forgot-password-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send reset email');
      }

      setSuccess('Password reset email sent! Check your inbox and click the link to continue.');
      setStep(1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/reset-password-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! You can now log in with your new password.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Enter Email', 'Check Email', 'Reset Password'];

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a password reset link.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send Reset Email'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Check Your Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the link in the email to continue with resetting your password.
              The link will expire in 1 hour.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setStep(0);
                setEmail('');
                setSuccess('');
              }}
            >
              Use Different Email
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handlePasswordReset} sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your new password below.
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Reset Password
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailForgotPasswordForm;

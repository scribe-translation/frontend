import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  VpnKey,
} from '@mui/icons-material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../../config/urls';
import CustomTypography from '../UI/Typography';

const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  gap: 3rem;
`

const ResetCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 3rem;
  border-radius: 2rem;
  max-width: 95%;
  width: 30rem;
  margin: 2rem 0;
  gap: 2.5rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 2rem !important;
`

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 1rem;
  }
`

const ResetButton = styled(Button)`
  padding: 1rem 3rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: none;
  min-width: 200px;
  margin-top: 1rem;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
`

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check for token in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else {
      setError('No reset token provided. Please use the link from your email.');
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/verify-reset-token?token=${tokenToVerify}`);
      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }
      setIsTokenValid(true);
      setSuccess('Token verified. You can now reset your password.');
    } catch (error) {
      setError('Invalid or expired reset token. Please request a new one.');
      setIsTokenValid(false);
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
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  if (!isTokenValid && !error) {
    return (
      <ResetContainer>
        <LoadingContainer>
          <CircularProgress size={60} />
          <CustomTypography variant="bodyText" sx={{ color: 'text.secondary' }}>
            Verifying reset token...
          </CustomTypography>
        </LoadingContainer>
      </ResetContainer>
    );
  }

  return (
    <ResetContainer>
      <ResetCard elevation={3}>
        <Box sx={{ height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
          <img
            src="/scribe-logo-name-transparent.png"
            alt="Scribe"
            style={{ height: '100%', width: 'auto' }}
          />
        </Box>

        <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
          Reset Password
        </CustomTypography>

        <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Enter your new password below
        </CustomTypography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: '1rem', width: '100%' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ borderRadius: '1rem', width: '100%' }}>
            {success}
          </Alert>
        )}

        {isTokenValid && (
          <FormContainer onSubmit={handlePasswordReset}>
            <StyledTextField
              name="newPassword"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '1rem',
                },
              }}
            />

            <StyledTextField
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '1rem',
                },
              }}
            />

            <ResetButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </ResetButton>
          </FormContainer>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Back to Login
          </Link>
        </Box>
      </ResetCard>
    </ResetContainer>
  );
};

export default ResetPasswordPage;

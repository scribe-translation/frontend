import React, { useState, useEffect } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  Link,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  Security,
  ArrowBack,
  CheckCircle,
  Smartphone,
} from '@mui/icons-material'
import styled from 'styled-components'
import CustomTypography from '../UI/Typography'
import { CONFIG } from '../../config/urls'
import { hashPassword } from '../../utils/passwordHash'

const TOTPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const TOTPCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem;
  border-radius: 2rem;
  max-width: 95%;
  width: 30rem;
  max-height: 90%;
  gap: 1rem;
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

const ActionButton = styled(Button)`
  padding: 1rem 3rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: none;
  min-width: 200px;
  margin-top: 1rem;
`

const BackContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`

const QRCodeContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px dashed #ccc;
  border-radius: 1rem;
  margin: 1rem 0;
`

interface TOTPForgotPasswordFormProps {
  onBackToLogin: () => void
}

const TOTPForgotPasswordForm: React.FC<TOTPForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const steps = ['Enter Email', 'Verify Code', 'Reset Password']

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/forgot-password-totp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initiate password reset')
      }

      // TOTP verification initiated successfully
      setActiveStep(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate password reset')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/verify-totp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, totpCode }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid verification code')
      }

      setIsVerified(true)
      setActiveStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/auth/reset-password-totp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          totpCode,
          password: newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reset password')
      }

      setActiveStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'totpCode') setTotpCode(value.replace(/\D/g, '').slice(0, 6))
    if (name === 'newPassword') setNewPassword(value)
    if (name === 'confirmPassword') setConfirmPassword(value)
    if (error) setError(null)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormContainer onSubmit={handleEmailSubmit}>
            <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
              Reset Password with Authenticator
            </CustomTypography>

            <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Enter your email address to begin the secure password reset process using your authenticator app.
            </CustomTypography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '1rem' }}>
                {error}
              </Alert>
            )}

            <StyledTextField
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter your email address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <ActionButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!email.trim() || !email.includes('@') || isLoading}
              startIcon={<Smartphone />}
            >
              {isLoading ? 'Starting...' : 'Start Reset Process'}
            </ActionButton>
          </FormContainer>
        )

      case 1:
        return (
          <FormContainer onSubmit={handleTOTPVerify}>
            <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
              Verify Authenticator Code
            </CustomTypography>

            <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Enter the 6-digit code from your authenticator app to verify your identity.
            </CustomTypography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '1rem' }}>
                {error}
              </Alert>
            )}

            <StyledTextField
              name="totpCode"
              label="6-Digit Code"
              value={totpCode}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              placeholder="000000"
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <ActionButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={totpCode.length !== 6 || isLoading}
              startIcon={<CheckCircle />}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </ActionButton>
          </FormContainer>
        )

      case 2:
        return (
          <FormContainer onSubmit={handlePasswordReset}>
            <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
              Set New Password
            </CustomTypography>

            <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Enter your new password below.
            </CustomTypography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '1rem' }}>
                {error}
              </Alert>
            )}

            <StyledTextField
              name="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter new password"
            />

            <StyledTextField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              placeholder="Confirm new password"
            />

            <ActionButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
              startIcon={<CheckCircle />}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </ActionButton>
          </FormContainer>
        )

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', marginBottom: '1rem' }} />
            <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Password Reset Successfully!
            </CustomTypography>

            <CustomTypography variant="bodyText" sx={{ color: 'text.secondary', marginBottom: '2rem' }}>
              Your password has been successfully reset. You can now sign in with your new password.
            </CustomTypography>

            <ActionButton
              variant="contained"
              color="primary"
              onClick={onBackToLogin}
              sx={{ marginTop: '1rem' }}
            >
              Back to Sign In
            </ActionButton>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <TOTPContainer>
      <TOTPCard elevation={3}>
        <Box sx={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/scribe-logo-name-transparent.png"
            alt="Scribe"
            style={{ height: '100%', width: 'auto' }}
          />
        </Box>

        <Box sx={{ width: '100%', marginBottom: '2rem' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStepContent()}

        {activeStep < 3 && (
          <BackContainer>
            <Link
              component="button"
              variant="body1"
              onClick={onBackToLogin}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: '500',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <ArrowBack sx={{ marginRight: '0.5rem' }} />
              Back to Sign In
            </Link>
          </BackContainer>
        )}
      </TOTPCard>
    </TOTPContainer>
  )
}

export default TOTPForgotPasswordForm

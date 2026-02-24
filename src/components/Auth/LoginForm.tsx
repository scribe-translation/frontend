import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import CustomTypography from '../UI/Typography'
import EmailForgotPasswordForm from './EmailForgotPasswordForm'

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  gap: 3rem;
`

const LoginCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem;
  border-radius: 2rem;
  max-width: 95%;
  width: 30rem;
  margin: 2rem 0;
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

const LoginButton = styled(Button)`
  padding: 1rem 3rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: none;
  min-width: 200px;
  margin-top: 1rem;
`

const SwitchAuthContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`

interface LoginFormProps {
  onSwitchToRegister: () => void
  onTOTPForgotPassword: () => void
  onEmailForgotPassword: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onTOTPForgotPassword, onEmailForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData.email, formData.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const isFormValid = formData.email.trim() && formData.password.trim()

  return (
    <LoginContainer>
      <LoginCard elevation={3}>
        <Box sx={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/scribe-logo-name-transparent.png"
            alt="Scribe"
            style={{ height: '100%', width: 'auto' }}
          />
        </Box>

        <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
          Welcome Back
        </CustomTypography>

        <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Sign in to continue with real-time translation
        </CustomTypography>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: '1rem' }}>
              {error}
            </Alert>
          )}

          <StyledTextField
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
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
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            required
            fullWidth
            variant="outlined"
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '-0.5rem' }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onEmailForgotPassword}
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
              Reset via Email
            </Link>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onTOTPForgotPassword}
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
              Reset via Authenticator
            </Link>
          </Box>

          <LoginButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid || isLoading}
            startIcon={<LoginIcon />}
            sx={{
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
        </FormContainer>

        <SwitchAuthContainer>
          <CustomTypography variant="bodyText" sx={{ color: 'text.secondary' }}>
            Don't have an account?
          </CustomTypography>
          <Link
            component="button"
            variant="body1"
            onClick={onSwitchToRegister}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Create an account
          </Link>
        </SwitchAuthContainer>
      </LoginCard>
    </LoginContainer>
  )
}

export default LoginForm

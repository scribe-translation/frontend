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
  Person,
  PersonAdd,
} from '@mui/icons-material'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import CustomTypography from '../UI/Typography'

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  padding: 2rem;
  gap: 3rem;
`

const RegisterCard = styled(Paper)`
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

const RegisterButton = styled(Button)`
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

const PasswordRequirements = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  text-align: left;
`

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) {
      errors.push('At least 8 characters')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter')
    }
    if (!/\d/.test(password)) {
      errors.push('One number')
    }
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`)
      setIsLoading(false)
      return
    }

    try {
      await register(formData.email, formData.password, formData.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim()

  const passwordErrors = formData.password ? validatePassword(formData.password) : []

  return (
    <RegisterContainer>
      <RegisterCard elevation={3}>
        <Box sx={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
          <img
            src="/scribe-logo-name-transparent.png"
            alt="Scribe"
            style={{ height: '100%', width: 'auto' }}
          />
        </Box>

        <CustomTypography variant="sectionHeader" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
          Create Account
        </CustomTypography>

        <CustomTypography variant="bodyText" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Join Scribe to start real-time translation
        </CustomTypography>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: '1rem' }}>
              {error}
            </Alert>
          )}

          <StyledTextField
            name="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
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

          {formData.password && passwordErrors.length > 0 && (
            <PasswordRequirements>
              <CustomTypography variant="captionText" sx={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                Password must contain:
              </CustomTypography>
              {passwordErrors.map((error, index) => (
                <CustomTypography key={index} variant="captionText" sx={{ fontSize: '0.75rem' }}>
                  • {error}
                </CustomTypography>
              ))}
            </PasswordRequirements>
          )}

          <StyledTextField
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
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

          <RegisterButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid || isLoading}
            startIcon={<PersonAdd />}
            sx={{
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </RegisterButton>
        </FormContainer>

        <SwitchAuthContainer>
          <CustomTypography variant="bodyText" sx={{ color: 'text.secondary' }}>
            Already have an account?
          </CustomTypography>
          <Link
            component="button"
            variant="body1"
            onClick={onSwitchToLogin}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign in instead
          </Link>
        </SwitchAuthContainer>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default RegisterForm

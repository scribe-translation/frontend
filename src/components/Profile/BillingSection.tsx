import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Typography from '../UI/Typography'
import { useAuth } from '../../contexts/AuthContext'
import {
  applicationStatusLabel,
  billingService,
  BillingCurrency,
  BundleOffer,
  DiscountApplication,
  formatBalanceHours,
  formatMoney,
  OrganizationType,
} from '../../services/billingService'

const BillingSection: React.FC = () => {
  const { tokens, user } = useAuth()
  const accessToken = tokens?.accessToken

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [balanceSeconds, setBalanceSeconds] = useState(0)
  const [billingTier, setBillingTier] = useState('standard')
  const [currency, setCurrency] = useState<BillingCurrency>('cad')
  const [bundles, setBundles] = useState<BundleOffer[]>([])
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [application, setApplication] = useState<DiscountApplication | null>(null)

  const [orgType, setOrgType] = useState<OrganizationType>('church')
  const [orgName, setOrgName] = useState('')
  const [city, setCity] = useState('')
  const [role, setRole] = useState('')
  const [website, setWebsite] = useState('')
  const [statement, setStatement] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    try {
      setLoading(true)
      setError(null)
      const [balance, bundlesRes, appRes] = await Promise.all([
        billingService.getBalance(accessToken),
        billingService.getBundles(accessToken),
        billingService.getApplication(accessToken),
      ])
      setBalanceSeconds(balance.balanceSeconds)
      setBillingTier(balance.billingTier)
      setCurrency(balance.preferredCurrency)
      setBundles(bundlesRes.bundles)
      setStripeConfigured(bundlesRes.stripeConfigured)
      setApplication(appRes.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const purchase = params.get('purchase')
    if (purchase === 'success') {
      setSubmitMessage('Purchase complete. Hours will appear once payment is confirmed.')
      load()
      window.history.replaceState({}, '', window.location.pathname)
    } else if (purchase === 'cancelled') {
      setSubmitMessage('Checkout was cancelled.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [load])

  const handleCurrencyChange = async (
    _event: React.MouseEvent<HTMLElement>,
    next: BillingCurrency | null
  ) => {
    if (!next || !accessToken || next === currency) return
    try {
      setCurrency(next)
      await billingService.setCurrency(accessToken, next)
      const bundlesRes = await billingService.getBundles(accessToken, next)
      setBundles(bundlesRes.bundles)
      setStripeConfigured(bundlesRes.stripeConfigured)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update currency')
    }
  }

  const handleBuy = async (bundleId: string) => {
    if (!accessToken) return
    try {
      setCheckoutLoading(bundleId)
      setError(null)
      const { url } = await billingService.createCheckout(
        accessToken,
        bundleId,
        currency,
        window.location.origin
      )
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setCheckoutLoading(null)
    }
  }

  const canReapply =
    !application ||
    application.status === 'declined'

  const handleSubmitApplication = async () => {
    if (!accessToken) return
    try {
      setSubmitLoading(true)
      setError(null)
      setSubmitMessage(null)
      const result = await billingService.submitApplication(accessToken, {
        organizationType: orgType,
        organizationName: orgName,
        city,
        role,
        website: website.trim() || undefined,
        statementOrDescription: statement,
      })
      setApplication(result.application)
      setSubmitMessage('Application submitted. We will review it shortly.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (!user || !accessToken) return null

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  const complimentary = billingTier === 'complimentary'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
      <Typography variant="sectionHeader" sx={{ marginBottom: '0.25rem' }}>
        Hours & billing
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {submitMessage && <Alert severity="info" onClose={() => setSubmitMessage(null)}>{submitMessage}</Alert>}

      <Box>
        <Typography variant="bodyText" sx={{ color: 'text.secondary', mb: 0.5 }}>
          <strong>Time remaining:</strong>{' '}
          {complimentary ? 'Unlimited (complimentary)' : formatBalanceHours(balanceSeconds)}
        </Typography>
        {billingTier === 'discount' && (
          <Typography variant="captionText" sx={{ color: 'text.secondary' }}>
            Your account has 10% off hour bundles.
          </Typography>
        )}
      </Box>

      {!complimentary && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="bodyText" sx={{ color: 'text.secondary' }}>
              Currency:
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <ToggleButton value="cad">CAD</ToggleButton>
              <ToggleButton value="usd">USD</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {!stripeConfigured && (
            <Alert severity="warning">
              Payments are not configured yet. Bundle buttons will activate once Stripe keys are set.
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {bundles.map((bundle) => (
              <Box
                key={bundle.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '0.75rem',
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box>
                  <Typography variant="bodyText" sx={{ fontWeight: 600 }}>
                    {bundle.hours} hours
                  </Typography>
                  <Typography variant="captionText" sx={{ color: 'text.secondary' }}>
                    {formatMoney(bundle.amountCents, bundle.currency)}
                    {bundle.discounted && bundle.listAmountCents !== bundle.amountCents && (
                      <> · was {formatMoney(bundle.listAmountCents, bundle.currency)}</>
                    )}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ShoppingCartIcon />}
                  disabled={!stripeConfigured || checkoutLoading !== null}
                  onClick={() => handleBuy(bundle.id)}
                  sx={{ borderRadius: '1rem' }}
                >
                  {checkoutLoading === bundle.id ? 'Opening…' : 'Buy'}
                </Button>
              </Box>
            ))}
          </Box>
        </>
      )}

      <Divider />

      <Typography variant="sectionHeader" sx={{ marginBottom: '0.25rem' }}>
        Church or charity discount
      </Typography>
      <Typography variant="bodyText" sx={{ color: 'text.secondary', mb: 1 }}>
        Churches and charities can apply for complimentary use or a 10% discount. Applications are reviewed manually.
      </Typography>

      {application && (
        <Alert severity={application.status === 'declined' ? 'info' : 'success'} sx={{ mb: 1 }}>
          Status: {applicationStatusLabel(application.status)}
          {application.organizationName ? ` · ${application.organizationName}` : ''}
        </Alert>
      )}

      {canReapply && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControl>
            <RadioGroup
              row
              value={orgType}
              onChange={(e) => setOrgType(e.target.value as OrganizationType)}
            >
              <FormControlLabel value="church" control={<Radio size="small" />} label="Church" />
              <FormControlLabel value="charity" control={<Radio size="small" />} label="Charity" />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Organization name"
            size="small"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
          <TextField
            label="City"
            size="small"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <TextField
            label="Your role"
            size="small"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <TextField
            label="Website"
            size="small"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            helperText="e.g. yourchurch.org — if provided, a statement below is optional."
          />
          <TextField
            label={orgType === 'church' ? 'Statement of faith' : 'Organization description'}
            size="small"
            multiline
            minRows={4}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            required={!website.trim()}
            helperText={
              website.trim()
                ? 'Optional when a website is provided. Used only for review.'
                : 'Required unless you provide a website above (at least 20 characters).'
            }
          />
          <Button
            variant="outlined"
            disabled={
              submitLoading ||
              !orgName.trim() ||
              !city.trim() ||
              !role.trim() ||
              (!website.trim() && statement.trim().length < 20)
            }
            onClick={handleSubmitApplication}
            sx={{ borderRadius: '1rem', alignSelf: 'flex-start' }}
          >
            {submitLoading ? 'Submitting…' : 'Submit application'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default BillingSection

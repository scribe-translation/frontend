import { CONFIG } from '../config/urls'

export type BillingTier = 'standard' | 'complimentary' | 'discount'
export type BillingCurrency = 'cad' | 'usd'
export type ApplicationStatus = 'in_review' | 'complimentary' | 'discount' | 'declined'
export type OrganizationType = 'church' | 'charity'

export interface BalanceInfo {
  balanceSeconds: number
  billingTier: BillingTier
  preferredCurrency: BillingCurrency
  complimentary: boolean
}

export interface BundleOffer {
  id: string
  hours: number
  currency: BillingCurrency
  amountCents: number
  listAmountCents: number
  discounted: boolean
}

export interface BundlesResponse {
  currency: BillingCurrency
  billingTier: BillingTier
  bundles: BundleOffer[]
  stripeConfigured: boolean
}

export interface DiscountApplication {
  id: string
  userId: string
  organizationType: OrganizationType
  organizationName: string
  city: string
  role: string
  website?: string | null
  statementOrDescription: string
  status: ApplicationStatus
  reviewedAt?: string | null
  reviewedBy?: string | null
  createdAt?: string | null
  userEmail?: string | null
  userName?: string | null
}

async function billingFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${CONFIG.BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detailMsg =
      Array.isArray(data.details) && data.details[0]?.msg
        ? data.details[0].msg
        : null
    throw new Error(detailMsg || data.error || `Request failed (${response.status})`)
  }
  return data as T
}

export function formatBalanceHours(seconds: number): string {
  const totalMinutes = Math.max(0, Math.floor(seconds / 60))
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatBalanceHoursMinutes(seconds: number): string {
  const totalMinutes = Math.max(0, Math.floor(seconds / 60))
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

export function formatMoney(cents: number, currency: BillingCurrency): string {
  const amount = cents / 100
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`
  }
}

export function applicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case 'in_review':
      return 'In review'
    case 'complimentary':
      return 'Complimentary'
    case 'discount':
      return '10% off'
    case 'declined':
      return 'No discount'
    default:
      return status
  }
}

export const billingService = {
  getBalance(accessToken: string) {
    return billingFetch<BalanceInfo>('/billing/balance', accessToken)
  },

  getBundles(accessToken: string, currency?: BillingCurrency) {
    const q = currency ? `?currency=${currency}` : ''
    return billingFetch<BundlesResponse>(`/billing/bundles${q}`, accessToken)
  },

  setCurrency(accessToken: string, currency: BillingCurrency) {
    return billingFetch<{ preferredCurrency: BillingCurrency }>('/billing/currency', accessToken, {
      method: 'PATCH',
      body: JSON.stringify({ currency }),
    })
  },

  createCheckout(
    accessToken: string,
    bundleId: string,
    currency: BillingCurrency,
    returnOrigin?: string
  ) {
    return billingFetch<{ url: string; sessionId: string }>('/billing/checkout', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        bundleId,
        currency,
        ...(returnOrigin ? { returnOrigin } : {}),
      }),
    })
  },

  getApplication(accessToken: string) {
    return billingFetch<{ application: DiscountApplication | null }>(
      '/billing/application',
      accessToken
    )
  },

  submitApplication(
    accessToken: string,
    payload: {
      organizationType: OrganizationType
      organizationName: string
      city: string
      role: string
      website?: string
      statementOrDescription: string
    }
  ) {
    return billingFetch<{ message: string; application: DiscountApplication }>(
      '/billing/application',
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },
}

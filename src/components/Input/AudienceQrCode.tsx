import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import logoUrl from '../../logos/scribe-logo-only-transparent.png'

const BACKGROUND = '#2C3E50'
const DOT = '#9BB5D1'

function createAudienceQr(data: string, size: number) {
  const scale = size / 240

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'svg',
    shape: 'square',
    data,
    margin: Math.round(16 * scale),
    image: logoUrl,
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    dotsOptions: {
      type: 'rounded',
      color: DOT,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: DOT,
    },
    cornersDotOptions: {
      type: 'dot',
      color: DOT,
    },
    backgroundOptions: {
      color: BACKGROUND,
      round: 0.16,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.32,
      margin: Math.round(8 * scale),
      crossOrigin: 'anonymous',
    },
  })
}

export function AudienceQrCode({ url, size }: { url: string; size: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const qr = createAudienceQr(url, size)
    container.replaceChildren()
    qr.append(container)

    return () => {
      container.replaceChildren()
    }
  }, [url, size])

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Audience QR code"
      style={{ width: size, height: size, lineHeight: 0 }}
    />
  )
}

export function downloadAudienceQr(url: string) {
  return createAudienceQr(url, 1024).download({
    name: 'scribe-translation-qr',
    extension: 'png',
  })
}

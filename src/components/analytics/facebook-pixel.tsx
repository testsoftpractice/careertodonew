'use client'

import Script from 'next/script'
import { useEffect } from 'react'

// Your Facebook Pixel ID
const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ''

// Initialize Facebook Pixel
export const initializeFacebookPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', FACEBOOK_PIXEL_ID)
    window.fbq('track', 'PageView')
  }
}

// Track custom events
export const trackFacebookEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

// Track custom events
export const trackFacebookCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters)
  }
}

declare global {
  interface Window {
    fbq?: any
  }
}

interface FacebookPixelProps {
  pixelId?: string
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const finalPixelId = pixelId || FACEBOOK_PIXEL_ID

  useEffect(() => {
    // Initialize pixel after component mounts
    if (finalPixelId && typeof window !== 'undefined') {
      // Inject fbq function
      window.fbq = window.fbq || function() {
        (window.fbq!.q = window.fbq!.q || []).push(arguments)
      }
      window.fbq.queue = window.fbq.queue || []

      // Initialize pixel
      window.fbq('init', finalPixelId)
      window.fbq('track', 'PageView')
    }
  }, [finalPixelId])

  if (!finalPixelId) {
    return null
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${finalPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${finalPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

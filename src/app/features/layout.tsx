import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover powerful features of CareerToDo - job simulations, verified credentials, real-time analytics, and comprehensive career development tools.',
  keywords: [
    'CareerToDo Features',
    'Job Simulation Features',
    'Career Platform Features',
    'Verified Credentials',
    'Career Analytics',
    'Interview Preparation Tools',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/features`,
    title: 'Features | CareerToDo',
    description: 'Discover powerful features of CareerToDo - job simulations, verified credentials, real-time analytics.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/features`,
  },
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children
}

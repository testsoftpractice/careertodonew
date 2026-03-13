import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about CareerToDo - the innovative platform that bridges the gap between university and corporate careers through real-world job simulations and verified experience.',
  keywords: [
    'About CareerToDo',
    'CareerToDo Mission',
    'CareerToDo Vision',
    'Job Simulation Platform',
    'Career Development Platform',
    'Interview Preparation Platform',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/about`,
    title: 'About Us | CareerToDo',
    description: 'Learn about CareerToDo - the innovative platform that bridges the gap between university and corporate careers.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

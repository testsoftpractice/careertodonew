import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Practice Lab',
  description: 'Hone your skills in CareerToDo\'s Practice Lab - practice job simulations, improve interview skills, and build confidence.',
  keywords: [
    'CareerToDo Practice Lab',
    'Job Practice',
    'Interview Practice',
    'Career Skills Practice',
    'Skill Building',
    'Career Training',
  ],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  other: {
    'X-Robots-Tag': 'noindex, nofollow',
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/practice-lab`,
    title: 'Practice Lab | CareerToDo',
    description: 'Hone your skills in CareerToDo\'s Practice Lab - practice job simulations and build confidence.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/practice-lab`,
  },
}

export default function PracticeLabLayout({ children }: { children: React.ReactNode }) {
  return children
}

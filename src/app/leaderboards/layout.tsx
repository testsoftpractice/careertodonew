import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Leaderboards',
  description: 'View CareerToDo leaderboards - see top performers, track rankings, and compete with other students in career simulations.',
  keywords: [
    'CareerToDo Leaderboards',
    'Top Students',
    'Career Rankings',
    'Student Leaderboards',
    'Performance Rankings',
    'Career Competition',
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
    url: `${siteConfig.url}/leaderboards`,
    title: 'Leaderboards | CareerToDo',
    description: 'View CareerToDo leaderboards - see top performers and track rankings.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/leaderboards`,
  },
}

export default function LeaderboardsLayout({ children }: { children: React.ReactNode }) {
  return children
}

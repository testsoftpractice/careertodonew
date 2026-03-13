import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Explore the CareerToDo marketplace - discover projects, find opportunities, and connect with universities, employers, and investors.',
  keywords: [
    'CareerToDo Marketplace',
    'Career Projects',
    'Job Opportunities',
    'Student Marketplace',
    'Career Opportunities',
    'Project Marketplace',
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
    url: `${siteConfig.url}/marketplace`,
    title: 'Marketplace | CareerToDo',
    description: 'Explore the CareerToDo marketplace - discover projects and connect with opportunities.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/marketplace`,
  },
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children
}

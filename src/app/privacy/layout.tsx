import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read CareerToDo\'s Privacy Policy. Learn how we collect, use, and protect your personal information on our career simulation platform.',
  keywords: [
    'Privacy Policy',
    'CareerToDo Privacy',
    'Data Privacy',
    'User Privacy',
    'Career Platform Privacy',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/privacy`,
    title: 'Privacy Policy | CareerToDo',
    description: 'Read CareerToDo\'s Privacy Policy. Learn how we collect, use, and protect your personal information.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}

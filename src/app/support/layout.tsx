import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Support Center',
  description: 'Get help with CareerToDo. Find answers to common questions, troubleshooting guides, and access our support resources.',
  keywords: [
    'CareerToDo Support',
    'Help Center',
    'Customer Support',
    'Platform Support',
    'Career Platform Help',
    'FAQ',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/support`,
    title: 'Support Center | CareerToDo',
    description: 'Get help with CareerToDo. Find answers to common questions and access our support resources.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/support`,
  },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read CareerToDo\'s Terms of Service. Understand your rights and responsibilities when using our career simulation platform.',
  keywords: [
    'Terms of Service',
    'CareerToDo Terms',
    'User Agreement',
    'Platform Terms',
    'Career Platform Terms',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/terms`,
    title: 'Terms of Service | CareerToDo',
    description: 'Read CareerToDo\'s Terms of Service. Understand your rights and responsibilities.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}

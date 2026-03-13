import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'CareerToDo',
    'Job Simulation Platform',
    'Career Development',
    'Interview Preparation',
    'Student Platform',
    'University Platform',
    'Employer Platform',
    'Investor Platform',
    'Career Skills',
    'Real-world Experience',
    'Job Training',
    'Interview Dominator',
    'Career Simulation',
  ],
  authors: [{ name: 'CareerToDo Team' }],
  creator: 'CareerToDo',
  publisher: 'CareerToDo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@CareerToDo',
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

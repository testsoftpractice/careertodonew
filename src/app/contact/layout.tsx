import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with CareerToDo. Have questions or need assistance? Our team is here to help. Contact us via email, phone, or social media. We typically respond within 24-48 hours.',
  keywords: [
    'CareerToDo Contact',
    'Contact CareerToDo',
    'Career Support',
    'Customer Service',
    'CareerToDo Help',
    'Contact Form',
    'Career Advice',
    'Platform Support',
  ],
  authors: [{ name: 'CareerToDo Team' }],
  creator: 'CareerToDo',
  publisher: 'CareerToDo',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteConfig.url}/contact`,
    title: 'Contact Us | CareerToDo',
    description: 'Get in touch with CareerToDo. Have questions or need assistance? Our team is here to help. Contact us via email, phone, or social media.',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Contact CareerToDo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | CareerToDo',
    description: 'Get in touch with CareerToDo. Have questions or need assistance? Our team is here to help.',
    images: [siteConfig.ogImage],
    creator: '@CareerToDo',
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

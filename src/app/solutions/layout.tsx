import type { Metadata } from 'next'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Discover CareerToDo solutions for students, universities, employers, and investors - comprehensive career development platform.',
  keywords: [
    'CareerToDo Solutions',
    'Student Solutions',
    'University Solutions',
    'Employer Solutions',
    'Investor Solutions',
    'Career Platform Solutions',
  ],
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/solutions`,
    title: 'Solutions | CareerToDo',
    description: 'Discover CareerToDo solutions for students, universities, employers, and investors.',
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: `${siteConfig.url}/solutions`,
  },
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children
}

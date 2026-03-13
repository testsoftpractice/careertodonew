import type { Metadata } from 'next'

const siteUrl = 'https://careertodo.com'

export const siteConfig = {
  name: 'CareerToDo',
  description: 'Get hired faster: Bridge the gap from university to corporate with real-world career simulations. Become an Interview Dominator with proven experience and demonstrable skills.',
  url: siteUrl,
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://x.com/CareerToDo',
    facebook: 'https://www.facebook.com/careertodo',
    instagram: 'https://www.instagram.com/career.todo/',
    youtube: 'https://www.youtube.com/@careertodo',
    linkedin: 'https://www.linkedin.com/company/careertodo/',
  },
}

export function createMetadata(
  title: string,
  description: string,
  path: string = '',
  noIndex: boolean = false
): Metadata {
  const url = `${siteUrl}${path}`
  const pageTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description,
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
    ],
    authors: [{ name: 'CareerToDo Team' }],
    creator: 'CareerToDo',
    publisher: 'CareerToDo',
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [siteConfig.ogImage],
      creator: '@CareerToDo',
    },
    alternates: {
      canonical: url,
    },
  }
}

export function getPublicPageMetadata(title: string, description: string, path: string): Metadata {
  return createMetadata(title, description, path, false)
}

export function getPrivatePageMetadata(title: string): Metadata {
  return createMetadata(title, 'Private page - login required', '', true)
}

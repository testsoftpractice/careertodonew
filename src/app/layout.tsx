import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import FacebookPixel from "@/components/analytics/facebook-pixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://careertodo.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CareerToDo Platform",
  description: "Get hired faster: Bridge the gap from university to corporate with real-world career simulations. Become an Interview Dominator with proven experience and demonstrable skills.",
  keywords: ["CareerToDo", "Student Platform", "University Platform", "Employer Platform", "Investor Platform", "Job Simulation", "Interview Preparation"],
  authors: [{ name: "CareerToDo Team" }],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "CareerToDo Platform",
    description: "Get hired faster: Bridge the gap from university to corporate with real-world career simulations.",
    siteName: "CareerToDo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerToDo Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerToDo Platform",
    description: "Get hired faster: Bridge the gap from university to corporate with real-world career simulations.",
    images: ["/og-image.png"],
    creator: "@CareerToDo",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <FacebookPixel />
        </AuthProvider>
      </body>
    </html>
  );
}

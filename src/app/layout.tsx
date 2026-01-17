import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerToDo Platform",
  description: "A governed ecosystem where students operate real organizations, building verifiable careers from university onward.",
  keywords: ["CareerToDo", "Student Platform", "University Platform", "Employer Platform", "Investor Platform"],
  authors: [{ name: "CareerToDo Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CareerToDo Platform",
    description: "A governed ecosystem where students operate real organizations, building verifiable careers from university onward.",
    type: "website",
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
        </AuthProvider>
      </body>
    </html>
  );
}

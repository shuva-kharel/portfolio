import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shuva Kharel — Cybersecurity Portfolio',
  description: 'Cybersecurity student focused on offensive security, vulnerability research, and CTFs.',
  generator: 'v0.app',
}

export const viewport: Viewport = { colorScheme: 'dark light', themeColor: '#0d0b0a' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}

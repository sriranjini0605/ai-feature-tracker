import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Image Processor',
  description: 'A demo application for processing images with AI'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

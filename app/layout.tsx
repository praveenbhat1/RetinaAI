import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetinaAI - Medical Image Analysis',
  description: 'AI-Based Retinal Abnormality Detection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

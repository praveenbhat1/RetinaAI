import type { Metadata } from 'next'
import { Outfit, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from './providers'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'RetinaAI — Clinical-Grade Retinal Abnormality Detection',
  description: 'AI-powered retinal abnormality detection using deep learning. Detect diabetic retinopathy with 99.4% accuracy.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${mono.variable} ${outfit.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col z-0">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

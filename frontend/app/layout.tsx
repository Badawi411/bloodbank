import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import ThemeRegistry from "@/components/theme-registry"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blood Bank Management System",
  description: "A comprehensive blood bank management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}

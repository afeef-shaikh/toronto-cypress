import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ReportsProvider } from "@/context/reports-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Toronto Cypress - Citizen Reporting System",
  description: "Report and track local infrastructure issues in Toronto",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="toronto-cypress-theme"
        >
          <AuthProvider>
            <ReportsProvider>
              {children}
              <Toaster />
            </ReportsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

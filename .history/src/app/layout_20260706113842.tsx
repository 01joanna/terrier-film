import Header from "./components/layout/Header"
import "./globals.css"
import ReduxProvider from "@/store/provider"
import { IBM_Plex_Mono } from "next/font/google"
import { Inter } from "next/font/google"
import ProjectInitializer from "./components/ProjectInitializer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TERRIER FILM",
  description: "...",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
})

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plex",
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ibmPlex.variable} ${inter.variable}`}>
      <body>
        <ReduxProvider>
          <ProjectInitializer />

          <main className="relative w-screen h-screen overflow-hidden">
            {children}
          </main>

          <div className="">
            <Header />
          </div>

        </ReduxProvider>
      </body>
    </html>
  )
}
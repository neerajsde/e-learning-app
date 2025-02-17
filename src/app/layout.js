import AppContextProvider from "@/context/AppContext";
import "./globals.css";
import Navbar from "@/components/sections/navbar/Navbar";
import Footer from "@/components/sections/Footer";
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Study Notion - Empower Your Learning",
  description: "Study Notion is your go-to platform for interactive learning, expert-led courses, and skill development. Join now and enhance your knowledge!",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/favicon_io/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/assets/favicon_io/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/assets/favicon_io/apple-touch-icon.png',
    },
  ],
  manifest: '/assets/favicon_io/site.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>
          <Navbar />
          <div>{children}</div>
          <Footer />
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
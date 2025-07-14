import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Brain Break Hub - Productive Breaks & Focus",
  description: "A unique platform combining casual brain games, productivity tools, and mindful break activities to help you stay focused and relaxed.",
  keywords: ["productivity", "brain games", "focus timer", "pomodoro", "mindful breaks", "habit tracker"],
  authors: [{ name: "Brain Break Hub" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased gradient-bg min-h-screen">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

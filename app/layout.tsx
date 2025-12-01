import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOE - ELEARN",
  description: "For administrators",
  icons: {
    icon: '/moe.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          containerClassName="!z-[9999]"
          containerStyle={{
            top: '16px',
            right: '16px',
            left: 'auto',
            bottom: 'auto',
          }}
          toastOptions={{
            className: '',
            duration: 4000,
            style: {
              fontFamily: 'Poppins, sans-serif',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.5',
            },
            success: {
              duration: 4000,
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#10B981',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#EF4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

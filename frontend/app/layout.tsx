import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "YouTube Dashboard",
  description: "A live YouTube analytics dashboard built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "#ff0000",
            color: "white",
            padding: "1rem 2rem",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 700,
            fontSize: "1.5rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
        YouTube Analytics Dashboard
        </header>

        {/* Main content container */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "1rem 0",
            fontSize: "0.875rem",
            color: "#777",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          &copy; {new Date().getFullYear()} Tan Le On.
        </footer>
      </body>
    </html>
  );
}

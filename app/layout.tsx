import type React from "react";
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shuva Kharel - High School Student Portfolio",
  description:
    "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
  keywords:
    "cybersecurity, technology, high school student, Nepal, Kathmandu, programming",
  authors: [{ name: "Shuva Kharel" }],
  creator: "Shuva Kharel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shuva-kharel.com",
    title: "Shuva Kharel - High School Student Portfolio",
    description:
      "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
    siteName: "Shuva Kharel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shuva Kharel - High School Student Portfolio",
    description:
      "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

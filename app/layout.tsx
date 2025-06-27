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
  metadataBase: new URL("https://shuvakharel.com.np"),
  title: "Shuva Kharel - Portfolio",
  description:
    "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
  keywords:
    "cybersecurity, technology, high school student, Nepal, Kathmandu, programming",
  authors: [{ name: "Shuva Kharel" }],
  creator: "Shuva Kharel",
  alternates: {
    canonical: "https://shuvakharel.com.np",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shuvakharel.com.np",
    title: "Shuva Kharel - Portfolio",
    description:
      "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
    siteName: "Shuva Kharel - Portfolio",
    images: [
      {
        url: "https://shuvakharel.com.np/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shuva Kharel Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shuva Kharel - Portfolio",
    description:
      "High school student passionate about cybersecurity, technology, and networking from Kathmandu, Nepal.",
    images: ["https://shuvakharel.com.np/og-image.png"],
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
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

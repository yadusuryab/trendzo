import type { Metadata } from "next";
import { Audiowide, Geist, Geist_Mono, Inter, Luxurious_Script, Michroma, Montserrat, Quantico } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import OGImage from '@/public/og-image.png'
import React from "react";
import { Footer } from "@/components/layout/footer";

// Helvetica Regular from public folder
const helveticaRegular = localFont({
  src: [
    {
      path: '../public/HelveticaRegular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-regular',
});

// Luxurious Script from Google Fonts
const luxuriousScript = Luxurious_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-luxurious-script',
});

// Alternative: If you want the actual Luxurious Script font, use this instead:
// const luxuriousScript = Inter({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: '--font-luxurious-script',
// });

// If you specifically want Luxurious Script, you can use:
const luxurious = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-luxurious',
});

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight:["400"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// You can store OG image path also in env if you want different brand banners
const OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE || "/default-og.jpg"; // fallback if not set

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_BRAND_DESC}`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description: `${process.env.NEXT_PUBLIC_APP_NAME} is ${process.env.NEXT_PUBLIC_BRAND_DESC}. Shop ${process.env.NEXT_PUBLIC_PRODUCT_DESC} at affordable prices.`,
  keywords: [
    process.env.NEXT_PUBLIC_APP_NAME || "",
    process.env.NEXT_PUBLIC_BRAND_DESC || "",
    process.env.NEXT_PUBLIC_PRODUCT_DESC || "",
    "Online Store",
    "Kerala Shopping",
    "Affordable Products",
  ],
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_BRAND_DESC}`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} – Shop ${process.env.NEXT_PUBLIC_PRODUCT_DESC}. Premium quality at the best prices.`,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME} Collection`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} – ${process.env.NEXT_PUBLIC_BRAND_DESC}.`,
    images: [OG_IMAGE],
  },
  authors: [
    {
      name: "shopigo",
      url: "https://myshopigo.shop",
    },
  ],
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${geistMono.variable} ${helveticaRegular.variable} ${luxuriousScript.variable} antialiased`}
      >
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer/>
        <Toaster />
      </body>
    </html>
  );
}
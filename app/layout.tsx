import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";
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

// Luxurious Script font (using Imperial Script)
const luxuriousScript = localFont({
  src: '../public/ImperialScript-Regular.ttf', // Make sure this file exists in public folder
  variable: '--font-luxurious-script',
  display: 'swap',
});

// Geist Sans - using Inter as fallback
const geistSans = localFont({
  src: '../public/Geist-Regular.woff2', // Add your Geist font files
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Facebook Pixel ID from environment variables
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '2062812121112921';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Shopigo";
const BRAND_DESC = process.env.NEXT_PUBLIC_BRAND_DESC || "Your Brand Description";
const PRODUCT_DESC = process.env.NEXT_PUBLIC_PRODUCT_DESC || "Premium Products";

const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${APP_NAME} | ${BRAND_DESC}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `${APP_NAME} is ${BRAND_DESC}. Shop ${PRODUCT_DESC} at affordable prices.`,
  keywords: [
    APP_NAME,
    BRAND_DESC,
    PRODUCT_DESC,
    "Online Store",
    "Kerala Shopping",
    "Affordable Products",
  ],
  openGraph: {
    title: `${APP_NAME} | ${BRAND_DESC}`,
    description: `${APP_NAME} – Shop ${PRODUCT_DESC}. Premium quality at the best prices.`,
    url: BASE_URL,
    siteName: APP_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} Collection`,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: `${APP_NAME} – ${BRAND_DESC}.`,
    images: [OG_IMAGE],
  },
  authors: [
    {
      name: "shopigo",
      url: "https://myshopigo.shop",
    },
  ],
  // themeColor is deprecated in newer Next.js versions
  // Use metadata.other for custom metadata if needed
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Facebook Pixel Script - loaded strategically */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${helveticaRegular.variable} ${luxuriousScript.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
          <Toaster />
        </ThemeProvider>
        
        {/* Facebook Pixel Noscript - loaded after interactive */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
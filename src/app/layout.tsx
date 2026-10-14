import { ReactNode, Suspense } from "react";
import Providers from "../components/providers/providers";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistration from "@/components/core/service-worker-registration";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { MetaPixel } from "@/components/integrations/meta-pixel";
import { GoogleMarketing } from "@/components/integrations/google-marketing";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aurevia Elegance | Online Beauty Store Pakistan",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop skincare, makeup, fragrances, hair care, jewelry, watches and beauty accessories online from Aurevia Elegance with delivery across Pakistan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurevia Elegance",
  },
  icons: {
    icon: [
      { url: "/logo/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/logo/icon-192x192.png", sizes: "192x192", type: "image/png" }],
    apple: [
      { url: "/logo/icon.png", sizes: "1254x1254", type: "image/png" },
    ],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EA580C",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo/icon.png" />
        <link rel="shortcut icon" type="image/png" href="/logo/icon.png" />
        <link rel="apple-touch-icon" href="/logo/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aurevia Elegance" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Script src="/performance-measure-guard.js" strategy="beforeInteractive" />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <GoogleMarketing />
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

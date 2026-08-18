import type { Metadata } from "next";
import {
  Syne,
  Aladin,
  Marcellus,
} from "next/font/google";
import { VideoProvider } from "@/provider/VideoProvider";
import { ToastProvider } from "@/provider/ToastProvider";
import { AuthProvider } from "@/provider/AuthProvider";
import { WishlistProvider } from "@/provider/WishlistProvider";
import { CartProvider } from "@/provider/CartProvider";
import { QuickViewProvider } from "@/provider/QuickViewProvider";
import AuthModal from "@/components/modal/auth-modal";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { buildPageMetadata } from "@/lib/seo-cms";
import "swiper/css/bundle";
import "./globals.scss";

const gellery = localFont({
  src: [
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/gallerymodern-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--tp-ff-gallery",
});

const aladin = Aladin({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-aladin",
});
const syne_body = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});
const syne_heading = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});
const syne_p = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-p",
});
const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-syne",
});


// Sitewide fallback (CMS `seo-default` doc) — used as-is by any page below that doesn't
// define its own generateMetadata, and layered under every page that does (see
// src/lib/seo-cms.ts buildPageMetadata).
export async function generateMetadata(): Promise<Metadata> {
  const seo = await buildPageMetadata("default", {
    title: "Shizenta — Nature-Inspired Luxury Furniture",
    description: "Handcrafted luxury furniture, curated collections and bespoke interiors — designed to transform your home.",
  });
  return {
    ...seo,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        id="body"
        suppressHydrationWarning={true}
        className={`${gellery.variable} ${aladin.variable}
         ${syne_body.variable} ${syne_heading.variable} ${syne_p.variable}
          ${syne.variable}`}
      >
        <ThemeProvider defaultTheme="light">
          <ToastProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <QuickViewProvider>
                    <VideoProvider>
                      {children}
                      <AuthModal />
                    </VideoProvider>
                  </QuickViewProvider>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


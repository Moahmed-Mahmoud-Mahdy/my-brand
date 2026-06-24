import type { Metadata } from "next";
import { Inter, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorProvider } from "@/components/cursor/cursor-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M. Mahdy — Full Stack Developer | Eclipse Identity Experience",
  description:
    "محمد مهدي — مطور Full Stack. أبني تجارب رقمية تجمع بين الأداء والتصميم القوي والإحساس السينمائي. A cinematic digital identity experience by M. Mahdy, Full Stack Developer.",
  keywords: [
    "M. Mahdy",
    "محمد مهدي",
    "Full Stack Developer",
    "Web Developer",
    "Portfolio",
    "Cinematic",
    "Eclipse",
    "مطور ويب",
  ],
  authors: [{ name: "M. Mahdy" }],
  openGraph: {
    title: "M. Mahdy — Full Stack Developer",
    description:
      "A luxury cinematic digital identity experience. Full Stack Development with cinematic atmosphere.",
    siteName: "M. Mahdy Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className="dark"
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} ${cairo.variable} ${tajawal.variable} antialiased bg-bg-primary text-text-primary font-cairo`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <CursorProvider>{children}</CursorProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

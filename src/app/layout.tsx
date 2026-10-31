import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import NekoCompanion from '@/components/NekoCompanion';

const hankenGrotesk = localFont({
  src: "./fonts/hanken-grotesk-latin.woff2",
  weight: "300 800",
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Axel John Nuqui - Full Stack Dev",
  description: "Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='light'?'light':'dark';var accent=localStorage.getItem('portfolio-accent');document.documentElement.dataset.accent=['default','violet','blue','mint','rose','amber'].includes(accent)?accent:'default'}catch{document.documentElement.dataset.accent='default'}` }} />
      </head>
      <body
        className={`${hankenGrotesk.className} ${hankenGrotesk.variable} bg-page text-foreground antialiased`}
      >
          <ThemeProvider>{children}<NekoCompanion /></ThemeProvider>
      </body>
    </html>
  );
}

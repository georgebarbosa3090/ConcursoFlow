import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ConcursoFlow AI — Preparação Inteligente para Concursos",
    template: "%s | ConcursoFlow AI"
  },
  description: "Plataforma inteligente de preparação para concursos públicos com motor adaptativo, agente especialista em bancas (Cebraspe, FGV, FCC), caderno de erros e analytics avançado.",
  keywords: ["concurso público", "preparação concurso", "estudo adaptativo", "Cebraspe", "FGV", "FCC", "questões concurso", "edital"],
  authors: [{ name: "ConcursoFlow AI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ConcursoFlow AI",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "ConcursoFlow AI",
    title: "ConcursoFlow AI — Preparação Inteligente para Concursos",
    description: "Plataforma inteligente com motor adaptativo, agente de bancas e analytics avançado para concursos públicos.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
        {/* Registro do Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}

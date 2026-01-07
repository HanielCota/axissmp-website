import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://axissmp.com"),
    title: {
        default: "AxisSMP - A Nova Era do Survival",
        template: "%s | AxisSMP"
    },
    description: "Servidor de Minecraft Survival 1.21 com economia, quests, proteção de terrenos e uma comunidade ativa.",
    keywords: ["minecraft", "survival", "servidor", "1.21", "axissmp", "economia", "mcmmo"],
    authors: [{ name: "AxisSMP Team" }],
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://axissmp.com",
        siteName: "AxisSMP",
        title: "AxisSMP - A Nova Era do Survival",
        description: "O melhor servidor survival 1.21. Economia, quests e diversão garantida!",
        images: [
            {
                url: "/images/site/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "AxisSMP Server",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AxisSMP - A Nova Era do Survival",
        description: "O melhor servidor survival 1.21.",
        images: ["/images/site/og-image.jpg"],
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning style={{ scrollBehavior: "smooth" }}>
            <body
                className={`${outfit.variable} bg-background text-foreground font-sans antialiased min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <Suspense fallback={null}>
                        <CartProvider>
                            <main className="flex-1">
                                {children}
                            </main>
                        </CartProvider>
                    </Suspense>
                </ThemeProvider>
                <Toaster
                    position="top-right"
                    richColors
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: "rgba(0, 0, 0, 0.8)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "white",
                        },
                    }}
                />
            </body>
        </html>
    );
}

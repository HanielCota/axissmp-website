import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "AxisSMP - A Nova Era do Survival",
    description: "Servidor de Minecraft Survival 1.21 com economia, quests e comunidade ativa.",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
        other: {
            rel: "apple-touch-icon-precomposed",
            url: "/apple-touch-icon.png",
        },
    },
    manifest: "/site.webmanifest",
};

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={`${outfit.variable} bg-background text-foreground font-sans antialiased`}
                suppressHydrationWarning
            >
                <CartProvider>
                    {children}
                </CartProvider>
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

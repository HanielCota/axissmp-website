import { Metadata } from "next";
import { ForumBreadcrumbs } from "@/components/forum/ForumBreadcrumbs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Fórum",
    description: "Participe da comunidade AxisSMP.",
};

export default function ForumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            {/* Subtle Background Texture */}
            <div className="fixed inset-0 bg-noise opacity-30 pointer-events-none z-0" />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl pt-10 relative z-10">
                <ForumBreadcrumbs />
                <div className="pt-10">
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}

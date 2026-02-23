import { Metadata } from "next";
import { ForumBreadcrumbs } from "@/components/forum/ForumBreadcrumbs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Fórum",
    description: "Participe da comunidade AxisSMP.",
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background flex min-h-screen flex-col">
            <Navbar />

            {/* Subtle Background Texture */}
            <div className="bg-noise pointer-events-none fixed inset-0 z-0 opacity-30" />

            <div className="relative z-10 container mx-auto max-w-7xl flex-1 px-4 py-8 pt-10">
                <ForumBreadcrumbs />
                <div className="pt-10">{children}</div>
            </div>

            <Footer />
        </div>
    );
}

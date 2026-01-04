import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";

export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-brand-orange/30">
            <Navbar />
            <Hero />
        </main>
    );
}

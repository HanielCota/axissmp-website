import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";

export default async function Home() {
    return (
        <main className="selection:bg-brand-orange/30 min-h-screen bg-white text-slate-900">
            <Navbar />
            <Hero />
        </main>
    );
}

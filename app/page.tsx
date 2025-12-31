import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            <Hero />
        </main>
    );
}

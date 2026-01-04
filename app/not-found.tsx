import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-brand-light dark:bg-black text-slate-900 dark:text-white selection:bg-brand-orange/30">
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-white/70 dark:bg-black/80 z-10" />
                <Image
                    src="/images/site/render.jpg"
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-10 dark:opacity-30 grayscale-[0.2]"
                    priority
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
                <div className="mb-8 relative w-40 h-40">
                    <Image
                        src="/images/logo/logo.png"
                        alt="AxisSMP Logo"
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                <div className="space-y-2 mb-8">
                    <h1 className="text-8xl font-black text-brand-orange drop-shadow-sm tracking-tighter">404</h1>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Página não encontrada</h2>
                    <p className="text-slate-600 dark:text-white/60 font-medium">
                        Ops! Parece que você se perdeu no mapa. Essa página não existe ou foi removida.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link href="/" className="flex-1">
                        <Button className="w-full h-14 bg-brand-orange hover:bg-brand-orange/90 text-brand-dark font-black uppercase tracking-tight text-base rounded-xl">
                            <MoveLeft className="mr-2 h-5 w-5" />
                            Voltar ao Início
                        </Button>
                    </Link>
                    <Link href="/support" className="flex-1">
                        <Button variant="outline" className="w-full h-14 border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold uppercase tracking-tight text-base rounded-xl">
                            <HelpCircle className="mr-2 h-5 w-5" />
                            Suporte
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

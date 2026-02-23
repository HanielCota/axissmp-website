import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
    return (
        <main className="bg-brand-light selection:bg-brand-orange/30 relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-slate-900 dark:bg-black dark:text-white">
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 z-10 bg-white/70 dark:bg-black/80" />
                <Image
                    src="/images/site/render.jpg"
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-10 grayscale-[0.2] dark:opacity-30"
                    priority
                />
            </div>

            <div className="relative z-10 flex max-w-lg flex-col items-center px-6 text-center">
                <div className="relative mb-8 h-40 w-40">
                    <Image
                        src="/images/logo/logo.png"
                        alt="AxisSMP Logo"
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                <div className="mb-8 space-y-2">
                    <h1 className="text-brand-orange text-8xl font-black tracking-tighter drop-shadow-sm">
                        404
                    </h1>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                        Página não encontrada
                    </h2>
                    <p className="font-medium text-slate-600 dark:text-white/60">
                        Ops! Parece que você se perdeu no mapa. Essa página não existe ou foi
                        removida.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-4 sm:flex-row">
                    <Link href="/" className="flex-1">
                        <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-dark h-14 w-full rounded-xl text-base font-black tracking-tight uppercase">
                            <MoveLeft className="mr-2 h-5 w-5" />
                            Voltar ao Início
                        </Button>
                    </Link>
                    <Link href="/support" className="flex-1">
                        <Button
                            variant="outline"
                            className="h-14 w-full rounded-xl border-slate-200 bg-white/50 text-base font-bold tracking-tight text-slate-900 uppercase hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            <HelpCircle className="mr-2 h-5 w-5" />
                            Suporte
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

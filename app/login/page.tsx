"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Home } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(
                error.message === "Invalid login credentials"
                    ? "E-mail ou senha incorretos."
                    : error.message
            );
            setIsLoading(false);
            return;
        }

        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh();
    };

    return (
        <main className="bg-brand-light selection:bg-brand-orange/30 relative flex min-h-screen w-full items-center justify-center overflow-hidden text-slate-900 dark:bg-black dark:text-white">
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 z-10 bg-white/70 dark:bg-black/60" />
                <Image
                    src="/images/site/render.jpg"
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-10 grayscale-[0.2] dark:opacity-50"
                    priority
                />
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm font-bold text-slate-600 backdrop-blur-md transition-all hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
                <Home size={18} />
                <span>Voltar ao Início</span>
            </Link>

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="relative mb-8 block h-24 w-48 drop-shadow-2xl transition-transform hover:scale-105"
                    >
                        <Image
                            src="/images/logo/logo.png"
                            alt="AxisSMP Logo"
                            fill
                            sizes="192px"
                            className="object-contain"
                        />
                    </Link>

                    {/* Login Card */}
                    <div className="w-full rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                                Acesse sua Conta
                            </h1>
                            <p className="font-medium text-slate-600 dark:text-white/70">
                                Bem-vindo de volta, aventureiro!
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="ml-1 text-xs font-black tracking-widest text-slate-500 uppercase dark:text-white/60">
                                    Seu E-mail
                                </label>
                                <div className="group relative">
                                    <div className="group-focus-within:text-brand-orange absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 transition-colors dark:text-white/60">
                                        <User size={20} />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="focus:border-brand-orange/50 focus:ring-brand-orange/10 h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:hover:bg-white/10"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="ml-1 flex items-center justify-between">
                                    <label className="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-white/60">
                                        Sua Senha
                                    </label>
                                    <Link
                                        href="#"
                                        className="text-brand-orange text-xs font-bold hover:underline"
                                    >
                                        Esqueci a senha
                                    </Link>
                                </div>
                                <div className="group relative">
                                    <div className="group-focus-within:text-brand-orange absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 transition-colors dark:text-white/60">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="focus:border-brand-orange/50 focus:ring-brand-orange/10 h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 hover:bg-slate-50 focus:bg-white focus:ring-4 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:hover:bg-white/10"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group bg-brand-orange text-brand-dark relative mt-2 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl px-6 font-black tracking-tighter uppercase transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,145,0,0.3)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <span
                                    className={cn(
                                        "transition-all duration-300",
                                        isLoading
                                            ? "translate-y-10 opacity-0"
                                            : "flex items-center gap-2"
                                    )}
                                >
                                    Entrar no Servidor
                                    <ArrowRight
                                        size={20}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                                {isLoading && (
                                    <div className="absolute flex items-center justify-center">
                                        <div className="border-brand-dark h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm font-medium text-slate-500 dark:text-white/60">
                                Não tem uma conta?{" "}
                                <Link
                                    href="/register"
                                    className="hover:text-brand-orange font-black text-slate-900 transition-colors dark:text-white"
                                >
                                    Registre-se agora
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <p className="mt-8 max-w-xs text-center text-xs font-medium text-slate-500 dark:text-white/40">
                        Ao entrar, você concorda com nossos termos de uso e regras da comunidade.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

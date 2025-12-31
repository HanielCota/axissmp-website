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
            toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
            setIsLoading(false);
            return;
        }

        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh();
    };

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white selection:bg-brand-orange/30">
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent z-10" />
                <Image
                    src="/images/site/render.jpg"
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-50 grayscale-[0.2]"
                    priority
                />
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm font-bold backdrop-blur-md transition-all hover:bg-white/10"
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
                    <Link href="/" className="mb-8 block h-24 w-48 relative drop-shadow-2xl transition-transform hover:scale-105">
                        <Image
                            src="/images/logo/logo.png"
                            alt="AxisSMP Logo"
                            fill
                            sizes="192px"
                            className="object-contain"
                        />
                    </Link>

                    {/* Login Card */}
                    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Acesse sua Conta</h1>
                            <p className="text-white/60 font-medium">Bem-vindo de volta, aventureiro!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Seu E-mail</label>
                                <div className="group relative">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                        <User size={20} />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 font-bold text-white transition-all placeholder:text-white/20 hover:bg-white/10 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-orange/10"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40">Sua Senha</label>
                                    <Link href="#" className="text-xs font-bold text-brand-orange hover:underline">Esqueci a senha</Link>
                                </div>
                                <div className="group relative">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 font-bold text-white transition-all placeholder:text-white/20 hover:bg-white/10 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-orange/10"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative mt-2 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-orange px-6 font-black text-brand-dark uppercase tracking-tighter transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,145,0,0.3)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <span className={cn("transition-all duration-300", isLoading ? "translate-y-10 opacity-0" : "flex items-center gap-2")}>
                                    Entrar no Servidor
                                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </span>
                                {isLoading && (
                                    <div className="absolute flex items-center justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm font-medium text-white/40">
                                Não tem uma conta?{" "}
                                <Link
                                    href="/register"
                                    className="font-black text-white hover:text-brand-orange transition-colors"
                                >
                                    Registre-se agora
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <p className="mt-8 text-center text-xs font-medium text-white/20 max-w-xs">
                        Ao entrar, você concorda com nossos termos de uso e regras da comunidade.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

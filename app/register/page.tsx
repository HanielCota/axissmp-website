"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowRight, Home } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nickname: nickname,
                }
            }
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
            return;
        }

        toast.success("Conta criada com sucesso! Verifique seu e-mail para confirmar.");
        router.push("/login");
    };

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white selection:bg-brand-orange/30">
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent z-10" />
                <Image
                    src="/images/site/render.jpg" // Usando o mesmo render para consistência
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

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    {/* Logo (Smaller on register for more vertical space) */}
                    <Link href="/" className="mb-6 block h-20 w-40 relative drop-shadow-2xl transition-transform hover:scale-105">
                        <Image
                            src="/images/logo/logo.png"
                            alt="AxisSMP Logo"
                            fill
                            sizes="160px"
                            className="object-contain"
                        />
                    </Link>

                    {/* Register Card */}
                    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Criar Conta</h1>
                            <p className="text-white/60 font-medium">Comece sua jornada no maior Survival 1.21!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Nickname Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Nickname (In-game)</label>
                                <div className="group relative">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                        <User size={20} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Seu nick no Minecraft"
                                        className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 font-bold text-white transition-all placeholder:text-white/20 hover:bg-white/10 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-orange/10"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">E-mail</label>
                                <div className="group relative">
                                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                        <Mail size={20} />
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

                            {/* Password Group */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Senha</label>
                                    <div className="group relative">
                                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••"
                                            className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 font-bold text-white transition-all placeholder:text-white/20 hover:bg-white/10 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-orange/10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Confirmar</label>
                                    <div className="group relative">
                                        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-brand-orange">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            required
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••"
                                            className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 font-bold text-white transition-all placeholder:text-white/20 hover:bg-white/10 focus:border-brand-orange/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-brand-orange/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative mt-4 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-orange px-6 font-black text-brand-dark uppercase tracking-tighter transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,145,0,0.3)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <span className={cn("transition-all duration-300", isLoading ? "translate-y-10 opacity-0" : "flex items-center gap-2")}>
                                    Criar minha Conta
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
                                Já possui uma conta?{" "}
                                <Link
                                    href="/login"
                                    className="font-black text-white hover:text-brand-orange transition-colors"
                                >
                                    Fazer Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

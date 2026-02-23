"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, ShoppingBag, Share2, ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface PublicProfile {
    nickname: string;
    level: number;
    created_at: string;
}

interface PlayerProfileClientProps {
    profile: PublicProfile;
}

export default function PlayerProfileClient({ profile }: PlayerProfileClientProps) {
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link do perfil copiado!");
    };

    const copyIP = () => {
        navigator.clipboard.writeText("jogar.axissmp.com");
        toast.success("IP copiado! Entre no servidor.");
    };

    return (
        <main className="dark:bg-background selection:bg-brand-orange/30 min-h-screen bg-white text-slate-900 dark:text-white">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                {/* Header Actions */}
                <div className="mb-12 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group hover:text-brand-orange flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors dark:text-slate-500"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Ver outros jogadores
                    </Link>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                        <Share2 size={18} />
                        Compartilhar Perfil
                    </button>
                </div>

                {/* Profile Hero */}
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                    {/* Character Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-12 lg:col-span-7 dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="absolute top-8 left-8 text-left">
                            <span className="mb-2 block text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase dark:text-slate-600">
                                Visual 3D Atual
                            </span>
                            <div className="flex items-center gap-2">
                                <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic md:text-6xl dark:text-white">
                                    {profile.nickname}
                                </h1>
                                <CheckCircle2 size={24} className="text-brand-orange mt-2" />
                            </div>
                        </div>

                        {/* Character Render */}
                        <div className="relative mt-12 h-[400px] w-full cursor-zoom-in transition-transform duration-700 hover:scale-110">
                            <img
                                src={`https://mc-heads.net/body/${profile.nickname}`}
                                alt={`${profile.nickname} character`}
                                className="h-full w-full object-contain drop-shadow-[0_0_50px_rgba(255,145,0,0.1)] filter"
                                loading="eager"
                            />
                        </div>

                        <div className="absolute right-8 bottom-8">
                            <div className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">
                                Jogador do AxisSMP
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats & Info */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {/* Level Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-brand-orange group shadow-brand-orange/20 relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-lg"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                                <Trophy size={80} />
                            </div>
                            <span className="mb-1 block text-[10px] font-black tracking-widest uppercase opacity-60">
                                Nível Global
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-7xl font-black tracking-tighter italic">
                                    {profile.level}
                                </span>
                                <span className="text-sm font-black tracking-widest uppercase opacity-40">
                                    Rank #---
                                </span>
                            </div>
                        </motion.div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
                            >
                                <div className="mb-4 w-fit rounded-xl border border-slate-100 bg-white p-3 text-slate-400 dark:border-white/5 dark:bg-white/10 dark:text-slate-300">
                                    <Clock size={20} />
                                </div>
                                <span className="mb-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Jogando desde
                                </span>
                                <p className="text-xl font-black text-slate-800 dark:text-white">
                                    {new Date(profile.created_at).toLocaleDateString("pt-BR", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
                            >
                                <div className="mb-4 w-fit rounded-xl border border-slate-100 bg-white p-3 text-slate-400 dark:border-white/5 dark:bg-white/10 dark:text-slate-300">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="mb-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Apoio na Loja
                                </span>
                                <p className="text-xl font-black text-slate-800 dark:text-white">
                                    ---
                                </p>
                            </motion.div>
                        </div>

                        {/* Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-1 flex-col justify-between rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 shadow-sm dark:border-white/10 dark:bg-white/5"
                        >
                            <div>
                                <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                                    Conecte-se com {profile.nickname}
                                </h3>
                                <div className="prose prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    <ReactMarkdown>
                                        {`Este é o perfil oficial de ${profile.nickname} no servidor **AxisSMP**. Entre agora para jogar junto ou ver suas conquistas in-game!`}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/store"
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-black tracking-wider text-white uppercase shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                    Enviar Presente
                                    <ShoppingBag size={18} />
                                </Link>
                                <button
                                    onClick={copyIP}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-transparent py-4 text-sm font-black tracking-wider text-slate-900 uppercase transition-all hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                >
                                    Copiar IP do Servidor
                                    <Copy size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-20 text-center">
                    <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">
                        AxisSMP Official Community Profiles
                    </p>
                </div>
            </div>
        </main>
    );
}

"use client";

import { motion } from "framer-motion";
import {
    Trophy,
    Clock,
    ShoppingBag,
    Share2,
    ArrowLeft,
    CheckCircle2,
    Copy,
} from "lucide-react";
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
        <main className="min-h-screen bg-white dark:bg-background text-slate-900 dark:text-white selection:bg-brand-orange/30">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                {/* Header Actions */}
                <div className="mb-12 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 transition-colors hover:text-brand-orange"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Ver outros jogadores
                    </Link>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 px-6 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 shadow-sm"
                    >
                        <Share2 size={18} />
                        Compartilhar Perfil
                    </button>
                </div>

                {/* Profile Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Character Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 relative overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-12 flex flex-col items-center justify-center min-h-[500px]"
                    >
                        <div className="absolute top-8 left-8 text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 block mb-2">Visual 3D Atual</span>
                            <div className="flex items-center gap-2">
                                <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">{profile.nickname}</h1>
                                <CheckCircle2 size={24} className="text-brand-orange mt-2" />
                            </div>
                        </div>

                        {/* Character Render */}
                        <div className="relative h-[400px] w-full mt-12 transition-transform hover:scale-110 duration-700 cursor-zoom-in">
                            <img
                                src={`https://mc-heads.net/body/${profile.nickname}`}
                                alt={`${profile.nickname} character`}
                                className="h-full w-full object-contain filter drop-shadow-[0_0_50px_rgba(255,145,0,0.1)]"
                                loading="eager"
                            />
                        </div>

                        <div className="absolute bottom-8 right-8">
                            <div className="rounded-full bg-brand-orange/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-orange border border-brand-orange/20">
                                Jogador do AxisSMP
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats & Info */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Level Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-brand-orange rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-lg shadow-brand-orange/20"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                                <Trophy size={80} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Nível Global</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-7xl font-black italic tracking-tighter">{profile.level}</span>
                                <span className="text-sm font-black uppercase tracking-widest opacity-40">Rank #---</span>
                            </div>
                        </motion.div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-sm"
                            >
                                <div className="p-3 rounded-xl bg-white dark:bg-white/10 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-white/5 w-fit mb-4">
                                    <Clock size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Jogando desde</span>
                                <p className="text-xl font-black text-slate-800 dark:text-white">{new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-sm"
                            >
                                <div className="p-3 rounded-xl bg-white dark:bg-white/10 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-white/5 w-fit mb-4">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Apoio na Loja</span>
                                <p className="text-xl font-black text-slate-800 dark:text-white">---</p>
                            </motion.div>
                        </div>

                        {/* Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 flex-1 flex flex-col justify-between shadow-sm"
                        >
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4 text-slate-900 dark:text-white">Conecte-se com {profile.nickname}</h3>
                                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 prose prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black">
                                    <ReactMarkdown>
                                        {`Este é o perfil oficial de ${profile.nickname} no servidor **AxisSMP**. Entre agora para jogar junto ou ver suas conquistas in-game!`}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/store"
                                    className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all uppercase text-sm tracking-wider shadow-lg shadow-slate-900/10"
                                >
                                    Enviar Presente
                                    <ShoppingBag size={18} />
                                </Link>
                                <button
                                    onClick={copyIP}
                                    className="flex items-center justify-center gap-3 w-full bg-transparent border-2 border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all uppercase text-sm tracking-wider"
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
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">AxisSMP Official Community Profiles</p>
                </div>
            </div>
        </main>
    );
}

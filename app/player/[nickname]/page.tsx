"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Trophy,
    Clock,
    ShoppingBag,
    Share2,
    ArrowLeft,
    CheckCircle2,
    Copy,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface PublicProfile {
    nickname: string;
    level: number;
    created_at: string;
}

export default function PlayerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const nicknameParam = params.nickname as string;
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPublicProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("nickname, level, created_at")
                .ilike("nickname", nicknameParam)
                .single();

            if (error || !data) {
                console.error("Error fetching public profile:", {
                    message: error?.message,
                    details: error?.details,
                    hint: error?.hint,
                    code: error?.code
                });
                setLoading(false);
                return;
            }

            setProfile(data);
            setLoading(false);
        };

        if (nicknameParam) {
            fetchPublicProfile();
        }
    }, [nicknameParam, supabase]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link do perfil copiado!");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-white/10 italic">404</h1>
                    <h2 className="text-2xl font-bold">Jogador não encontrado</h2>
                    <p className="text-white/40 max-w-xs mx-auto">Não encontramos nenhum jogador com o nickname "{nicknameParam}".</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:underline">
                        <ArrowLeft size={16} /> Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-orange/30">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                {/* Header Actions */}
                <div className="mb-12 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-brand-orange"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Ver outros jogadores
                    </Link>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 px-6 text-sm font-bold text-white/70 transition-all hover:bg-white/10 active:scale-95"
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
                        className="lg:col-span-7 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-12 backdrop-blur-xl flex flex-col items-center justify-center min-h-[500px]"
                    >
                        <div className="absolute top-8 left-8 text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 block mb-2">Visual 3D Atual</span>
                            <div className="flex items-center gap-2">
                                <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">{profile.nickname}</h1>
                                <CheckCircle2 size={24} className="text-brand-orange mt-2" />
                            </div>
                        </div>

                        {/* Character Render */}
                        <div className="relative h-[400px] w-full mt-12 transition-transform hover:scale-110 duration-700 cursor-zoom-in">
                            <img
                                src={`https://mc-heads.net/body/${profile.nickname}`}
                                alt={`${profile.nickname} character`}
                                className="h-full w-full object-contain filter drop-shadow-[0_0_50px_rgba(255,145,0,0.2)]"
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
                            className="bg-brand-orange rounded-[2.5rem] p-8 text-brand-dark relative overflow-hidden group"
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
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md"
                            >
                                <div className="p-3 rounded-xl bg-white/5 text-white/40 w-fit mb-4">
                                    <Clock size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Jogando desde</span>
                                <p className="text-xl font-black">{new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md"
                            >
                                <div className="p-3 rounded-xl bg-white/5 text-white/40 w-fit mb-4">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Apoio na Loja</span>
                                <p className="text-xl font-black">---</p>
                            </motion.div>
                        </div>

                        {/* Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex-1 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">Conecte-se com {profile.nickname}</h3>
                                <div className="text-white/40 text-sm leading-relaxed mb-6 prose prose-invert prose-p:leading-relaxed prose-strong:text-white prose-strong:font-black">
                                    <ReactMarkdown>
                                        {`Este é o perfil oficial de ${profile.nickname} no servidor **AxisSMP**. Entre agora para jogar junto ou ver suas conquistas in-game!`}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/store"
                                    className="flex items-center justify-center gap-3 w-full bg-white text-brand-dark font-black py-4 rounded-2xl hover:bg-white/90 transition-all uppercase text-sm tracking-wider"
                                >
                                    Enviar Presente
                                    <ShoppingBag size={18} />
                                </Link>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText("jogar.axissmp.com");
                                        toast.success("IP copiado! Entre no servidor.");
                                    }}
                                    className="flex items-center justify-center gap-3 w-full bg-transparent border-2 border-white/10 text-white font-black py-4 rounded-2xl hover:bg-white/5 transition-all uppercase text-sm tracking-wider"
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
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">AxisSMP Official Community Profiles</p>
                </div>
            </div>
        </main>
    );
}

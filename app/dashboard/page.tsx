"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    User as UserIcon,
    Wallet,
    Trophy,
    Clock,
    ShoppingBag,
    LifeBuoy,
    LogOut,
    ExternalLink,
    ChevronRight,
    ArrowLeft,
    Share2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";

interface Profile {
    nickname: string;
    level: number;
    balance: number;
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    created_at: string;
    items: OrderItem[];
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
}


import { type User } from "@supabase/supabase-js";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);

            // Fetch profile data
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("nickname, level, balance")
                .eq("id", user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
                setProfile({
                    nickname: user.user_metadata?.nickname || "Jogador",
                    level: 1,
                    balance: 0
                });
            }

            if (profileData) {
                setProfile({
                    ...profileData,
                    nickname: profileData.nickname || user.user_metadata?.nickname || "Jogador"
                });
            }

            // Fetch orders
            const { data: ordersData, error: ordersError } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!ordersError) {
                setOrders(ordersData || []);
            }

            setLoading(false);
        };

        fetchUserAndProfile();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Sessão encerrada com sucesso.");
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
            </div>
        );
    }

    const nickname = profile?.nickname || "Jogador";

    return (
        <main className="min-h-screen bg-brand-light dark:bg-[#0a0a0a] text-slate-900 dark:text-white selection:bg-brand-orange/30">
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Header */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <Link
                            href="/"
                            className="group mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/60 transition-colors hover:text-brand-orange"
                        >
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            Voltar ao Início
                        </Link>
                        <h1 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl text-slate-900 dark:text-white">
                            Seu <span className="text-brand-orange">Dashboard</span>
                        </h1>
                        <p className="text-slate-600 dark:text-white/70 font-medium mt-1">Bem-vindo à sua central de comando, {nickname}.</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-bold text-slate-600 dark:text-white/70 transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:text-red-500 dark:hover:text-red-400 active:scale-95 shadow-sm"
                    >
                        <LogOut size={18} />
                        Sair da Conta
                    </button>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-2 lg:grid-rows-3">

                    {/* Character Card (Large) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative col-span-1 overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-xl md:col-span-8 md:row-span-2 lg:col-span-6 lg:row-span-3 shadow-xl dark:shadow-none"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <div className="rounded-full bg-brand-orange/20 px-4 py-1 text-xs font-black uppercase text-brand-orange">
                                Online Agora
                            </div>
                        </div>

                        <div className="flex h-full flex-col justify-between">
                            <div className="relative z-10">
                                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Visual 3D</span>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">{nickname}</h2>
                            </div>

                            <div className="relative flex flex-1 items-center justify-center py-12">
                                {/* Character Render */}
                                <div className="relative h-[25rem] w-full transition-transform hover:scale-105 duration-500">
                                    <img
                                        src={`https://mc-heads.net/body/${nickname}`}
                                        alt={`${nickname} character`}
                                        className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(255,145,0,0.3)]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/store"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-orange p-4 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,145,0,0.4)] w-full sm:w-auto"
                                >
                                    Personalizar Skin
                                    <ExternalLink size={16} />
                                </Link>
                                <Link
                                    href={`/player/${nickname}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 text-sm font-black uppercase text-slate-600 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10 w-full sm:w-auto"
                                >
                                    Ver Perfil Público
                                    <Share2 size={16} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Card: Balance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 flex flex-col justify-between rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-xl md:col-span-4 lg:col-span-3 lg:row-span-1 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange">
                                <Wallet size={24} />
                            </div>
                            <Link href="/store" className="text-slate-500 dark:text-white/60 hover:text-brand-orange dark:hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                        <div>
                            <span className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Saldo em Conta</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-brand-orange">R$</span>
                                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {profile?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Card: Level */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 flex flex-col justify-between rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-xl md:col-span-4 lg:col-span-3 lg:row-span-1 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange">
                                <Trophy size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-white/40">Rank #240</span>
                        </div>
                        <div>
                            <span className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Nível Global</span>
                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{profile?.level}</span>
                        </div>
                    </motion.div>

                    {/* Stats Card: Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 flex flex-col justify-between rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-xl md:col-span-4 lg:col-span-3 lg:row-span-1 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange">
                                <Clock size={24} />
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Tempo de Jogo</span>
                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">124h <span className="text-sm font-medium text-slate-500 dark:text-white/60">32m</span></span>
                        </div>
                    </motion.div>

                    {/* Quick Links Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="col-span-1 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-xl md:col-span-8 lg:col-span-3 lg:row-span-2 shadow-sm"
                    >
                        <span className="mb-6 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Ações Rápidas</span>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/store"
                                className="group flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 p-4 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingBag size={20} className="text-brand-orange" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">Minhas Compras</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-500 dark:text-white/40 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/support"
                                className="group flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 p-4 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <LifeBuoy size={20} className="text-brand-orange" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">Suporte VIP</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 dark:text-white/20 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="mt-8 rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-4">
                            <p className="text-xs font-bold leading-relaxed text-brand-dark/70 dark:text-white/70">
                                Precisando de ajuda in-game? Use <code className="rounded bg-brand-orange/20 px-1 py-0.5 text-brand-orange">/ajuda</code> ou abra um ticket pelo Discord!
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Orders Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-sm"
                >
                    <div className="border-b border-slate-200 dark:border-white/10 p-8">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Histórico de Pedidos</h2>
                        <p className="text-slate-600 dark:text-white/60 text-sm font-medium mt-1">Acompanhe suas compras e o status de entrega.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-slate-50 dark:bg-white/5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/60">
                                <tr>
                                    <th className="px-8 py-4">ID do Pedido</th>
                                    <th className="px-8 py-4">Data</th>
                                    <th className="px-8 py-4">Itens</th>
                                    <th className="px-8 py-4">Total</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 dark:text-white/20 font-bold italic">
                                            Nenhum pedido encontrado. Visite nossa loja!
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-mono text-xs text-slate-500 dark:text-white/60">#{order.id.slice(0, 8)}</td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-white">
                                                {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    {order.items.map((item: OrderItem, i: number) => (
                                                        <span key={i} className="text-sm font-medium text-slate-600 dark:text-white/70">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-brand-orange">
                                                R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider",
                                                    order.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                        order.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                                                            "bg-red-500/10 text-red-500"
                                                )}>
                                                    <span className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        order.status === 'completed' ? "bg-emerald-500" :
                                                            order.status === 'pending' ? "bg-amber-500" :
                                                                "bg-red-500"
                                                    )} />
                                                    {order.status === 'completed' ? 'Entregue' :
                                                        order.status === 'pending' ? 'Pendente' :
                                                            'Cancelado'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}

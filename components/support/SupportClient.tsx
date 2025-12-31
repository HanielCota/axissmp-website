"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
    LifeBuoy,
    Plus,
    MessageSquare,
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    AlertCircle,
    Search
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { NewTicketModal } from "./NewTicketModal";
import { cn } from "@/lib/utils";

interface Ticket {
    id: string;
    title: string;
    category: 'vendas' | 'bug' | 'suporte' | 'outro';
    status: 'open' | 'pending' | 'closed';
    created_at: string;
}

export function SupportClient() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();

    const fetchTickets = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error) {
            setTickets(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, [supabase]);

    const getStatusStyles = (status: Ticket['status']) => {
        switch (status) {
            case 'open':
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'pending':
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case 'closed':
                return "bg-white/5 text-white/40 border-white/10";
        }
    };

    const getCategoryLabel = (category: Ticket['category']) => {
        const labels = {
            vendas: "Vendas/VIP",
            bug: "Bug Report",
            suporte: "Suporte Geral",
            outro: "Outros"
        };
        return labels[category];
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-orange/30">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20">

                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link
                            href="/dashboard"
                            className="group mb-4 flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-brand-orange"
                        >
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
                            Central de <span className="text-brand-orange">Suporte</span>
                        </h1>
                        <p className="text-white/60 font-medium mt-1">Como podemos ajudar você hoje?</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 rounded-2xl bg-brand-orange px-8 py-4 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,145,0,0.4)] active:scale-95"
                    >
                        <Plus size={20} />
                        Novo Ticket
                    </button>
                </div>

                {/* Stats / Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                                <MessageSquare size={20} />
                            </div>
                            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Tickets Ativos</span>
                        </div>
                        <p className="text-3xl font-black">{tickets.filter(t => t.status !== 'closed').length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Resolvidos</span>
                        </div>
                        <p className="text-3xl font-black">{tickets.filter(t => t.status === 'closed').length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 rounded-xl bg-white/5 text-white/40">
                                <Search size={20} />
                            </div>
                            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Prazo Médio</span>
                        </div>
                        <p className="text-3xl font-black">12h</p>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/20 ml-2 mb-4">Seus Atendimentos</h3>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-16 text-center">
                            <LifeBuoy size={48} className="mx-auto text-white/10 mb-4" />
                            <h4 className="text-xl font-bold mb-2">Nenhum ticket aberto</h4>
                            <p className="text-white/40 max-w-xs mx-auto text-sm">Se tiver algum problema ou dúvida, nossa equipe está pronta para ajudar.</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/support/${ticket.id}`}
                                className="group block bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/[0.08] hover:border-white/20"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                getStatusStyles(ticket.status)
                                            )}>
                                                {ticket.status === 'open' ? 'Aberto' : ticket.status === 'pending' ? 'Pendente' : 'Fechado'}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                                {getCategoryLabel(ticket.category)}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-black truncate group-hover:text-brand-orange transition-colors">
                                            {ticket.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Clock size={12} />
                                            Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR')} às {new Date(ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-brand-orange group-hover:text-brand-dark transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* FAQ Prompt */}
                <div className="mt-16 bg-brand-orange/5 border border-brand-orange/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="p-5 rounded-3xl bg-brand-orange/10 text-brand-orange">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">Dúvida rápida?</h4>
                        <p className="text-white/60 text-sm max-w-md">Confira nossa Wiki oficial com guias e tutoriais antes de abrir um ticket. A resposta pode estar lá!</p>
                    </div>
                    <Link
                        href="/wiki"
                        className="md:ml-auto w-full md:w-auto px-8 py-4 rounded-2xl bg-white/5 text-white font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-all text-center"
                    >
                        Acessar Wiki
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <NewTicketModal
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchTickets}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}

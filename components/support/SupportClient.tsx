"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence } from "framer-motion";
import {
    LifeBuoy,
    Plus,
    MessageSquare,
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    AlertCircle,
    Search,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { NewTicketModal } from "./NewTicketModal";
import { cn } from "@/lib/utils";

interface Ticket {
    id: string;
    title: string;
    category: "vendas" | "bug" | "suporte" | "outro";
    status: "open" | "pending" | "closed";
    created_at: string;
}

export function SupportClient() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();

    const fetchTickets = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supabase]);

    const getStatusStyles = (status: Ticket["status"]) => {
        switch (status) {
            case "open":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "pending":
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "closed":
                return "bg-white/5 text-white/40 border-white/10";
        }
    };

    const getCategoryLabel = (category: Ticket["category"]) => {
        const labels = {
            vendas: "Vendas/VIP",
            bug: "Bug Report",
            suporte: "Suporte Geral",
            outro: "Outros",
        };
        return labels[category];
    };

    return (
        <main className="bg-brand-light selection:bg-brand-orange/30 min-h-screen text-slate-900 dark:bg-[#0a0a0a] dark:text-white">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20">
                {/* Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <Link
                            href="/dashboard"
                            className="group hover:text-brand-orange mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors dark:text-white/60"
                        >
                            <ArrowLeft
                                size={16}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic md:text-5xl dark:text-white">
                            Central de <span className="text-brand-orange">Suporte</span>
                        </h1>
                        <p className="mt-1 font-medium text-slate-600 dark:text-white/70">
                            Como podemos ajudar você hoje?
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-orange text-brand-dark flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-black uppercase transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,145,0,0.4)] active:scale-95"
                    >
                        <Plus size={20} />
                        Novo Ticket
                    </button>
                </div>

                {/* Stats / Quick Info */}
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                        <div className="mb-2 flex items-center gap-4">
                            <div className="bg-brand-orange/10 text-brand-orange rounded-xl p-2">
                                <MessageSquare size={20} />
                            </div>
                            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-white/60">
                                Tickets Ativos
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {tickets.filter((t) => t.status !== "closed").length}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                        <div className="mb-2 flex items-center gap-4">
                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-white/60">
                                Resolvidos
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {tickets.filter((t) => t.status === "closed").length}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                        <div className="mb-2 flex items-center gap-4">
                            <div className="rounded-xl bg-slate-100 p-2 text-slate-500 dark:bg-white/5 dark:text-white/40">
                                <Search size={20} />
                            </div>
                            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-white/60">
                                Prazo Médio
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">12h</p>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    <h3 className="mb-4 ml-2 text-xs font-black tracking-[0.2em] text-slate-500 uppercase dark:text-white/40">
                        Seus Atendimentos
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="border-brand-orange h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-16 text-center dark:border-white/10 dark:bg-white/5">
                            <LifeBuoy
                                size={48}
                                className="mx-auto mb-4 text-slate-200 dark:text-white/10"
                            />
                            <h4 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                Nenhum ticket aberto
                            </h4>
                            <p className="mx-auto max-w-xs text-sm text-slate-600 dark:text-white/60">
                                Se tiver algum problema ou dúvida, nossa equipe está pronta para
                                ajudar.
                            </p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={`/support/${ticket.id}`}
                                className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <div className="mb-1 flex items-center gap-3">
                                            <span
                                                className={cn(
                                                    "rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase",
                                                    getStatusStyles(ticket.status)
                                                )}
                                            >
                                                {ticket.status === "open"
                                                    ? "Aberto"
                                                    : ticket.status === "pending"
                                                        ? "Pendente"
                                                        : "Fechado"}
                                            </span>
                                            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-white/40">
                                                {getCategoryLabel(ticket.category)}
                                            </span>
                                        </div>
                                        <h4 className="group-hover:text-brand-orange truncate text-lg font-black text-slate-900 transition-colors dark:text-white">
                                            {ticket.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/60">
                                            <Clock size={12} />
                                            Criado em{" "}
                                            {new Date(ticket.created_at).toLocaleDateString(
                                                "pt-BR"
                                            )}{" "}
                                            às{" "}
                                            {new Date(ticket.created_at).toLocaleTimeString(
                                                "pt-BR",
                                                { hour: "2-digit", minute: "2-digit" }
                                            )}
                                        </div>
                                    </div>
                                    <div className="group-hover:bg-brand-orange group-hover:text-brand-dark rounded-2xl bg-slate-100 p-3 text-slate-400 transition-all dark:bg-white/5 dark:text-white">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* FAQ Prompt */}
                <div className="bg-brand-orange/5 border-brand-orange/10 mt-16 flex flex-col items-center gap-8 rounded-[2.5rem] border p-10 text-center md:flex-row md:text-left">
                    <div className="bg-brand-orange/10 text-brand-orange rounded-3xl p-5">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h4 className="mb-2 text-xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                            Dúvida rápida?
                        </h4>
                        <p className="max-w-md text-sm text-slate-600 dark:text-white/70">
                            Confira nossa Wiki oficial com guias e tutoriais antes de abrir um
                            ticket. A resposta pode estar lá!
                        </p>
                    </div>
                    <Link
                        href="/wiki"
                        className="w-full rounded-2xl bg-white px-8 py-4 text-center text-sm font-black tracking-wider text-slate-900 uppercase shadow-sm transition-all hover:bg-slate-50 md:ml-auto md:w-auto dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
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

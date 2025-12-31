"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Clock,
    CheckCircle2,
    ShieldCheck,
    User,
    AlertCircle,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    is_staff: boolean;
    created_at: string;
    user_id: string;
}

interface Ticket {
    id: string;
    title: string;
    status: 'open' | 'pending' | 'closed';
    category: string;
    user_id: string;
}

export function TicketDetailClient() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchTicketAndMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch Ticket
            const { data: ticketData, error: ticketError } = await supabase
                .from("tickets")
                .select("*")
                .eq("id", ticketId)
                .single();

            if (ticketError || !ticketData) {
                toast.error("Ticket não encontrado.");
                router.push("/support");
                return;
            }
            setTicket(ticketData);

            // Fetch Messages
            const { data: msgData, error: msgError } = await supabase
                .from("ticket_messages")
                .select("*")
                .eq("ticket_id", ticketId)
                .order("created_at", { ascending: true });

            if (!msgError) {
                setMessages(msgData || []);
            }
            setLoading(false);
        };

        fetchTicketAndMessages();

        // Real-time subscription
        const channel = supabase
            .channel(`ticket-${ticketId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
                (payload) => {
                    setMessages((current) => [...current, payload.new as Message]);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` },
                (payload) => {
                    setTicket(payload.new as Ticket);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, router, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMsg.trim() || sending || !ticket || ticket.status === 'closed') return;

        setSending(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from("ticket_messages")
            .insert({
                ticket_id: ticketId,
                user_id: user?.id,
                content: newMsg.trim(),
                is_staff: false
            });

        if (error) {
            toast.error("Erro ao enviar mensagem.");
            setSending(false);
            return;
        }

        setNewMsg("");
        setSending(false);
    };

    const handleCloseTicket = async () => {
        if (!confirm("Tem certeza que deseja encerrar este atendimento?")) return;

        const { error } = await supabase
            .from("tickets")
            .update({ status: 'closed' })
            .eq("id", ticketId);

        if (error) {
            toast.error("Erro ao fechar ticket.");
            return;
        }

        toast.success("Ticket encerrado.");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-orange/30 flex flex-col">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-10 w-full flex-1 flex flex-col">

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-[2rem] p-8">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/support"
                            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/20 transition-colors hover:text-brand-orange mb-2"
                        >
                            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                            Meus Atendimentos
                        </Link>
                        <h1 className="text-3xl font-black uppercase italic tracking-tight">{ticket.title}</h1>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                ticket.status === 'open' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    ticket.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        "bg-white/5 text-white/40 border-white/10"
                            )}>
                                {ticket.status === 'open' ? 'Aberto' : ticket.status === 'pending' ? 'Pendente' : 'Fechado'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                Ticket #{ticket.id.slice(0, 8)}
                            </span>
                        </div>
                    </div>

                    {ticket.status !== 'closed' && (
                        <button
                            onClick={handleCloseTicket}
                            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-3 text-xs font-black uppercase text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
                        >
                            <XCircle size={16} />
                            Encerrar Ticket
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden min-h-[500px] mb-6">

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col gap-2 max-w-[80%]",
                                    msg.is_staff ? "mr-auto" : "ml-auto items-end"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {msg.is_staff && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-orange/10 text-brand-orange text-[9px] font-black uppercase tracking-tighter border border-brand-orange/20">
                                            <ShieldCheck size={10} />
                                            Staff AxisSMP
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                        {msg.is_staff ? 'Equipe' : 'Você'} • {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className={cn(
                                    "p-5 rounded-2xl text-sm leading-relaxed",
                                    msg.is_staff
                                        ? "bg-white/10 text-white rounded-tl-none border border-white/5"
                                        : "bg-brand-orange text-brand-dark font-medium rounded-tr-none shadow-lg shadow-brand-orange/10"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white/[0.03] border-t border-white/5">
                        {ticket.status === 'closed' ? (
                            <div className="flex items-center justify-center gap-3 py-4 text-white/20 font-black uppercase tracking-widest text-xs italic">
                                <XCircle size={16} />
                                Este ticket foi encerrado e não aceita novas mensagens.
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <textarea
                                    required
                                    rows={1}
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Digite sua mensagem aqui..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-orange/50 transition-all placeholder:text-white/10 font-medium resize-none max-h-32"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMsg.trim() || sending}
                                    className="aspect-square w-14 rounded-2xl bg-brand-orange text-brand-dark flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    {sending ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </form>
                        )}
                        <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                            <AlertCircle size={12} />
                            Evite flood. Nossa staff responderá o mais breve possível.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

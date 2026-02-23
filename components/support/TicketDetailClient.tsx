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
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

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
    status: "open" | "pending" | "closed";
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
            const {
                data: { user },
            } = await supabase.auth.getUser();
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
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "ticket_messages",
                    filter: `ticket_id=eq.${ticketId}`,
                },
                (payload) => {
                    setMessages((current) => [...current, payload.new as Message]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "tickets",
                    filter: `id=eq.${ticketId}`,
                },
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
        if (!newMsg.trim() || sending || !ticket || ticket.status === "closed") return;

        setSending(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from("ticket_messages").insert({
            ticket_id: ticketId,
            user_id: user?.id,
            content: newMsg.trim(),
            is_staff: false,
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
            .update({ status: "closed" })
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
                <div className="border-brand-orange h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <main className="bg-brand-light dark:bg-background selection:bg-brand-orange/30 flex min-h-screen flex-col text-slate-900 transition-colors duration-300 dark:text-white">
            <Navbar />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-32 pb-10">
                {/* Header Section */}
                <div className="mb-8 flex flex-col justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/support"
                            className="group hover:text-brand-orange mb-2 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors dark:text-white/20"
                        >
                            <ArrowLeft
                                size={14}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Meus Atendimentos
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight uppercase italic">
                            {ticket.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase",
                                    ticket.status === "open"
                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                        : ticket.status === "pending"
                                          ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                          : "border-white/10 bg-white/5 text-white/40"
                                )}
                            >
                                {ticket.status === "open"
                                    ? "Aberto"
                                    : ticket.status === "pending"
                                      ? "Pendente"
                                      : "Fechado"}
                            </span>
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/20">
                                Ticket #{ticket.id.slice(0, 8)}
                            </span>
                        </div>
                    </div>

                    {ticket.status !== "closed" && (
                        <button
                            onClick={handleCloseTicket}
                            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-3 text-xs font-black text-red-500 uppercase transition-all hover:bg-red-500/20 active:scale-95"
                        >
                            <XCircle size={16} />
                            Encerrar Ticket
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <div className="mb-6 flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                    {/* Message List */}
                    <div className="scrollbar-thin scrollbar-thumb-white/10 flex-1 space-y-6 overflow-y-auto p-8">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex max-w-[80%] flex-col gap-2",
                                    msg.is_staff ? "mr-auto" : "ml-auto items-end"
                                )}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    {msg.is_staff && (
                                        <div className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[9px] font-black tracking-tighter uppercase">
                                            <ShieldCheck size={10} />
                                            Staff AxisSMP
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/20">
                                        {msg.is_staff ? "Equipe" : "Você"} •{" "}
                                        {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <div
                                    className={cn(
                                        "rounded-2xl p-5 text-sm leading-relaxed",
                                        msg.is_staff
                                            ? "rounded-tl-none border border-slate-200 bg-slate-100 text-slate-800 dark:border-white/5 dark:bg-white/10 dark:text-white"
                                            : "bg-brand-orange text-brand-dark shadow-brand-orange/10 rounded-tr-none font-medium shadow-lg"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-slate-200 bg-slate-50 p-6 dark:border-white/5 dark:bg-white/[0.03]">
                        {ticket.status === "closed" ? (
                            <div className="flex items-center justify-center gap-3 py-4 text-xs font-black tracking-widest text-white/20 uppercase italic">
                                <XCircle size={16} />
                                Este ticket foi encerrado e não aceita novas mensagens.
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <Textarea
                                    required
                                    rows={1}
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Digite sua mensagem aqui..."
                                    className="focus:border-brand-orange/50 max-h-32 min-h-[60px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-6 py-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/10"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMsg.trim() || sending}
                                    className="bg-brand-orange text-brand-dark flex aspect-square w-14 items-center justify-center rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
                                >
                                    {sending ? (
                                        <div className="border-brand-dark h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </form>
                        )}
                        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/20">
                            <AlertCircle size={12} />
                            Evite flood. Nossa staff responderá o mais breve possível.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

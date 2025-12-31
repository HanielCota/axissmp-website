"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminTicketDetail, sendAdminReply, closeTicket } from "@/app/actions/tickets";
import { ArrowLeft, Send, Loader2, XCircle, User, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminTicketDetailProps {
    ticketId: string;
}

interface TicketData {
    ticket: {
        id: string;
        title: string;
        category: string;
        status: string;
        created_at: string;
    };
    messages: Array<{
        id: string;
        content: string;
        is_staff: boolean;
        created_at: string;
    }>;
    userNickname: string;
}

export function AdminTicketDetail({ ticketId }: AdminTicketDetailProps) {
    const [data, setData] = useState<TicketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAdminTicketDetail(ticketId);
            if (result.error) {
                toast.error(result.error);
                router.push("/admin/tickets");
                return;
            }
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [ticketId, router]);

    const handleSendReply = () => {
        if (!message.trim()) return;

        startTransition(async () => {
            const result = await sendAdminReply(ticketId, message.trim());

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Resposta enviada!");
            setMessage("");

            // Refresh data
            const refreshed = await getAdminTicketDetail(ticketId);
            if (refreshed.data) setData(refreshed.data);
        });
    };

    const handleCloseTicket = () => {
        if (!confirm("Tem certeza que deseja fechar este ticket?")) return;

        startTransition(async () => {
            const result = await closeTicket(ticketId);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Ticket fechado!");
            router.push("/admin/tickets");
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-brand-orange" size={32} />
            </div>
        );
    }

    if (!data) return null;

    const { ticket, messages, userNickname } = data;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/admin/tickets"
                className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Voltar para Tickets
            </Link>

            <div className="rounded-3xl border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black mb-1">{ticket.title}</h2>
                        <p className="text-sm text-white/40">
                            Por <span className="text-white/60 font-bold">{userNickname}</span> • #{ticket.id.slice(0, 8)}
                        </p>
                    </div>
                    {ticket.status !== 'closed' && (
                        <button
                            onClick={handleCloseTicket}
                            disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold"
                        >
                            <XCircle size={16} />
                            Fechar Ticket
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.is_staff ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.is_staff ? 'bg-brand-orange text-brand-dark' : 'bg-white/10 text-white/60'
                                }`}>
                                {msg.is_staff ? <Shield size={18} /> : <User size={18} />}
                            </div>
                            <div className={`max-w-[70%] rounded-2xl p-4 ${msg.is_staff
                                ? 'bg-brand-orange/10 text-white'
                                : 'bg-white/5 text-white/80'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className="text-xs text-white/30 mt-2">
                                    {new Date(msg.created_at).toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'closed' && (
                    <div className="p-6 border-t border-white/5">
                        <div className="flex gap-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua resposta..."
                                rows={3}
                                className="flex-1 rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-orange focus:outline-none resize-none"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={isPending || !message.trim()}
                                className="self-end px-6 py-3 rounded-xl bg-brand-orange text-brand-dark font-bold flex items-center gap-2 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Enviar
                            </button>
                        </div>
                    </div>
                )}

                {ticket.status === 'closed' && (
                    <div className="p-6 border-t border-white/5 text-center text-white/40">
                        Este ticket foi fechado.
                    </div>
                )}
            </div>
        </div>
    );
}

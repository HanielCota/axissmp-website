"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminTicketDetail, sendAdminReply, closeTicket } from "@/lib/actions/tickets";
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
                <Loader2 className="text-brand-orange animate-spin" size={32} />
            </div>
        );
    }

    if (!data) return null;

    const { ticket, messages, userNickname } = data;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-4xl duration-500">
            <Link
                href="/admin/tickets"
                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-white"
            >
                <ArrowLeft size={16} />
                Voltar para Tickets
            </Link>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/5 p-6">
                    <div>
                        <h2 className="mb-1 text-xl font-black">{ticket.title}</h2>
                        <p className="text-sm text-white/40">
                            Por <span className="font-bold text-white/60">{userNickname}</span> • #
                            {ticket.id.slice(0, 8)}
                        </p>
                    </div>
                    {ticket.status !== "closed" && (
                        <button
                            onClick={handleCloseTicket}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
                        >
                            <XCircle size={16} />
                            Fechar Ticket
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="max-h-[500px] space-y-4 overflow-y-auto p-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.is_staff ? "flex-row-reverse" : ""}`}
                        >
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                    msg.is_staff
                                        ? "bg-brand-orange text-brand-dark"
                                        : "bg-white/10 text-white/60"
                                }`}
                            >
                                {msg.is_staff ? <Shield size={18} /> : <User size={18} />}
                            </div>
                            <div
                                className={`max-w-[70%] rounded-2xl p-4 ${
                                    msg.is_staff
                                        ? "bg-brand-orange/10 text-white"
                                        : "bg-white/5 text-white/80"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className="mt-2 text-xs text-white/30">
                                    {new Date(msg.created_at).toLocaleString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                {ticket.status !== "closed" && (
                    <div className="border-t border-white/5 p-6">
                        <div className="flex gap-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua resposta..."
                                rows={3}
                                className="focus:border-brand-orange flex-1 resize-none rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={isPending || !message.trim()}
                                className="bg-brand-orange text-brand-dark flex items-center gap-2 self-end rounded-xl px-6 py-3 font-bold transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                Enviar
                            </button>
                        </div>
                    </div>
                )}

                {ticket.status === "closed" && (
                    <div className="border-t border-white/5 p-6 text-center text-white/40">
                        Este ticket foi fechado.
                    </div>
                )}
            </div>
        </div>
    );
}

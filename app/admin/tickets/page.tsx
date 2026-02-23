import { getAdminTickets } from "@/lib/actions/tickets";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

const statusConfig = {
    open: { label: "Aberto", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
    answered: {
        label: "Respondido",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        icon: CheckCircle,
    },
    closed: { label: "Fechado", color: "text-white/40", bg: "bg-white/5", icon: XCircle },
};

const categoryLabels: Record<string, string> = {
    general: "Geral",
    payment: "Pagamento",
    technical: "Técnico",
    report: "Denúncia",
};

export default async function AdminTicketsPage() {
    const { data: tickets, error } = await getAdminTickets();

    if (error) {
        return <div className="py-12 text-center text-white/40">{error}</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase italic">
                    Tickets de Suporte
                </h2>
                <p className="font-medium text-white/40">Responda às dúvidas dos jogadores.</p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-white/5 text-xs font-black tracking-widest text-white/40 uppercase">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tickets?.map((ticket) => {
                                const status = statusConfig[ticket.status] || statusConfig.open;
                                const StatusIcon = status.icon;
                                return (
                                    <tr
                                        key={ticket.id}
                                        className="group transition-colors hover:bg-white/[0.02]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-white/5 p-2">
                                                    <MessageSquare
                                                        size={16}
                                                        className="text-white/50"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="line-clamp-1 font-bold">
                                                        {ticket.title}
                                                    </div>
                                                    <div className="font-mono text-xs text-white/40">
                                                        #{ticket.id.slice(0, 8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white/60">
                                                {categoryLabels[ticket.category] || ticket.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${status.bg} ${status.color}`}
                                            >
                                                <StatusIcon size={14} />
                                                <span className="text-xs font-bold uppercase">
                                                    {status.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            {new Date(ticket.created_at).toLocaleDateString(
                                                "pt-BR"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/tickets/${ticket.id}`}
                                                className="bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                                            >
                                                Responder
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!tickets || tickets.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-white/20"
                                    >
                                        Nenhum ticket encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

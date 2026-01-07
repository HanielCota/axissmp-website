import { getOrders } from "@/app/actions/orders";
import Image from "next/image";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { OrderStatusButton } from "@/components/admin/OrderStatusButton";
import { unstable_noStore as noStore } from 'next/cache';

// Force dynamic rendering
export const revalidate = 0;

const statusConfig = {
    pending: { label: "Pendente", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
    paid: { label: "Pago", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle },
    delivered: { label: "Entregue", color: "text-blue-500", bg: "bg-blue-500/10", icon: Package },
    cancelled: { label: "Cancelado", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
};

export default async function AdminOrdersPage() {
    noStore();
    const { data: orders } = await getOrders();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tight">Pedidos</h2>
                <p className="text-white/40 font-medium">Gerencie os pedidos da loja.</p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs font-black uppercase tracking-widest text-white/40">
                            <tr>
                                <th className="px-6 py-4">Pedido</th>
                                <th className="px-6 py-4">Nickname</th>
                                <th className="px-6 py-4">Itens</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders?.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.pending;
                                const StatusIcon = status.icon;
                                return (
                                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-white/60">
                                                #{order.id.slice(0, 8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={`https://mc-heads.net/avatar/${order.nickname}/32`}
                                                    alt={order.nickname}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-lg"
                                                    unoptimized
                                                />
                                                <span className="font-bold">{order.nickname}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white/60">
                                                {order.items?.length || 0} item(s)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-brand-orange">
                                            R$ {order.total_amount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                                                <StatusIcon size={14} />
                                                <span className="text-xs font-black uppercase">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <OrderStatusButton order={order} />
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!orders || orders.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-white/20">
                                        Nenhum pedido encontrado.
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

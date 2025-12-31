"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, Order } from "@/app/actions/orders";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderStatusButtonProps {
    order: Order;
}

const statusOptions: { value: Order['status']; label: string }[] = [
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' },
];

export function OrderStatusButton({ order }: OrderStatusButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleStatusChange = (status: Order['status']) => {
        setIsOpen(false);

        startTransition(async () => {
            const result = await updateOrderStatus(order.id, status);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Status atualizado!");
            router.refresh();
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                <span className="text-xs font-bold">Alterar</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-20 overflow-hidden">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors ${order.status === option.value ? 'text-brand-orange' : 'text-white/80'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

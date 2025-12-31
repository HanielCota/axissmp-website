'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Order {
    id: string;
    user_id: string;
    nickname: string;
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
    total_amount: number;
    status: 'pending' | 'paid' | 'delivered' | 'cancelled';
    created_at: string;
}

export async function getOrders() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return { data: null, error: "Erro ao buscar pedidos." };
    }

    return { data: data as Order[], error: null };
}

export async function getOrder(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching order:", error);
        return { data: null, error: "Pedido não encontrado." };
    }

    return { data: data as Order, error: null };
}

export async function updateOrderStatus(id: string, status: Order['status']) {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { error: "Apenas administradores podem alterar pedidos." };
    }

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Error updating order:", error);
        return { error: "Erro ao atualizar pedido." };
    }

    revalidatePath("/admin/orders");
    return { success: true };
}

export async function getOrdersStats() {
    const supabase = await createClient();

    const { data: orders, error } = await supabase
        .from("orders")
        .select("total_amount, status");

    if (error) {
        return { totalSales: 0, pendingCount: 0, paidCount: 0 };
    }

    const totalSales = orders
        ?.filter(o => o.status === 'paid' || o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    const pendingCount = orders?.filter(o => o.status === 'pending').length || 0;
    const paidCount = orders?.filter(o => o.status === 'paid' || o.status === 'delivered').length || 0;

    return { totalSales, pendingCount, paidCount };
}

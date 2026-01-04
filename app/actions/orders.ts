'use server'

import { z } from 'zod';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Schemas de Validação
const orderIdSchema = z.string().uuid();

const updateStatusSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'paid', 'delivered', 'cancelled'])
});

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

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem ver pedidos." };
    }

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
    // 1. Validation
    const validated = orderIdSchema.safeParse(id);
    if (!validated.success) {
        return { data: null, error: "ID de pedido inválido." };
    }

    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem ver pedidos." };
    }

    // 2. Fetch
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", validated.data)
        .single();

    if (error) {
        console.error("Error fetching order:", error);
        return { data: null, error: "Pedido não encontrado." };
    }

    return { data: data as Order, error: null };
}

export async function updateOrderStatus(id: string, status: Order['status']) {
    // 1. Validação Zod
    const validated = updateStatusSchema.safeParse({ id, status });
    if (!validated.success) {
        return { data: null, error: validated.error.issues[0].message };
    }

    const supabase = await createClient();

    // 2. Verificar autorização
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem alterar pedidos." };
    }

    // 3. Atualizar status
    const { error } = await supabase
        .from("orders")
        .update({ status: validated.data.status })
        .eq("id", validated.data.id);

    if (error) {
        console.error("Error updating order:", error);
        return { data: null, error: "Erro ao atualizar pedido." };
    }

    revalidatePath("/admin/orders");
    return { data: { success: true }, error: null };
}

export async function getOrdersStats() {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem ver estatísticas." };
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select("total_amount, status");

    if (error) {
        return { data: null, error: "Erro ao buscar estatísticas." };
    }

    const totalSales = orders
        ?.filter(o => o.status === 'paid' || o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    const pendingCount = orders?.filter(o => o.status === 'pending').length || 0;
    const paidCount = orders?.filter(o => o.status === 'paid' || o.status === 'delivered').length || 0;

    return {
        data: { totalSales, pendingCount, paidCount },
        error: null
    };
}

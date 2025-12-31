'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Ticket {
    id: string;
    user_id: string;
    title: string;
    category: string;
    status: 'open' | 'answered' | 'closed';
    created_at: string;
}

export interface TicketMessage {
    id: string;
    ticket_id: string;
    user_id: string;
    content: string;
    is_staff: boolean;
    created_at: string;
}

export async function getAdminTickets() {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem ver tickets." };
    }

    const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tickets:", error);
        return { data: null, error: "Erro ao buscar tickets." };
    }

    return { data: data as Ticket[], error: null };
}

export async function getAdminTicketDetail(ticketId: string) {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem ver tickets." };
    }

    const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

    if (ticketError) {
        return { data: null, error: "Ticket não encontrado." };
    }

    const { data: messages, error: messagesError } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

    if (messagesError) {
        return { data: null, error: "Erro ao buscar mensagens." };
    }

    // Get user nickname
    const { data: userProfile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", ticket.user_id)
        .single();

    return {
        data: {
            ticket: ticket as Ticket,
            messages: messages as TicketMessage[],
            userNickname: userProfile?.nickname || "Usuário"
        },
        error: null
    };
}

export async function sendAdminReply(ticketId: string, content: string) {
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
        return { error: "Apenas administradores podem responder tickets." };
    }

    // Insert message
    const { error: msgError } = await supabase
        .from("ticket_messages")
        .insert({
            ticket_id: ticketId,
            user_id: user.id,
            content,
            is_staff: true
        });

    if (msgError) {
        console.error("Error sending reply:", msgError);
        return { error: "Erro ao enviar resposta." };
    }

    // Update ticket status to 'answered'
    await supabase
        .from("tickets")
        .update({ status: 'answered' })
        .eq("id", ticketId);

    revalidatePath(`/admin/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
    return { success: true };
}

export async function closeTicket(ticketId: string) {
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
        return { error: "Apenas administradores podem fechar tickets." };
    }

    const { error } = await supabase
        .from("tickets")
        .update({ status: 'closed' })
        .eq("id", ticketId);

    if (error) {
        return { error: "Erro ao fechar ticket." };
    }

    revalidatePath(`/admin/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
    return { success: true };
}

export async function getTicketsStats() {
    const supabase = await createClient();

    const { data: tickets } = await supabase
        .from("tickets")
        .select("status");

    const openCount = tickets?.filter(t => t.status === 'open').length || 0;
    const answeredCount = tickets?.filter(t => t.status === 'answered').length || 0;
    const closedCount = tickets?.filter(t => t.status === 'closed').length || 0;

    return { openCount, answeredCount, closedCount, total: tickets?.length || 0 };
}

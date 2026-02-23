"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Schemas de Validação
const ticketIdSchema = z.string().uuid();

const sendReplySchema = z.object({
    ticketId: z.string().uuid(),
    content: z.string().min(1, "Mensagem não pode estar vazia").max(5000),
});

export interface Ticket {
    id: string;
    user_id: string;
    title: string;
    category: string;
    status: "open" | "answered" | "closed";
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

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem ver tickets." };
    }

    const { data: rawTickets, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tickets:", error);
        return { data: null, error: "Erro ao buscar tickets." };
    }

    const data = JSON.parse(JSON.stringify(rawTickets));
    return { data: data as Ticket[], error: null };
}

export async function getAdminTicketDetail(ticketId: string) {
    // 1. Validação Zod
    const validated = ticketIdSchema.safeParse(ticketId);
    if (!validated.success) {
        return { data: null, error: "ID de ticket inválido." };
    }

    const supabase = await createClient();

    // 2. Verificar autorização
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem ver tickets." };
    }

    // 3. Buscar dados
    const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", validated.data)
        .single();

    if (ticketError) {
        return { data: null, error: "Ticket não encontrado." };
    }

    const { data: messages, error: messagesError } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", validated.data)
        .order("created_at", { ascending: true });

    if (messagesError) {
        return { data: null, error: "Erro ao buscar mensagens." };
    }

    const { data: userProfile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", ticket.user_id)
        .single();

    const data = JSON.parse(
        JSON.stringify({
            ticket: ticket as Ticket,
            messages: messages as TicketMessage[],
            userNickname: userProfile?.nickname || "Usuário",
        })
    );

    return {
        data,
        error: null,
    };
}

export async function sendAdminReply(ticketId: string, content: string) {
    // 1. Validação Zod
    const validated = sendReplySchema.safeParse({ ticketId, content });
    if (!validated.success) {
        return { data: null, error: validated.error.issues[0].message };
    }

    const supabase = await createClient();

    // 2. Verificar autorização
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem responder tickets." };
    }

    // 3. Inserir mensagem
    const { error: msgError } = await supabase.from("ticket_messages").insert({
        ticket_id: validated.data.ticketId,
        user_id: user.id,
        content: validated.data.content,
        is_staff: true,
    });

    if (msgError) {
        console.error("Error sending reply:", msgError);
        return { data: null, error: "Erro ao enviar resposta." };
    }

    // 4. Atualizar status
    await supabase.from("tickets").update({ status: "answered" }).eq("id", validated.data.ticketId);

    revalidatePath(`/admin/tickets/${validated.data.ticketId}`);
    revalidatePath("/admin/tickets");
    return { data: { success: true }, error: null };
}

export async function closeTicket(ticketId: string) {
    // 1. Validação Zod
    const validated = ticketIdSchema.safeParse(ticketId);
    if (!validated.success) {
        return { data: null, error: "ID de ticket inválido." };
    }

    const supabase = await createClient();

    // 2. Verificar autorização
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem fechar tickets." };
    }

    // 3. Fechar ticket
    const { error } = await supabase
        .from("tickets")
        .update({ status: "closed" })
        .eq("id", validated.data);

    if (error) {
        return { data: null, error: "Erro ao fechar ticket." };
    }

    revalidatePath(`/admin/tickets/${validated.data}`);
    revalidatePath("/admin/tickets");
    return { data: { success: true }, error: null };
}

export async function getTicketsStats() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem ver estatísticas." };
    }

    const { data: tickets, error } = await supabase.from("tickets").select("status");

    if (error) {
        return { data: null, error: "Erro ao buscar estatísticas." };
    }

    const openCount = tickets?.filter((t) => t.status === "open").length || 0;
    const answeredCount = tickets?.filter((t) => t.status === "answered").length || 0;
    const closedCount = tickets?.filter((t) => t.status === "closed").length || 0;

    const data = JSON.parse(
        JSON.stringify({
            openCount,
            answeredCount,
            closedCount,
            total: tickets?.length || 0,
        })
    );

    return {
        data,
        error: null,
    };
}

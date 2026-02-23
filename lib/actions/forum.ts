"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schemas
const solveThreadSchema = z.object({
    threadId: z.string().uuid(),
    postId: z.string().uuid(),
});

const reportSchema = z.object({
    postId: z.string().uuid(),
    reason: z.string().min(5, "Motivo muito curto").max(500),
});

const updateContentSchema = z.object({
    id: z.string().uuid(),
    content: z.string().min(1, "Conteúdo não pode ser vazio"),
    type: z.enum(["post", "thread"]),
});

export async function solveThread(threadId: string, postId: string) {
    // 1. Validation
    const validated = solveThreadSchema.safeParse({ threadId, postId });
    if (!validated.success) return { data: null, error: "Dados inválidos." };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 2. Auth Check
    if (!user) return { data: null, error: "Não autorizado." };

    // 3. Permission Check (Author or Admin)
    // Fetch thread to check author
    const { data: thread } = await supabase
        .from("forum_threads")
        .select("author_id")
        .eq("id", validated.data.threadId)
        .single();

    if (!thread) return { data: null, error: "Tópico não encontrado." };

    // Check if user is author OR admin
    // For reported 'markAsSolved', usually author can do it.
    if (thread.author_id !== user.id) {
        // Optional: Check admin role here if admins can also solve
        // For now, strict: only author.
        return { data: null, error: "Apenas o autor pode marcar como resolvido." };
    }

    // 4. Mutation
    const { error } = await supabase
        .from("forum_threads")
        .update({ solved_post_id: validated.data.postId })
        .eq("id", validated.data.threadId);

    if (error) {
        console.error("Error marking thread solved:", error);
        return { data: null, error: "Erro ao marcar como resolvido." };
    }

    revalidatePath(`/forum/thread/${validated.data.threadId}`);
    return { data: { success: true }, error: null };
}

export async function reportContent(postId: string, reason: string) {
    const validated = reportSchema.safeParse({ postId, reason });
    if (!validated.success) return { data: null, error: validated.error.issues[0].message };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Entre para denunciar." };

    const { error } = await supabase.from("forum_reports").insert({
        post_id: validated.data.postId,
        reporter_id: user.id,
        reason: validated.data.reason,
        status: "pending",
    });

    if (error) {
        console.error("Error reporting post:", error);
        return { data: null, error: "Erro ao enviar denúncia." };
    }

    return { data: { success: true }, error: null };
}

export async function updateForumContent(id: string, content: string, type: "post" | "thread") {
    const validated = updateContentSchema.safeParse({ id, content, type });
    if (!validated.success) return { data: null, error: "Conteúdo inválido." };

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const table = validated.data.type === "thread" ? "forum_threads" : "forum_posts";

    // Check Author
    const { data: item } = await supabase
        .from(table)
        .select("author_id") // Assuming author_id column exists on both
        .eq("id", validated.data.id)
        .single();

    if (!item) return { data: null, error: "Conteúdo não encontrado." };

    if (item.author_id !== user.id) {
        // Check admin?
        return { data: null, error: "Você não tem permissão para editar isto." };
    }

    const { error } = await supabase
        .from(table)
        .update({
            content: validated.data.content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", validated.data.id);

    if (error) {
        console.error("Error updating content:", error);
        return { data: null, error: "Erro ao atualizar conteúdo." };
    }

    // Revalidate? We don't know the URL exactly without extra query,
    // but usually client handles refresh or we return data.
    return { data: { success: true }, error: null };
}

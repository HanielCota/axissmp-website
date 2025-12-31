'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSchema = z.object({
    slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
    title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
    excerpt: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
    content: z.string().min(20, "Conteúdo deve ter pelo menos 20 caracteres"),
    category: z.enum(["update", "event", "maintenance", "announcement"]),
    author: z.string().default("Admin"),
    image: z.string().optional(),
    date: z.string().optional(), // We can auto-generate or let edit
});

export async function getPosts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return { data: null, error: "Erro ao buscar notícias." };
    }

    return { data, error: null };
}

export async function getPost(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching post:", error);
        return { data: null, error: "Notícia não encontrada." };
    }

    return { data, error: null };
}

export async function createPost(formData: FormData) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autorizado." };

    const rawData = {
        slug: formData.get("slug"),
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author") || "Admin",
        image: formData.get("image"),
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    const validatedFields = postSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Campos inválidos.", details: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("posts")
        .insert(validatedFields.data);

    if (error) {
        console.error("Error creating post:", error);
        return { error: "Erro ao criar notícia. Slug já existe?" };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true };
}

export async function updatePost(originalSlug: string, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        slug: formData.get("slug"), // Allow slug change? Maybe risky but let's allow
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author"),
        image: formData.get("image"),
    };

    const validatedFields = postSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Campos inválidos.", details: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("posts")
        .update(validatedFields.data)
        .eq("slug", originalSlug);

    if (error) {
        console.error("Error updating post:", error);
        return { error: "Erro ao atualizar notícia." };
    }

    revalidatePath("/news");
    revalidatePath(`/news/${validatedFields.data.slug}`);
    revalidatePath("/admin/posts");
    return { success: true };
}

export async function deletePost(slug: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("slug", slug);

    if (error) {
        console.error("Error deleting post:", error);
        return { error: "Erro ao deletar notícia." };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true };
}

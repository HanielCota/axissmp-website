"use server";

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
    date: z.string().optional(),
});

export async function getPosts() {
    const supabase = await createClient();
    const { data: rawPosts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return { data: null, error: "Erro ao buscar notícias." };
    }

    const data = JSON.parse(JSON.stringify(rawPosts));
    return { data, error: null };
}

const slugSchema = z.string().min(3, "Slug inválido");

export async function getPost(slug: string) {
    const validated = slugSchema.safeParse(slug);
    if (!validated.success) return { data: null, error: "Slug inválido." };

    const supabase = await createClient();
    const { data: rawPost, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", validated.data)
        .single();

    if (error) {
        console.error("Error fetching post:", error);
        return { data: null, error: "Notícia não encontrada." };
    }

    const data = JSON.parse(JSON.stringify(rawPost));
    return { data, error: null };
}

export async function createPost(formData: FormData) {
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
        return { data: null, error: "Apenas administradores podem criar notícias." };
    }

    const rawData = {
        slug: formData.get("slug"),
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author") || "Admin",
        image: formData.get("image"),
        date: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
    };

    const validatedFields = postSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { data: null, error: "Campos inválidos." };
    }

    const { error } = await supabase.from("posts").insert(validatedFields.data);

    if (error) {
        console.error("Error creating post:", error);
        return { data: null, error: "Erro ao criar notícia. Slug já existe?" };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { data: { success: true }, error: null };
}

export async function updatePost(originalSlug: string, formData: FormData) {
    const validatedSlug = slugSchema.safeParse(originalSlug);
    if (!validatedSlug.success) return { data: null, error: "Slug original inválido." };

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
        return { data: null, error: "Apenas administradores podem atualizar notícias." };
    }

    const rawData = {
        slug: formData.get("slug"),
        title: formData.get("title"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author"),
        image: formData.get("image"),
    };

    const validatedFields = postSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { data: null, error: "Campos inválidos." };
    }

    const { error } = await supabase
        .from("posts")
        .update(validatedFields.data)
        .eq("slug", validatedSlug.data);

    if (error) {
        console.error("Error updating post:", error);
        return { data: null, error: "Erro ao atualizar notícia." };
    }

    revalidatePath("/news");
    revalidatePath(`/news/${validatedFields.data.slug}`);
    revalidatePath("/admin/posts");
    return { data: { success: true }, error: null };
}

export async function deletePost(slug: string) {
    const validatedSlug = slugSchema.safeParse(slug);
    if (!validatedSlug.success) return { data: null, error: "Slug inválido." };

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
        return { data: null, error: "Apenas administradores podem deletar notícias." };
    }

    const { error } = await supabase.from("posts").delete().eq("slug", validatedSlug.data);

    if (error) {
        console.error("Error deleting post:", error);
        return { data: null, error: "Erro ao deletar notícia." };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { data: { success: true }, error: null };
}

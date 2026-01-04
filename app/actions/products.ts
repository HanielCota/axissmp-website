'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    price: z.coerce.number().min(0, "Preço deve ser positivo"),
    category: z.enum(["vips", "coins", "unban"]),
    color: z.string().default("bg-brand-orange/20"),
    image: z.string().min(1, "Imagem é obrigatória"),
});

export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("price", { ascending: true });

    if (error) {
        console.error("Error fetching products:", error);
        return { data: null, error: "Erro ao buscar produtos." };
    }

    return { data, error: null };
}

const idSchema = z.string().uuid("ID inválido");

export async function getProduct(id: string) {
    const validated = idSchema.safeParse(id);
    if (!validated.success) return { data: null, error: "ID inválido." };

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", validated.data)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return { data: null, error: "Produto não encontrado." };
    }

    return { data, error: null };
}

export async function createProduct(formData: FormData) {
    // ... existing wrapper ...
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem criar produtos." };
    }

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        color: formData.get("color") || "bg-brand-orange/20",
    };

    const validatedFields = productSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { data: null, error: "Campos inválidos." };
    }

    const { error } = await supabase
        .from("products")
        .insert(validatedFields.data);

    if (error) {
        console.error("Error creating product:", error);
        return { data: null, error: "Erro ao criar produto." };
    }

    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { data: { success: true }, error: null };
}

export async function updateProduct(id: string, formData: FormData) {
    const validatedId = idSchema.safeParse(id);
    if (!validatedId.success) return { data: null, error: "ID inválido." };

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem atualizar produtos." };
    }

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        color: formData.get("color"),
    };

    const validatedFields = productSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { data: null, error: "Campos inválidos." };
    }

    const { error } = await supabase
        .from("products")
        .update(validatedFields.data)
        .eq("id", validatedId.data);

    if (error) {
        console.error("Error updating product:", error);
        return { data: null, error: "Erro ao atualizar produto." };
    }

    revalidatePath("/store");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin/products");
    return { data: { success: true }, error: null };
}

export async function deleteProduct(id: string) {
    const validatedId = idSchema.safeParse(id);
    if (!validatedId.success) return { data: null, error: "ID inválido." };

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: null, error: "Apenas administradores podem deletar produtos." };
    }

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", validatedId.data);

    if (error) {
        console.error("Error deleting product:", error);
        return { data: null, error: "Erro ao deletar produto." };
    }

    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { data: { success: true }, error: null };
}

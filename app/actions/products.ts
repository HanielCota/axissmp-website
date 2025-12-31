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

export async function getProduct(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return { data: null, error: "Produto não encontrado." };
    }

    return { data, error: null };
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autorizado." };

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        color: formData.get("color") || "bg-brand-orange/20",
    };

    const validatedFields = productSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { error: "Campos inválidos.", details: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("products")
        .insert(validatedFields.data);

    if (error) {
        console.error("Error creating product:", error);
        return { error: "Erro ao criar produto." };
    }

    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        color: formData.get("color"),
    };

    const validatedFields = productSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { error: "Campos inválidos.", details: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("products")
        .update(validatedFields.data)
        .eq("id", id);

    if (error) {
        console.error("Error updating product:", error);
        return { error: "Erro ao atualizar produto." };
    }

    revalidatePath("/store");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin/products");
    return { success: true };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        return { error: "Erro ao deletar produto." };
    }

    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { success: true };
}

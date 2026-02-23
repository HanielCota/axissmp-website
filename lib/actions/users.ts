"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schemas
const updateRoleSchema = z.object({
    userId: z.string().uuid(),
    newRole: z.enum(["admin", "user", "mod"]),
});

export async function getCurrentUserRole() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Usuário não autenticado." };

    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching user role:", error);
        return { data: null, error: "Erro ao buscar cargo." };
    }

    return { data: { role: data?.role }, error: null };
}

export async function updateUserRole(userId: string, newRole: "admin" | "user" | "mod") {
    // 1. Validation
    const validated = updateRoleSchema.safeParse({ userId, newRole });

    if (!validated.success) {
        return { data: null, error: "Dados inválidos." };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 2. Auth Check
    if (!user) return { data: null, error: "Não autorizado." };

    const { data: currentUserData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // 3. Authorization Check
    if (currentUserData?.role !== "admin") {
        return { data: null, error: "Apenas administradores podem alterar cargos." };
    }

    // 4. Mutation
    const { error } = await supabase
        .from("profiles")
        .update({ role: validated.data.newRole })
        .eq("id", validated.data.userId);

    if (error) {
        console.error("Error updating user role:", error);
        return { data: null, error: "Erro ao atualizar cargo." };
    }

    revalidatePath("/admin/users");
    return { data: { success: true }, error: null };
}

'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCurrentUserRole() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { role: null };

    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching user role:", error);
        return { role: null };
    }

    return { role: data?.role };
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'user' | 'mod') {
    const supabase = await createClient();

    // Verify if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Não autorizado." };

    const { data: currentUserData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentUserData?.role !== 'admin') {
        return { error: "Apenas administradores podem alterar cargos." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

    if (error) {
        console.error("Error updating user role:", error);
        return { error: "Erro ao atualizar cargo." };
    }

    revalidatePath("/admin/users");
    return { success: true };
}

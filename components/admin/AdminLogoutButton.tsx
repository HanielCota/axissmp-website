"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
            <span className="text-sm font-bold">Sair</span>
        </button>
    );
}

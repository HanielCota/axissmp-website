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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
            <span className="font-bold text-sm">Sair</span>
        </button>
    );
}

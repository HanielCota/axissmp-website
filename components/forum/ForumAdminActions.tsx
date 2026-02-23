"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pin, Lock, Trash2, Loader2, Unlock, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ForumAdminActionsProps {
    threadId: string;
    isPinned: boolean;
    isLocked: boolean;
}

export function ForumAdminActions({ threadId, isPinned, isLocked }: ForumAdminActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAction = async (action: "pin" | "lock" | "delete") => {
        setLoading(true);
        try {
            if (action === "delete") {
                const { error } = await supabase.from("forum_threads").delete().eq("id", threadId);

                if (error) throw error;

                toast.success("Tópico excluído.");
                router.push("/forum"); // Go back to forum root or category
                return; // Don't refresh, we navigated away
            }

            if (action === "pin") {
                const { error } = await supabase
                    .from("forum_threads")
                    .update({ is_pinned: !isPinned })
                    .eq("id", threadId);
                if (error) throw error;
                toast.success(isPinned ? "Tópico desafixado." : "Tópico fixado.");
            }

            if (action === "lock") {
                const { error } = await supabase
                    .from("forum_threads")
                    .update({ is_locked: !isLocked })
                    .eq("id", threadId);
                if (error) throw error;
                toast.success(isLocked ? "Tópico reaberto." : "Tópico fechado.");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao executar ação administrativa.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("pin")}
                disabled={loading}
                className={isPinned ? "text-primary border-primary/50" : ""}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPinned ? (
                    <PinOff className="mr-1 h-4 w-4" />
                ) : (
                    <Pin className="mr-1 h-4 w-4" />
                )}
                {isPinned ? "Desafixar" : "Fixar"}
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("lock")}
                disabled={loading}
                className={isLocked ? "text-destructive border-destructive/50" : ""}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isLocked ? (
                    <Unlock className="mr-1 h-4 w-4" />
                ) : (
                    <Lock className="mr-1 h-4 w-4" />
                )}
                {isLocked ? "Abrir" : "Fechar"}
            </Button>

            <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                    // Simple confirm for now
                    if (
                        confirm(
                            "Tem certeza que deseja excluir este tópico? Essa ação não pode ser desfeita."
                        )
                    ) {
                        handleAction("delete");
                    }
                }}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="mr-1 h-4 w-4" />
                )}
                Excluir
            </Button>
        </div>
    );
}

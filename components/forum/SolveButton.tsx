"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { solveThread } from "@/lib/actions/forum";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SolveButtonProps {
    threadId: string;
    postId: string;
}

export function SolveButton({ threadId, postId }: SolveButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSolve = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await solveThread(threadId, postId);

            if (error) {
                toast.error(error);
                return;
            }

            if (data?.success) {
                toast.success("Tópico marcado como resolvido!");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSolve}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-green-500/20 text-[10px] font-black tracking-wide text-green-500 uppercase hover:bg-green-500/10"
        >
            {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
                <CheckCircle2 className="h-3 w-3" />
            )}
            Marcar como Solução
        </Button>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { reportContent } from "@/lib/actions/forum";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReportButtonProps {
    postId: string;
    variant?: "ghost" | "outline";
    className?: string;
    showIconOnly?: boolean;
}

export function ReportButton({
    postId,
    variant = "ghost",
    className,
    showIconOnly = false,
}: ReportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [open, setOpen] = useState(false);

    const handleReport = async () => {
        if (!reason.trim()) return;
        setIsLoading(true);
        try {
            const { data, error } = await reportContent(postId, reason);

            if (error) {
                toast.error(error);
                return;
            }

            if (data?.success) {
                toast.success("Denúncia enviada com sucesso.");
                setOpen(false);
                setReason("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={className}>
            <Button
                variant={variant}
                size={showIconOnly ? "icon" : "sm"}
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <AlertCircle className="h-4 w-4" />
                {!showIconOnly && (
                    <span className="text-[10px] font-black uppercase">Denunciar</span>
                )}
            </Button>

            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Denunciar Postagem"
                description="Por favor, descreva o motivo da denúncia. Nossa equipe revisará em breve."
                footer={
                    <Button
                        onClick={handleReport}
                        disabled={isLoading || !reason.trim()}
                        className="w-full font-black tracking-widest uppercase"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Denúncia
                    </Button>
                }
            >
                <div className="py-2">
                    <Textarea
                        placeholder="Ex: Spam, Conteúdo Ofensivo, Desrespeito..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-background/50 border-primary/10 min-h-[100px]"
                    />
                </div>
            </Modal>
        </div>
    );
}

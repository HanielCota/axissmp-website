"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2 } from "lucide-react";
import { updateForumContent } from "@/lib/actions/forum";
import { Modal } from "@/components/ui/modal";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditButtonProps {
    postId: string;
    initialContent: string;
    isThread?: boolean;
    showIconOnly?: boolean;
    className?: string;
}

export function EditButton({
    postId,
    initialContent,
    isThread = false,
    showIconOnly = false,
    className,
}: EditButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleEdit = async () => {
        if (!content.trim() || content === initialContent) {
            setOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await updateForumContent(
                postId,
                content,
                isThread ? "thread" : "post"
            );

            if (error) {
                toast.error(error);
                return;
            }

            if (data?.success) {
                toast.success("Editado com sucesso!");
                setOpen(false);
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
        <div className={className}>
            <Button
                variant="ghost"
                size={showIconOnly ? "icon" : "sm"}
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <Edit2 className="h-4 w-4" />
                {!showIconOnly && <span className="text-[10px] font-black uppercase">Editar</span>}
            </Button>

            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Editar Postagem"
                footer={
                    <div className="flex w-full gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 font-black tracking-widest uppercase"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={isLoading || !content.trim() || content === initialContent}
                            className="flex-1 font-black tracking-widest uppercase"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </div>
                }
            >
                <div className="py-2">
                    <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Editar conteúdo..."
                    />
                </div>
            </Modal>
        </div>
    );
}

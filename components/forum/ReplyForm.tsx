"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";

interface ReplyFormProps {
    threadId: string;
}

export function ReplyForm({ threadId }: ReplyFormProps) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Você precisa estar logado para responder.");
                router.push("/login");
                return;
            }

            const { error: postError } = await supabase.from("forum_posts").insert({
                thread_id: threadId,
                user_id: user.id,
                content: content,
            });

            if (postError) throw postError;

            // Update thread timestamp to bump it
            await supabase
                .from("forum_threads")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", threadId);

            setContent("");
            toast.success("Resposta enviada!");
            router.refresh();
        } catch (error) {
            console.error("Error posting reply:", error);
            toast.error("Erro ao enviar resposta.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card/50 border-primary/10 mt-8 space-y-4 rounded-xl border p-6"
        >
            <h3 className="font-outfit text-lg font-bold tracking-tight uppercase">
                Deixe sua resposta
            </h3>

            <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Escreva sua resposta aqui..."
            />

            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    disabled={isLoading || !content.trim()}
                    className="font-bold tracking-wider uppercase"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    Responder
                </Button>
            </div>
        </form>
    );
}

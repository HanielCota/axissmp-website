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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Você precisa estar logado para responder.");
                router.push("/login");
                return;
            }

            const { error: postError } = await supabase
                .from("forum_posts")
                .insert({
                    thread_id: threadId,
                    user_id: user.id,
                    content: content
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-8 bg-card/50 p-6 rounded-xl border border-primary/10">
            <h3 className="text-lg font-bold font-outfit uppercase tracking-tight">Deixe sua resposta</h3>

            <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Escreva sua resposta aqui..."
            />

            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading || !content.trim()} className="font-bold uppercase tracking-wider">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    Responder
                </Button>
            </div>
        </form>
    );
}

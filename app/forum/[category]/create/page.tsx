"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // Label might not exist, check
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Assuming Label exists or I use native label. I'll use native label for safety or create Label. 
// Standard shadcn has Label. I'll stick to a simple div with label for now to avoid blocking.

export default function CreateThreadPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Get user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Você precisa estar logado para criar um tópico.");
                router.push("/login");
                return;
            }

            // 2. Get category ID
            const { data: categoryData, error: catError } = await supabase
                .from("forum_categories")
                .select("id")
                .eq("slug", category)
                .single();

            if (catError || !categoryData) {
                toast.error("Categoria não encontrada.");
                return;
            }

            // 3. Create Thread
            const { data: threadData, error: threadError } = await supabase
                .from("forum_threads")
                .insert({
                    title,
                    content, // Initial content used for preview? Or should we create a post too?
                    // My schema puts content in thread for initial post usually, or keeps them separate.
                    // My schema: `content` IN `forum_threads`. Good.
                    category_id: categoryData.id,
                    user_id: user.id
                })
                .select()
                .single();

            if (threadError) throw threadError;

            // 4. Create Initial Post (Optional, but good for consistent "everything is a post" model, but my schema has content in thread too. 
            // Let's also create a post record if we want responses to be uniform, OR just render thread content as the first post.
            // My schema has `forum_posts` pointing to `forum_threads`.
            // Let's insert into `forum_posts` as well so it appears in the list of replies? 
            // Or better: Treat the Thread entry as the "OP" and `forum_posts` as replies.
            // I will stick to Thread = OP.

            toast.success("Tópico criado com sucesso!");
            router.push(`/forum/thread/${threadData.id}`);
            router.refresh();

        } catch (error) {
            console.error("Error creating thread:", error);
            toast.error("Erro ao criar tópico. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Criar Novo Tópico</CardTitle>
                    <CardDescription>
                        Compartilhe suas ideias ou dúvidas com a comunidade.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Título do Tópico
                            </label>
                            <Input
                                id="title"
                                placeholder="Ex: Sugestão para o servidor..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                minLength={5}
                                maxLength={100}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium">
                                Conteúdo
                            </label>
                            <Textarea
                                id="content"
                                placeholder="Escreva sua mensagem aqui..."
                                className="min-h-[200px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                minLength={10}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    "Publicar Tópico"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

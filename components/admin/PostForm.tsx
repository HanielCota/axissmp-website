"use client";

import { createPost, updatePost, getPost } from "@/lib/actions/posts";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Eye, Edit3 } from "lucide-react";
import Link from "next/link";
// Using react-markdown if available would be great for preview, but sticking to basics for now to avoid dependency issues.
// We will just have a textarea.

interface PostFormProps {
    slugParam: string; // "new" or actual slug
}

export default function PostForm({ slugParam }: PostFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(slugParam !== "new");

    // Form states
    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("update");
    const [author, setAuthor] = useState("Admin");
    const [image, setImage] = useState("");

    // Preview mode
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (slugParam !== "new") {
            const fetchPost = async () => {
                const { data, error } = await getPost(decodeURIComponent(slugParam));
                if (error) {
                    toast.error(error);
                    router.push("/admin/posts");
                    return;
                }
                if (data) {
                    setSlug(data.slug);
                    setTitle(data.title);
                    setExcerpt(data.excerpt);
                    setContent(data.content);
                    setCategory(data.category);
                    setAuthor(data.author);
                    setImage(data.image || "");
                }
                setLoading(false);
            };
            fetchPost();
        }
    }, [slugParam, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("slug", slug);
        formData.set("title", title);
        formData.set("excerpt", excerpt);
        formData.set("content", content);
        formData.set("category", category);
        formData.set("author", author);
        formData.set("image", image);

        startTransition(async () => {
            const result =
                slugParam === "new"
                    ? await createPost(formData)
                    : await updatePost(slugParam, formData);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success(slugParam === "new" ? "Notícia criada!" : "Notícia atualizada!");
            router.push("/admin/posts");
            router.refresh();
        });
    };

    // Auto-generate slug from title if new and slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (slugParam === "new" && !slug) {
            setSlug(
                val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
            );
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="text-brand-orange animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-4xl duration-500">
            <Link
                href="/admin/posts"
                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-white"
            >
                <ArrowLeft size={16} />
                Voltar para Notícias
            </Link>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight uppercase italic">
                        {slugParam === "new" ? "Nova Notícia" : "Editar Notícia"}
                    </h2>
                    <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(false)}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all ${!previewMode ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"}`}
                        >
                            Editar
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Título
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                                placeholder="Título da notícia"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Slug (URL)
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                readOnly={slugParam !== "new"} // Maybe allow edit but warn? Sticking to readonly for edit to avoid dead links
                                className={`focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none ${slugParam !== "new" ? "cursor-not-allowed opacity-50" : ""}`}
                                placeholder="titulo-da-noticia"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Categoria
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="focus:border-brand-orange focus:ring-brand-orange w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
                            >
                                <option value="update">Update</option>
                                <option value="event">Evento</option>
                                <option value="maintenance">Manutenção</option>
                                <option value="announcement">Anúncio</option>
                            </select>
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Autor
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                            />
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Imagem Capa (URL)
                            </label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                            Resumo
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            required
                            rows={2}
                            className="focus:border-brand-orange focus:ring-brand-orange w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                            placeholder="Um breve resumo que aparecerá nos cards..."
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                            Conteúdo (Markdown)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={15}
                            className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm text-white/80 transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                            placeholder="# Título Principal&#10;&#10;Seu texto aqui. **Negrito**, *itálico*, etc."
                        />
                        <p className="text-xs text-white/20">Suporta formatação Markdown básica.</p>
                    </div>

                    <div className="flex justify-end border-t border-white/10 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-brand-orange text-brand-dark flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-black uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {slugParam === "new" ? "Publicar Notícia" : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

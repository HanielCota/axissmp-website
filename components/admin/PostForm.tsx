"use client";

import { createPost, updatePost, getPost } from "@/app/actions/posts";
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
            const result = slugParam === "new"
                ? await createPost(formData)
                : await updatePost(slugParam, formData);

            if (result.error) {
                toast.error(result.error);
                if (result.details) {
                    console.error(result.details);
                }
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
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-brand-orange" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/admin/posts"
                className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Voltar para Notícias
            </Link>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">
                        {slugParam === "new" ? "Nova Notícia" : "Editar Notícia"}
                    </h2>
                    <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(false)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${!previewMode ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                        >
                            Editar
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="Título da notícia"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Slug (URL)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                readOnly={slugParam !== "new"} // Maybe allow edit but warn? Sticking to readonly for edit to avoid dead links
                                className={`w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all ${slugParam !== "new" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="titulo-da-noticia"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all appearance-none cursor-pointer"
                            >
                                <option value="update">Update</option>
                                <option value="event">Evento</option>
                                <option value="maintenance">Manutenção</option>
                                <option value="announcement">Anúncio</option>
                            </select>
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Autor</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                            />
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Imagem Capa (URL)</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Resumo</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            required
                            rows={2}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all resize-none"
                            placeholder="Um breve resumo que aparecerá nos cards..."
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Conteúdo (Markdown)</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={15}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-mono text-white/80 placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                            placeholder="# Título Principal&#10;&#10;Seu texto aqui. **Negrito**, *itálico*, etc."
                        />
                        <p className="text-xs text-white/20">Suporta formatação Markdown básica.</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-3 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {slugParam === "new" ? "Publicar Notícia" : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

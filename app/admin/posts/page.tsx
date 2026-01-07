import { getPosts } from "@/app/actions/posts";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { Post } from "@/components/landing/NewsSection";

export default async function AdminPostsPage() {
    const { data: posts } = await getPosts();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Notícias</h2>
                    <p className="text-white/40 font-medium">Gerencie atualizações e avisos do servidor.</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    Nova Notícia
                </Link>
            </div>

            <div className="rounded-3xl border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs font-black uppercase tracking-widest text-white/40">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Autor</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts?.map((post: Post) => (
                                <tr key={post.slug} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold line-clamp-1 max-w-sm">{post.title}</div>
                                        <div className="text-xs text-white/40 font-mono mt-1">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border bg-white/5 border-white/10 text-white/60">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/70">
                                        {post.author}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/70">
                                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.slug}`}
                                                className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <DeletePostButton slug={post.slug} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!posts || posts.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/20">
                                        Nenhuma notícia encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

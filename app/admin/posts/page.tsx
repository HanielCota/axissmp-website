import { getPosts } from "@/lib/actions/posts";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { Post } from "@/components/landing/NewsSection";

export default async function AdminPostsPage() {
    const { data: posts } = await getPosts();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase italic">
                        Notícias
                    </h2>
                    <p className="font-medium text-white/40">
                        Gerencie atualizações e avisos do servidor.
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="bg-brand-orange text-brand-dark flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black uppercase transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    Nova Notícia
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-white/5 text-xs font-black tracking-widest text-white/40 uppercase">
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
                                <tr
                                    key={post.slug}
                                    className="group transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="line-clamp-1 max-w-sm font-bold">
                                            {post.title}
                                        </div>
                                        <div className="mt-1 font-mono text-xs text-white/40">
                                            {post.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-bold text-white/60 uppercase">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/70">
                                        {post.author}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/70">
                                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.slug}`}
                                                className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
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
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-white/20"
                                    >
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

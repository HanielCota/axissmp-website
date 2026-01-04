"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    created_at: string;
    image?: string;
}

interface NewsSectionProps {
    posts: Post[];
}

export function NewsSection({ posts }: NewsSectionProps) {
    if (!posts.length) return null;

    return (
        <section className="py-32 relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full px-4 py-1.5">
                            <Zap size={14} className="text-brand-orange" fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Novidades</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
                            FIQUE POR <br /> <span className="text-brand-orange">DENTRO</span>
                        </h2>
                    </div>
                    <Link
                        href="/news"
                        className="group flex items-center gap-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-white/10 rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-wider transition-all text-slate-900 dark:text-white"
                    >
                        Ver todas as notícias
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.slice(0, 3).map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-slate-200 dark:hover:border-white/20 transition-colors shadow-sm hover:shadow-md"
                        >
                            <Link href={`/news/${post.slug}`} className="relative h-64 overflow-hidden">
                                <Image
                                    src={post.image || "/images/site/render.jpg"}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-brand-orange text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <User size={12} />
                                        {post.author}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 group-hover:text-brand-orange transition-colors text-slate-900 dark:text-white">
                                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed mb-8 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <Link
                                        href={`/news/${post.slug}`}
                                        className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group/btn"
                                    >
                                        Ler matéria completa
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

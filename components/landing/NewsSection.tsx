"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface Post {
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
        <section className="relative overflow-hidden bg-white py-32 dark:bg-[#0a0a0a]">
            {/* Background elements */}
            <div className="bg-brand-orange/5 pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
                <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-1.5 dark:border-white/10 dark:bg-white/5">
                            <Zap size={14} className="text-brand-orange" fill="currentColor" />
                            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-white/60">
                                Novidades
                            </span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic md:text-6xl dark:text-white">
                            FIQUE POR <br /> <span className="text-brand-orange">DENTRO</span>
                        </h2>
                    </div>
                    <Link
                        href="/news"
                        className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-8 py-4 text-sm font-black tracking-wider text-slate-900 uppercase transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                        Ver todas as notícias
                        <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {posts.slice(0, 3).map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-colors hover:border-slate-200 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                        >
                            <Link
                                href={`/news/${post.slug}`}
                                className="relative h-64 overflow-hidden"
                            >
                                <Image
                                    src={post.image || "/images/site/render.jpg"}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-brand-orange rounded-lg px-3 py-1 text-[10px] font-black tracking-widest text-black uppercase">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="flex flex-1 flex-col p-8">
                                <div className="mb-4 flex items-center gap-4 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-white/40">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <User size={12} />
                                        {post.author}
                                    </span>
                                </div>
                                <h3 className="group-hover:text-brand-orange mb-4 text-2xl font-black tracking-tighter text-slate-900 uppercase italic transition-colors dark:text-white">
                                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="mb-8 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-white/60">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <Link
                                        href={`/news/${post.slug}`}
                                        className="group/btn flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
                                    >
                                        Ler matéria completa
                                        <ArrowRight
                                            size={14}
                                            className="transition-transform group-hover/btn:translate-x-1"
                                        />
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

"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { wikiData, WikiSlug } from "@/constants/wiki-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";

import ReactMarkdown from "react-markdown";

export default function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const data = wikiData[slug as WikiSlug];

    if (!data) {
        notFound();
    }

    const Icon = data.icon;

    return (
        <main className="bg-background relative min-h-screen">
            <Navbar />

            {/* Header Background */}
            <div className="bg-brand-dark/5 absolute top-0 left-0 -z-10 h-[400px] w-full overflow-hidden">
                <div
                    className={`absolute top-0 right-0 h-[600px] w-[600px] ${data.bg.replace("/10", "/20")} translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]`}
                />
                <div className="bg-noise absolute top-0 left-0 h-full w-full opacity-[0.05]" />
            </div>

            <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-8">
                {/* Breadcrumb & Navigation */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <Link
                        href="/wiki"
                        className="text-brand-dark/50 hover:text-brand-orange inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-colors"
                    >
                        <ChevronLeft size={16} /> Voltar para Wiki
                    </Link>

                    {/* Quick Search */}
                    <div className="relative">
                        <Search
                            className="text-brand-dark/40 absolute top-1/2 left-3 -translate-y-1/2"
                            size={16}
                        />
                        <Input
                            placeholder="Buscar tópicos..."
                            className="border-brand-dark/10 focus-visible:ring-brand-orange/50 h-10 w-full rounded-full bg-white/50 pl-9 md:w-64"
                        />
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
                    {/* Sidebar Navigation */}
                    <aside className="hidden space-y-8 lg:block">
                        <div className="border-brand-dark/5 custom-scrollbar sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl border bg-white p-6 shadow-sm">
                            <h3 className="text-brand-dark mb-4 px-2 font-bold">Categorias</h3>
                            <nav className="space-y-1">
                                {Object.entries(wikiData).map(([key, item]) => (
                                    <Link
                                        key={key}
                                        href={`/wiki/${key}`}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${key === slug
                                                ? "bg-brand-dark shadow-brand-dark/20 text-white shadow-lg"
                                                : "text-brand-dark/60 hover:bg-brand-dark/5 hover:text-brand-dark"
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        {item.title}
                                        {key === slug && (
                                            <ChevronRight
                                                size={16}
                                                className="ml-auto opacity-50"
                                            />
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <article>
                        {/* Article Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-brand-dark/5 mb-8 rounded-[2.5rem] border bg-white p-8 shadow-sm md:p-12"
                        >
                            <div
                                className={`inline-flex rounded-2xl p-4 ${data.bg} ${data.color} mb-6`}
                            >
                                <Icon size={40} />
                            </div>
                            <h1 className="text-brand-dark mb-4 text-4xl font-black md:text-5xl">
                                {data.title}
                            </h1>
                            <p className="text-brand-dark/60 text-xl leading-relaxed font-medium">
                                {data.description}
                            </p>
                        </motion.div>

                        {/* Article Body */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="border-brand-dark/5 min-h-[500px] rounded-[2.5rem] border bg-white p-8 shadow-sm md:p-12"
                        >
                            <div className="prose prose-lg prose-headings:font-bold prose-headings:text-brand-dark prose-p:text-brand-dark/70 prose-strong:text-brand-dark prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline max-w-none">
                                <ReactMarkdown>{data.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                    </article>
                </div>
            </div>
            <Footer />
        </main>
    );
}

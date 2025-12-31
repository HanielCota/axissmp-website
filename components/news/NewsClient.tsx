"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { NewsCategory } from "@/lib/news-data"; // Keep using this type for consistency
import Link from "next/link";
import { Calendar, ArrowRight, Bell, Tag, Wrench, ShieldAlert, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the shape of post expected by the component (UI model)
export interface UIPost {
    slug: string;
    title: string;
    excerpt: string;
    category: NewsCategory;
    author: string;
    date: string;
    image?: string;
}

interface NewsClientProps {
    initialPosts: UIPost[];
}

const categoryConfig: Record<
    NewsCategory,
    { label: string; color: string; activeColor: string; icon: LucideIcon }
> = {
    update: {
        label: "Atualização",
        color: "text-green-500 bg-green-500/10 border-green-500/20",
        activeColor: "bg-green-500 text-white border-green-500",
        icon: Bell,
    },
    event: {
        label: "Evento",
        color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        activeColor: "bg-purple-500 text-white border-purple-500",
        icon: Tag,
    },
    maintenance: {
        label: "Manutenção",
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        activeColor: "bg-red-500 text-white border-red-500",
        icon: Wrench,
    },
    announcement: {
        label: "Anúncio",
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        activeColor: "bg-blue-500 text-white border-blue-500",
        icon: ShieldAlert,
    },
};

export function NewsClient({ initialPosts }: NewsClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");
    const itemsPerPage = 6;

    // Filter Logic
    const filteredNews = initialPosts.filter((post) => {
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const displayedNews = filteredNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (category: NewsCategory | "all") => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="bg-background relative min-h-screen overflow-hidden">
            {/* Background Elements */}
            <div className="pointer-events-none fixed inset-0">
                <div className="bg-brand-orange/5 absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full blur-[120px]" />
                <div className="bg-brand-blue/5 absolute bottom-[10%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[100px]" />
                <div className="bg-noise absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-[0.03]" />
            </div>

            <Navbar />

            <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-8">
                {/* Header */}
                <div className="mb-12 space-y-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-brand-dark text-5xl font-black tracking-tight md:text-7xl"
                    >
                        NOVIDADES DO <span className="text-brand-orange">AXIS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-brand-dark/60 mx-auto max-w-2xl text-xl font-medium"
                    >
                        Fique por dentro de todas as atualizações, eventos e mudanças no servidor.
                    </motion.p>
                </div>

                {/* Search & Filter Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border-brand-dark/5 mb-12 flex flex-col items-center justify-between gap-6 rounded-3xl border bg-white/50 p-4 backdrop-blur-sm md:flex-row"
                >
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                        <button
                            onClick={() => handleCategoryChange("all")}
                            className={cn(
                                "rounded-full border px-4 py-2 text-sm font-bold transition-all",
                                selectedCategory === "all"
                                    ? "bg-brand-dark border-brand-dark text-white"
                                    : "text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light border-brand-dark/5 bg-white"
                            )}
                        >
                            Todas
                        </button>
                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key as NewsCategory)}
                                className={cn(
                                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all outline-none focus:ring-0 focus:outline-none",
                                    selectedCategory === key
                                        ? config.activeColor
                                        : "text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light border-brand-dark/5 bg-white"
                                )}
                            >
                                {config.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="group relative w-full md:w-80">
                        <Search
                            className="text-brand-dark/30 group-focus-within:text-brand-orange absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Buscar notícias..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border-brand-dark/10 focus:border-brand-orange/50 focus:ring-brand-orange/5 text-brand-dark placeholder:text-brand-dark/30 h-12 w-full rounded-2xl border bg-white pr-4 pl-12 font-medium transition-all focus:ring-4 focus:outline-none"
                        />
                    </div>
                </motion.div>

                {/* News Grid */}
                {displayedNews.length > 0 ? (
                    <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayedNews.map((post, index) => {
                            const CategoryIcon = categoryConfig[post.category].icon;

                            return (
                                <motion.article
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                >
                                    <Link
                                        href={`/news/${post.slug}`}
                                        className="group border-brand-dark/5 hover:shadow-brand-dark/5 flex h-full flex-col rounded-[2rem] border bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    >
                                        {/* Header Meta */}
                                        <div className="mb-6 flex items-center justify-between">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase",
                                                    categoryConfig[post.category].color
                                                )}
                                            >
                                                <CategoryIcon size={12} />
                                                {categoryConfig[post.category].label}
                                            </span>
                                            <span className="text-brand-dark/40 flex items-center gap-1.5 text-sm font-medium">
                                                <Calendar size={14} />
                                                {post.date}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-3">
                                            <h2 className="text-brand-dark group-hover:text-brand-orange text-2xl font-bold transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-brand-dark/60 line-clamp-3 leading-relaxed font-medium">
                                                {post.excerpt}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="border-brand-dark/5 mt-8 flex items-center justify-between border-t pt-6">
                                            <div className="text-brand-dark/30 text-sm font-bold">
                                                Por: {post.author}
                                            </div>
                                            <div className="bg-brand-light text-brand-dark/40 group-hover:bg-brand-orange flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:text-white">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="bg-brand-dark/5 text-brand-dark/20 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                            <Search size={40} />
                        </div>
                        <h3 className="text-brand-dark text-xl font-bold">
                            Nenhum resultado encontrado
                        </h3>
                        <p className="text-brand-dark/50">
                            Tente buscar por outros termos ou mude a categoria.
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-brand-dark/10 text-brand-dark hover:bg-brand-light rounded-xl border bg-white px-6 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-brand-dark/50 flex items-center px-4 font-bold">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="border-brand-dark/10 text-brand-dark hover:bg-brand-light rounded-xl border bg-white px-6 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

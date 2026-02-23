"use client";

import { motion } from "framer-motion";
import {
    Search,
    BookOpen,
    Shield,
    HandCoins,
    Zap,
    Map,
    Swords,
    Crown,
    ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const categories = [
    {
        title: "Primeiros Passos",
        description: "Tudo o que você precisa saber para começar sua jornada.",
        icon: Map,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "group-hover:border-blue-500/50",
        grid: "md:col-span-2",
        slug: "primeiros-passos",
    },
    {
        title: "Economia",
        description: "Lojas, mercado, leilões e como ficar rico.",
        icon: HandCoins,
        color: "text-brand-orange",
        bg: "bg-brand-orange/10",
        border: "group-hover:border-brand-orange/50",
        grid: "md:col-span-1 md:row-span-2",
        slug: "economia",
    },
    {
        title: "Proteção",
        description: "Proteja seus terrenos, crie clans e defenda sua base.",
        icon: Shield,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "group-hover:border-green-500/50",
        grid: "md:col-span-1",
        slug: "protecao",
    },
    {
        title: "Skills e Jobs",
        description: "Domine o McMMO e escolha sua profissão.",
        icon: BookOpen,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "group-hover:border-purple-500/50",
        grid: "md:col-span-1",
        slug: "skills-jobs",
    },
    {
        title: "PvP e Guerra",
        description: "Arenas, eventos de PvP e sistemas de combate.",
        icon: Swords,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "group-hover:border-red-500/50",
        grid: "md:col-span-1",
        slug: "pvp-guerra",
    },
    {
        title: "VIPs",
        description: "Vantagens exclusivas para apoiadores do servidor.",
        icon: Crown,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "group-hover:border-yellow-500/50",
        grid: "md:col-span-2",
        slug: "vips",
    },
];

const popularArticles = [
    "Como criar um terreno",
    "Comandos básicos",
    "Como ganhar dinheiro rápido",
    "Sistema de Pets",
    "Regras de Construção",
];

export default function WikiPage() {
    return (
        <main className="bg-background relative min-h-screen overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="pointer-events-none fixed inset-0">
                <div className="bg-brand-blue/5 dark:bg-brand-blue/10 absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full blur-[120px]" />
                <div className="bg-brand-orange/5 dark:bg-brand-orange/10 absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-slate-900/5 opacity-[0.03] dark:bg-white/5" />
            </div>

            <Navbar />

            <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-8">
                {/* Hero / Search */}
                <div className="relative z-10 mb-20 space-y-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-brand-dark/10 text-brand-dark/80 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold dark:bg-white/10 dark:text-white/80"
                    >
                        <Zap size={16} className="text-brand-orange" fill="currentColor" />
                        BASE DE CONHECIMENTO
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-brand-dark text-5xl font-black tracking-tight md:text-7xl dark:text-white"
                    >
                        COMO PODEMOS <br /> <span className="text-brand-orange">AJUDAR?</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative mx-auto max-w-2xl"
                    >
                        <div className="bg-brand-dark/5 group-hover:bg-brand-blue/20 absolute inset-0 rounded-full blur-xl transition-all duration-500 dark:bg-white/5" />
                        <div className="shadow-brand-dark/5 border-brand-dark/10 focus-within:border-brand-blue/50 dark:focus-within:border-brand-blue/50 relative flex items-center rounded-2xl border bg-white p-2 shadow-xl transition-all dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <Search
                                className="text-brand-dark/60 ml-4 dark:text-white/60"
                                size={24}
                            />
                            <Input
                                placeholder="Pesquise por comandos, itens, regras..."
                                className="placeholder:text-brand-dark/50 text-brand-dark h-14 border-none bg-transparent text-lg shadow-none focus-visible:ring-0 dark:text-white dark:placeholder:text-white/50"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <span className="text-brand-dark/50 text-xs font-bold tracking-widest uppercase dark:text-white/50">
                            Em Alta
                        </span>
                        <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                            {popularArticles.map((article, index) => (
                                <motion.a
                                    key={article}
                                    href="#"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="border-brand-dark/10 text-brand-dark/80 hover:text-brand-orange dark:hover:text-brand-orange hover:border-brand-orange/30 dark:hover:border-brand-orange/30 hover:shadow-brand-orange/5 dark:hover:shadow-brand-orange/10 group flex items-center gap-2 rounded-full border bg-white/50 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:shadow-none"
                                >
                                    <span className="bg-brand-dark/30 group-hover:bg-brand-orange h-1.5 w-1.5 rounded-full transition-colors dark:bg-white/30" />
                                    {article}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Categories Grid */}
                <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
                    {categories.map((category, index) => (
                        <motion.a
                            key={category.title}
                            href={`/wiki/${category.slug}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className={`group border-brand-dark/5 hover:shadow-brand-dark/5 relative overflow-hidden rounded-3xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none ${category.border} ${category.grid}`}
                        >
                            <div
                                className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 scale-150 transform p-8 opacity-10 transition-opacity group-hover:opacity-20`}
                            >
                                <category.icon size={120} className={category.color} />
                            </div>

                            <div
                                className={`h-14 w-14 rounded-2xl ${category.bg} flex items-center justify-center ${category.color} mb-6 transition-transform duration-300 group-hover:scale-110`}
                            >
                                <category.icon size={28} />
                            </div>

                            <h3 className="text-brand-dark group-hover:text-brand-blue mb-2 text-2xl font-bold transition-colors dark:text-white">
                                {category.title}
                            </h3>
                            <p className="text-brand-dark/80 mb-6 leading-relaxed font-medium dark:text-white/70">
                                {category.description}
                            </p>

                            <div className="text-brand-dark/60 group-hover:text-brand-blue flex items-center gap-2 text-sm font-bold transition-colors dark:text-white/60">
                                VER ARTIGOS <ChevronRight size={16} />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Help Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-brand-dark relative mt-20 overflow-hidden rounded-3xl p-8 text-center text-white md:p-12"
                >
                    <div className="bg-brand-orange/20 absolute top-0 right-0 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px]" />
                    <div className="bg-brand-blue/20 absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 rounded-full blur-[80px]" />

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl font-black md:text-4xl">Ainda com dúvidas?</h2>
                        <p className="mx-auto max-w-2xl text-lg text-white/80">
                            Nossa equipe de suporte está sempre disponível para ajudar. Entre em
                            nosso Discord e abra um ticket.
                        </p>
                        <a
                            href="https://discord.gg/axissmp"
                            target="_blank"
                            className="text-brand-dark mt-4 inline-flex rounded-xl bg-white px-8 py-4 text-lg font-black transition-transform hover:scale-105"
                        >
                            ENTRAR NO DISCORD
                        </a>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}

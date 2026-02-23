"use client";

import { motion } from "framer-motion";
import { Shield, Swords, Users, Zap, Coins, Map } from "lucide-react";

const features = [
    {
        title: "Economia Real",
        description:
            "Sistema de economia balanceado com lojas físicas, leilões e mercado dinâmico.",
        icon: Coins,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
    {
        title: "Proteção de Terrenos",
        description:
            "Sistema intuitivo para proteger suas construções e gerenciar permissões de amigos.",
        icon: Shield,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "PvP & Eventos",
        description: "Arenas exclusivas, eventos semanais e sistemas de combate aprimorados.",
        icon: Swords,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    {
        title: "Comunidade Ativa",
        description: "Staff presente, discord organizado e jogadores que amam o que fazem.",
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        title: "Exploração",
        description: "Mapa vasto com biomas personalizados e masmorras secretas para explorar.",
        icon: Map,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "Performance",
        description: "Hardware de ponta para garantir 20 TPS constantes e zero lag para você.",
        icon: Zap,
        color: "text-brand-orange",
        bg: "bg-brand-orange/10",
    },
];

export function AboutSection() {
    return (
        <section className="dark:bg-background relative overflow-hidden bg-slate-50 py-32">
            {/* Background elements */}
            <div className="bg-brand-blue/5 pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
                <div className="mx-auto mb-20 max-w-3xl space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 dark:border-white/10 dark:bg-white/5">
                        <Users size={14} className="text-brand-orange" fill="currentColor" />
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-white/60">
                            Sobre o Servidor
                        </span>
                    </div>
                    <h2 className="text-4xl leading-none font-black tracking-tighter text-slate-900 uppercase italic md:text-7xl dark:text-white">
                        MUITO ALÉM DE UM <br />{" "}
                        <span className="text-brand-orange">SIMPLES SURVIVAL</span>
                    </h2>
                    <p className="text-lg leading-relaxed font-medium text-slate-600 dark:text-white/70">
                        No AxisSMP, buscamos criar a experiência definitiva de sobrevivência.
                        Combinamos o vanilla clássico com os melhores plugins para garantir diversão
                        infinita.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:border-slate-200 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                        >
                            <div
                                className={`h-16 w-16 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-8 transition-transform duration-500 group-hover:scale-110`}
                            >
                                <feature.icon size={32} />
                            </div>
                            <h3 className="group-hover:text-brand-orange mb-4 text-2xl font-black tracking-tighter text-slate-900 uppercase italic transition-colors dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed font-medium text-slate-600 dark:text-white/60">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

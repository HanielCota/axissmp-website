"use client";

import { motion } from "framer-motion";
import { Shield, Swords, Users, Zap, Coins, Map } from "lucide-react";

const features = [
    {
        title: "Economia Real",
        description: "Sistema de economia balanceado com lojas físicas, leilões e mercado dinâmico.",
        icon: Coins,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        title: "Proteção de Terrenos",
        description: "Sistema intuitivo para proteger suas construções e gerenciar permissões de amigos.",
        icon: Shield,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "PvP & Eventos",
        description: "Arenas exclusivas, eventos semanais e sistemas de combate aprimorados.",
        icon: Swords,
        color: "text-red-500",
        bg: "bg-red-500/10"
    },
    {
        title: "Comunidade Ativa",
        description: "Staff presente, discord organizado e jogadores que amam o que fazem.",
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "Exploração",
        description: "Mapa vasto com biomas personalizados e masmorras secretas para explorar.",
        icon: Map,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "Performance",
        description: "Hardware de ponta para garantir 20 TPS constantes e zero lag para você.",
        icon: Zap,
        color: "text-brand-orange",
        bg: "bg-brand-orange/10"
    }
];

export function AboutSection() {
    return (
        <section className="py-32 relative bg-slate-50 dark:bg-background overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-1.5">
                        <Users size={14} className="text-brand-orange" fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">Sobre o Servidor</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
                        MUITO ALÉM DE UM <br /> <span className="text-brand-orange">SIMPLES SURVIVAL</span>
                    </h2>
                    <p className="text-slate-600 dark:text-white/70 text-lg font-medium leading-relaxed">
                        No AxisSMP, buscamos criar a experiência definitiva de sobrevivência. Combinamos o vanilla clássico com os melhores plugins para garantir diversão infinita.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group p-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] hover:border-slate-200 dark:hover:border-white/20 transition-all duration-500 shadow-sm hover:shadow-md"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

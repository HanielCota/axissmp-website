"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, AlertTriangle, MessageSquare, Heart, Ban, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const allowedRules = [
    {
        title: "Respeito e Comunidade",
        description:
            "Trate todos os jogadores e staff com respeito. Mantenha um ambiente amigável e acolhedor para todos.",
        icon: Heart,
    },
    {
        title: "Fair Play",
        description:
            "Jogue limpo. O uso de mods que apenas melhoram a performance ou estética é permitido.",
        icon: Shield,
    },
    {
        title: "Reportar Bugs",
        description:
            "Encontrou um erro? Reporte imediatamente à staff. O abuso de bugs para vantagem própria é proibido.",
        icon: AlertTriangle,
    },
    {
        title: "Comércio Justo",
        description:
            "Negocie itens e serviços de forma honesta. Golpes e fraudes não são tolerados.",
        icon: MessageSquare,
    },
];

const prohibitedRules = [
    {
        title: "Cheating e Hacks",
        description:
            "O uso de qualquer cliente alternativo (hacks), macros ou automações que dêem vantagem desleal é estritamente proibido.",
        icon: Ban,
    },
    {
        title: "Divulgação",
        description:
            "Não divulgue outros servidores, canais ou links suspeitos no chat global ou privado.",
        icon: MessageSquare,
    },
    {
        title: "Discurso de Ódio",
        description:
            "Racismo, homofobia, sexismo ou qualquer forma de discriminação resultará em banimento imediato.",
        icon: Gavel,
    },
    {
        title: "Griefing Desnecessário",
        description:
            "A destruição massiva de mapas ou construções de outros jogadores sem contexto de guerra/pvp permitido.",
        icon: X,
    },
];

export default function RulesPage() {
    return (
        <main className="bg-background relative min-h-screen overflow-hidden">
            {/* Background Elements */}
            <div className="pointer-events-none fixed inset-0">
                <div className="bg-brand-orange/10 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
                <div className="bg-brand-blue/10 absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full blur-[100px]" />
                <div className="bg-noise absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-[0.03]" />
            </div>

            <Navbar />

            <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-8">
                {/* Header */}
                <div className="mb-20 space-y-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-brand-dark text-5xl font-black tracking-tight md:text-7xl"
                    >
                        REGRAS DO <span className="text-brand-orange">AXIS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-brand-dark/60 mx-auto max-w-2xl text-xl font-medium"
                    >
                        A transparência é a chave. Entenda o que faz nossa comunidade girar e o que
                        a mantém segura para todos.
                    </motion.p>
                </div>

                {/* Content Split */}
                <div className="grid gap-8 md:grid-cols-2 md:gap-16">
                    {/* Allowed Column */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 flex items-center gap-4"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                                <Check size={24} strokeWidth={3} />
                            </div>
                            <h2 className="text-brand-dark text-3xl font-bold">Permitido</h2>
                        </motion.div>

                        <div className="space-y-4">
                            {allowedRules.map((rule, index) => (
                                <motion.div
                                    key={rule.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="group border-brand-dark/5 relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/5"
                                >
                                    <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-green-500 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="flex gap-4">
                                        <div className="bg-brand-light text-brand-dark/40 flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-green-50 group-hover:text-green-600">
                                            <rule.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-brand-dark mb-1 text-lg font-bold transition-colors group-hover:text-green-700">
                                                {rule.title}
                                            </h3>
                                            <p className="text-brand-dark/60 text-sm leading-relaxed font-medium">
                                                {rule.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Prohibited Column */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 flex items-center gap-4"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                                <X size={24} strokeWidth={3} />
                            </div>
                            <h2 className="text-brand-dark text-3xl font-bold">Proibido</h2>
                        </motion.div>

                        <div className="space-y-4">
                            {prohibitedRules.map((rule, index) => (
                                <motion.div
                                    key={rule.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="group border-brand-dark/5 relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/5"
                                >
                                    <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-red-500 opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="flex gap-4">
                                        <div className="bg-brand-light text-brand-dark/40 flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                                            <rule.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-brand-dark mb-1 text-lg font-bold transition-colors group-hover:text-red-700">
                                                {rule.title}
                                            </h3>
                                            <p className="text-brand-dark/60 text-sm leading-relaxed font-medium">
                                                {rule.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-brand-dark shadow-brand-dark/5 relative mt-20 overflow-hidden rounded-3xl p-8 text-center shadow-2xl md:p-12"
                >
                    {/* Top Gradient Line */}
                    <div className="from-brand-orange to-brand-blue absolute top-0 left-0 h-1 w-full bg-gradient-to-r via-white opacity-50" />

                    {/* Background Glow */}
                    <div className="bg-brand-orange/10 pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

                    <div className="relative z-10 mx-auto max-w-3xl space-y-6">
                        <div className="mb-2 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
                            <Shield className="text-brand-orange h-6 w-6" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tight text-white">
                                Termos de Responsabilidade
                            </h3>
                            <p className="text-lg leading-relaxed font-medium text-white/70">
                                O desconhecimento das regras{" "}
                                <span className="hover:text-brand-orange text-white transition-colors">
                                    não exime
                                </span>{" "}
                                o jogador de suas responsabilidades. A Staff reserva-se o direito de
                                analisar e julgar situações não previstas, garantindo sempre a
                                harmonia e integridade do servidor.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

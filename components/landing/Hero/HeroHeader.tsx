"use client";

import { Zap, Copy, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { SERVER_IP } from "@/lib/constants";

interface HeroHeaderProps {
    itemVariants: Variants;
}

export function HeroHeader({ itemVariants }: HeroHeaderProps) {
    const { copied, copyToClipboard } = useCopyToClipboard();

    return (
        <div className="mt-8 flex flex-col items-center space-y-6 text-center md:mt-0">
            <motion.div
                variants={itemVariants}
                className="border-brand-dark/5 dark:border-white/10 text-brand-orange dark:bg-white/5 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-sm"
            >
                <Zap size={12} className="fill-brand-orange" />
                Nova Season 1.21 Disponível
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-brand-dark dark:text-white text-6xl leading-[1.1] font-black tracking-tight md:text-8xl lg:text-9xl"
            >
                A NOVA ERA DO <br />
                <span className="from-brand-orange to-brand-orange animate-text-shimmer bg-gradient-to-r via-amber-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                    SURVIVAL
                </span>
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="text-brand-dark/90 dark:text-white/80 max-w-xl text-lg leading-relaxed font-medium md:text-xl"
            >
                Entre no AxisSMP e experimente um survival único com economia equilibrada, quests
                diárias e uma comunidade que não para de crescer.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex w-full flex-col justify-center gap-4 sm:flex-row"
            >
                <button
                    onClick={() => copyToClipboard(SERVER_IP)}
                    className={cn(
                        "hover:border-brand-orange/30 dark:hover:border-brand-orange/50 group flex items-center gap-3 rounded-full border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 px-8 py-4 shadow-sm transition-all hover:shadow-md active:scale-95",
                        copied && "border-green-500/50 bg-green-50/50 dark:bg-green-500/10"
                    )}
                >
                    <div
                        className={cn(
                            "text-brand-orange flex items-center justify-center transition-transform duration-300",
                            copied ? "scale-110 text-green-500" : "group-hover:scale-110"
                        )}
                    >
                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </div>
                    <span
                        className={cn(
                            "text-brand-dark dark:text-white text-xl font-bold tracking-tight",
                            copied && "text-green-600 dark:text-green-400"
                        )}
                    >
                        {copied ? "IP COPIADO!" : SERVER_IP}
                    </span>
                </button>
            </motion.div>
        </div>
    );
}

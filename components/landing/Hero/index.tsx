"use client";

import { motion, Variants } from "framer-motion";
import { HeroHeader } from "./HeroHeader";
import { ServerStatusCard } from "./ServerStatusCard";
import { WikiCard } from "./WikiCard";
import { StoreCard } from "./StoreCard";
import { DiscordCard } from "./DiscordCard";

export function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50 } },
    };

    return (
        <section className="bg-background bg-noise relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-12 md:px-8">
            {/* Background Effects */}
            <div className="bg-brand-blue/5 pointer-events-none absolute top-0 left-0 h-[500px] w-full rounded-full mix-blend-multiply blur-[120px]" />
            <div className="bg-brand-orange/5 pointer-events-none absolute right-0 bottom-0 h-[500px] w-full rounded-full mix-blend-multiply blur-[120px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="z-10 flex w-full max-w-7xl flex-col gap-12"
            >
                {/* Hero Header */}
                <HeroHeader itemVariants={itemVariants} />

                {/* Bento Grid */}
                <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-6 md:gap-6 lg:grid-cols-12">
                    {/* 1. Server Status */}
                    <ServerStatusCard itemVariants={itemVariants} />

                    {/* 2. Wiki/Docs */}
                    <WikiCard itemVariants={itemVariants} />

                    {/* 3. Store Card (Large) */}
                    <StoreCard itemVariants={itemVariants} />

                    {/* 4. Discord Community */}
                    <DiscordCard itemVariants={itemVariants} />
                </div>
            </motion.div>
        </section>
    );
}

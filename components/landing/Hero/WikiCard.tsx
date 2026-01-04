import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface WikiCardProps {
    itemVariants: Variants;
}

export function WikiCard({ itemVariants }: WikiCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            className="border-brand-dark/5 dark:border-white/10 group hover:border-brand-orange/30 relative col-span-1 overflow-hidden rounded-3xl border bg-white dark:bg-zinc-900 p-6 shadow-sm transition-colors hover:shadow-md md:col-span-3 lg:col-span-4"
        >
            <Link href="/wiki" className="absolute inset-0 z-20" />
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h3 className="text-brand-dark dark:text-white text-xl font-bold">Wiki & Guias</h3>
                    <p className="text-brand-dark/60 dark:text-white/60 mt-1 text-sm">Domine todas as mecânicas.</p>
                </div>
                <BookOpen className="text-brand-dark/40 dark:text-white/40 group-hover:text-brand-orange transition-colors" />
            </div>
        </motion.div>
    );
}

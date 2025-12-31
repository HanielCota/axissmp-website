import Link from "next/link";
import { Gamepad2, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface DiscordCardProps {
    itemVariants: Variants;
}

export function DiscordCard({ itemVariants }: DiscordCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            className="group relative col-span-1 overflow-hidden rounded-3xl bg-[#5865F2] p-8 shadow-xl shadow-[#5865F2]/20 transition-transform hover:scale-[1.01] md:col-span-6 lg:col-span-8"
        >
            <Link
                href="https://discord.gg/axissmp"
                target="_blank"
                className="absolute inset-0 z-20"
            />
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Gamepad2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white">Comunidade Discord</h3>
                        <p className="font-medium text-white/90">
                            Junte-se a mais de 25.000 membros.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-[#5865F2] transition-all group-hover:shadow-lg">
                    Entrar Agora <Zap size={16} className="fill-[#5865F2]" />
                </div>
            </div>
        </motion.div>
    );
}

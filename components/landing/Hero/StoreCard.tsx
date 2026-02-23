import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface StoreCardProps {
    itemVariants: Variants;
}

export function StoreCard({ itemVariants }: StoreCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            className="from-brand-orange group shadow-brand-orange/20 relative col-span-1 overflow-hidden rounded-3xl bg-gradient-to-br to-amber-500 p-8 shadow-xl transition-transform hover:scale-[1.02] md:col-span-6 lg:col-span-4 lg:row-span-2"
        >
            <Link href="/store" className="absolute inset-0 z-20" />

            <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                    <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                        Loja Oficial
                    </span>
                    <h2 className="mt-4 text-4xl leading-tight font-black text-white">
                        ADQUIRA <br /> VIP & ITENS
                    </h2>
                    <p className="mt-2 max-w-[200px] font-medium text-white/90">
                        Suporte o servidor e ganhe vantagens exclusivas.
                    </p>
                </div>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:translate-x-2">
                    <ShoppingBag className="text-brand-orange" />
                </div>
            </div>

            {/* Decor */}
            <ShoppingBag className="absolute -right-6 -bottom-6 z-0 h-56 w-56 rotate-[-15deg] text-white/10 transition-transform duration-500 group-hover:rotate-0" />
        </motion.div>
    );
}

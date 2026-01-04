"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { StoreSidebar } from "@/components/store/StoreSidebar";
import { ProductCard } from "@/components/store/ProductCard";
import { ShoppingCart } from "lucide-react";
import { useCart, formatPrice } from "@/context/CartContext";
import { NicknameModal } from "@/components/store/NicknameModal";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Category } from "@/types/store";
import { createClient } from "@/lib/supabase/client";

interface StoreClientProps {
    products: Product[];
}

export function StoreClient({ products }: StoreClientProps) {
    const [activeCategory, setActiveCategory] = useState<Category>("vips");
    const { totalItems, totalPrice, addToCart, setNickname } = useCart();
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
    const [userNickname, setUserNickname] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.user_metadata?.nickname) {
                setUserNickname(user.user_metadata.nickname);
            }
        });
    }, []);

    const filteredProducts = products.filter(p => p.category === activeCategory);

    const handleCheckoutClick = () => {
        if (userNickname) {
            handleNicknameConfirm(userNickname);
            return;
        }

        setIsNicknameModalOpen(true);
    };

    const handleNicknameConfirm = (nickname: string) => {
        // Save nickname to global context
        setNickname(nickname);

        // Close modal
        setIsNicknameModalOpen(false);

        // Redirect to cart
        router.push("/cart");
    };

    return (
        <main className="min-h-screen bg-brand-light dark:bg-background pb-32">
            {/* Dark Header Background for Contrast */}
            <div className="fixed top-0 left-0 right-0 h-[400px] bg-brand-dark/5 dark:bg-white/5 -z-10" />

            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-32 pb-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Sidebar */}
                    <StoreSidebar
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                    />

                    {/* Right Content */}
                    <div className="flex-1 w-full">
                        {/* Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-2">
                                    Loja do Servidor
                                </h1>
                                <p className="text-brand-dark/60 dark:text-white/60">
                                    Selecione uma categoria e adicione itens ao seu carrinho.
                                </p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={formatPrice(product.price)}
                                        priceNum={product.price}
                                        category={product.category}
                                        color={product.color}
                                        image={product.image}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-brand-dark/10 dark:border-white/10">
                                <p className="text-brand-dark/40 dark:text-white/40 font-bold">Nenhum produto nesta categoria.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Elegant Floating Pill Checkout */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className="fixed bottom-8 right-4 md:right-8 z-40 group"
                    >
                        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl p-2 pr-4 shadow-2xl flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-zinc-900 group-hover:border-slate-300 dark:group-hover:border-white/20">
                            {/* Icon with Counter Badge */}
                            <div className="relative w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange/20 transition-transform group-hover:scale-105 active:scale-95">
                                <ShoppingCart size={22} className="text-white" />
                                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-white dark:border-zinc-900">
                                    {totalItems}
                                </span>
                            </div>

                            {/* Order Info */}
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Seu Carrinho</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleCheckoutClick}
                                className="ml-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black px-6 py-3 rounded-xl transition-all active:scale-95 shadow-xl text-sm whitespace-nowrap"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NicknameModal
                isOpen={isNicknameModalOpen}
                onClose={() => setIsNicknameModalOpen(false)}
                onConfirm={handleNicknameConfirm}
            />
        </main>
    );
}

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

    const filteredProducts = products.filter((p) => p.category === activeCategory);

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
        <main className="bg-brand-light dark:bg-background min-h-screen pb-32">
            {/* Dark Header Background for Contrast */}
            <div className="bg-brand-dark/5 fixed top-0 right-0 left-0 -z-10 h-[400px] dark:bg-white/5" />

            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-12 md:px-6">
                <div className="flex flex-col items-start gap-8 lg:flex-row">
                    {/* Left Sidebar */}
                    <StoreSidebar
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                    />

                    {/* Right Content */}
                    <div className="w-full flex-1">
                        {/* Header */}
                        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <h1 className="text-brand-dark mb-2 text-3xl font-black dark:text-white">
                                    Loja do Servidor
                                </h1>
                                <p className="text-brand-dark/60 dark:text-white/60">
                                    Selecione uma categoria e adicione itens ao seu carrinho.
                                </p>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                            <div className="border-brand-dark/10 rounded-3xl border border-dashed bg-white/50 py-20 text-center dark:border-white/10 dark:bg-zinc-900/50">
                                <p className="text-brand-dark/40 font-bold dark:text-white/40">
                                    Nenhum produto nesta categoria.
                                </p>
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
                        className="group fixed right-4 bottom-8 z-40 md:right-8"
                    >
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-2 pr-4 shadow-2xl backdrop-blur-2xl transition-all group-hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-zinc-900/90 dark:group-hover:border-white/20 dark:hover:bg-zinc-900">
                            {/* Icon with Counter Badge */}
                            <div className="bg-brand-orange shadow-brand-orange/20 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                                <ShoppingCart size={22} className="text-white" />
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-slate-900 text-[10px] font-black text-white shadow-lg dark:border-zinc-900">
                                    {totalItems}
                                </span>
                            </div>

                            {/* Order Info */}
                            <div className="flex flex-col">
                                <span className="mb-1 text-[10px] leading-none font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Seu Carrinho
                                </span>
                                <span className="text-lg leading-none font-black tracking-tight text-slate-900 dark:text-white">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleCheckoutClick}
                                className="ml-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black whitespace-nowrap text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
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

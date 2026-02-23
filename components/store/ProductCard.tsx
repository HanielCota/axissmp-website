"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Info, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { type Product, type Category } from "@/types/store";

interface ProductCardProps {
    id: number;
    name: string;
    description?: string;
    price: string;
    priceNum: number;
    category: Category;
    image?: string;
    color?: string;
    onAddToCart?: (item: Product, quantity: number) => void;
}

export function ProductCard({
    id,
    name,
    description,
    price,
    priceNum,
    category,
    image,
    color = "bg-brand-blue",
    onAddToCart,
}: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => Math.max(1, q - 1));

    const handleAdd = () => {
        if (!onAddToCart) return;

        onAddToCart(
            {
                id,
                name,
                description,
                price: priceNum,
                category,
                image: image || "",
                color,
            },
            quantity
        );

        setAdded(true);
    };

    // Clean up timeout to prevent memory leak
    useEffect(() => {
        if (added) {
            const timer = setTimeout(() => {
                setAdded(false);
                setQuantity(1);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [added]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group border-brand-dark/5 hover:border-brand-blue/30 flex flex-col items-center rounded-2xl border bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
        >
            {/* Image / Icon */}
            <div
                className={cn(
                    "relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-[1.02]",
                    color
                )}
            >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                {image && (
                    <div className="relative h-full w-full scale-125">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-contain drop-shadow-md"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                            quality={100}
                        />
                    </div>
                )}
            </div>

            {/* Info */}
            <h3 className="text-brand-dark mb-1 text-lg leading-tight font-bold dark:text-white">
                {name}
            </h3>
            <p className="text-brand-orange mb-4 text-xl font-black">{price}</p>

            {/* Actions */}
            <div className="mt-auto grid w-full grid-cols-2 gap-2">
                {/* Info Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(true)}
                    className="bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark/50 hover:text-brand-blue h-10 w-full rounded-lg dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
                >
                    <Info size={18} />
                </Button>

                {/* Quantity & Add */}
                <div className="col-span-2 flex items-center gap-2">
                    {category === "coins" && (
                        <div className="bg-brand-dark/5 flex h-10 items-center rounded-lg px-1 dark:bg-white/5">
                            <button
                                onClick={decrement}
                                disabled={added}
                                className="text-brand-dark/50 hover:text-brand-dark flex h-full w-8 items-center justify-center transition-colors disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-brand-dark w-6 text-center text-sm font-bold dark:text-white">
                                {quantity}
                            </span>
                            <button
                                onClick={increment}
                                disabled={added}
                                className="text-brand-dark/50 hover:text-brand-dark flex h-full w-8 items-center justify-center transition-colors disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={handleAdd}
                        disabled={added}
                        className={cn(
                            "h-10 flex-1 rounded-lg font-bold shadow-lg transition-all",
                            added
                                ? "bg-green-500 shadow-green-500/20 hover:bg-green-500"
                                : "bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20"
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {added ? (
                                <motion.div
                                    key="added"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check size={16} />
                                    Adicionado!
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="add"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="rounded-md bg-white/20 p-1">
                                        <ShoppingCart size={14} />
                                    </div>
                                    Adicionar
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {showDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            aria-modal="true"
                            role="dialog"
                            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl md:flex-row"
                        >
                            <button
                                onClick={() => setShowDetails(false)}
                                aria-label="Fechar detalhes do produto"
                                className="absolute top-4 right-4 z-10 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/40 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side - Image */}
                            <div
                                className={cn(
                                    "relative flex min-h-[300px] w-full items-center justify-center overflow-hidden p-8 md:min-h-[500px] md:w-1/2",
                                    color
                                )}
                            >
                                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950/50" />

                                {image && (
                                    <div className="relative flex h-full max-h-[300px] w-full max-w-[300px] items-center justify-center md:max-h-none md:max-w-none">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="relative aspect-square w-full"
                                        >
                                            <Image
                                                src={image}
                                                alt={name}
                                                fill
                                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                quality={100}
                                            />
                                        </motion.div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Details */}
                            <div className="flex w-full flex-col bg-zinc-950/50 p-6 md:w-1/2 md:p-10">
                                <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold tracking-wider text-white/50 uppercase">
                                            {category === "coins"
                                                ? "Moedas"
                                                : category === "vips"
                                                  ? "Vip"
                                                  : "Item"}
                                        </span>
                                    </div>

                                    <h2 className="font-outfit mb-2 text-3xl leading-tight font-black text-white md:text-4xl">
                                        {name}
                                    </h2>
                                    <p className="text-brand-orange mb-8 text-2xl font-black md:text-3xl">
                                        {price}
                                    </p>

                                    <div className="prose prose-invert prose-sm max-w-none space-y-4 leading-relaxed text-zinc-400">
                                        {description ? (
                                            description
                                                .split("\n")
                                                .map((line, i) => <p key={i}>{line}</p>)
                                        ) : (
                                            <p>
                                                Este item incrível irá melhorar sua jornada no
                                                servidor. Adquira agora e receba instantaneamente!
                                            </p>
                                        )}

                                        <ul className="mt-6 grid gap-2">
                                            <li className="flex items-center gap-3 text-zinc-300">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                                    <Check size={14} />
                                                </div>
                                                Entrega Automática
                                            </li>
                                            <li className="flex items-center gap-3 text-zinc-300">
                                                <div className="bg-brand-blue/10 text-brand-blue flex h-6 w-6 items-center justify-center rounded-full">
                                                    <Check size={14} />
                                                </div>
                                                Suporte 24/7
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 border-t border-white/5 pt-6">
                                    <Button
                                        onClick={() => {
                                            handleAdd();
                                            setShowDetails(false);
                                        }}
                                        disabled={added}
                                        className={cn(
                                            "h-14 w-full rounded-xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            added
                                                ? "bg-green-500 text-white shadow-green-500/20 hover:bg-green-600"
                                                : "bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20 text-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {added ? (
                                                <>
                                                    <div className="rounded-full bg-white/20 p-1">
                                                        <Check size={20} />
                                                    </div>
                                                    Adicionado ao Carrinho
                                                </>
                                            ) : (
                                                <>
                                                    <div className="rounded-full bg-white/20 p-1">
                                                        <ShoppingCart size={20} />
                                                    </div>
                                                    Adicionar ao Carrinho
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                    <p className="mt-4 text-center text-xs text-zinc-500">
                                        Ao comprar, você concorda com nossos termos de serviço.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

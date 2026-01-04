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

export function ProductCard({ id, name, description, price, priceNum, category, image, color = "bg-brand-blue", onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const handleAdd = () => {
        if (!onAddToCart) return;

        onAddToCart({
            id,
            name,
            description,
            price: priceNum,
            category,
            image: image || "",
            color
        }, quantity);

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
            className="group bg-white dark:bg-zinc-900 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-brand-dark/5 dark:border-white/10 hover:border-brand-blue/30 transition-all hover:shadow-md"
        >
            {/* Image / Icon */}
            <div className={cn(
                "w-full aspect-square rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500",
                color
            )}>
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {image && (
                    <div className="relative w-full h-full scale-125">
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
            <h3 className="font-bold text-brand-dark dark:text-white text-lg leading-tight mb-1">{name}</h3>
            <p className="font-black text-brand-orange text-xl mb-4">{price}</p>

            {/* Actions */}
            <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                {/* Info Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(true)}
                    className="w-full bg-brand-dark/5 dark:bg-white/5 hover:bg-brand-dark/10 dark:hover:bg-white/10 text-brand-dark/50 dark:text-white/50 hover:text-brand-blue rounded-lg h-10"
                >
                    <Info size={18} />
                </Button>

                {/* Quantity & Add */}
                <div className="col-span-2 flex items-center gap-2">
                    {category === 'coins' && (
                        <div className="flex items-center bg-brand-dark/5 dark:bg-white/5 rounded-lg h-10 px-1">
                            <button
                                onClick={decrement}
                                disabled={added}
                                className="w-8 h-full flex items-center justify-center text-brand-dark/50 dark:text-white/50 hover:text-brand-dark dark:hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-bold text-brand-dark dark:text-white text-sm">{quantity}</span>
                            <button
                                onClick={increment}
                                disabled={added}
                                className="w-8 h-full flex items-center justify-center text-brand-dark/50 dark:text-white/50 hover:text-brand-dark dark:hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={handleAdd}
                        disabled={added}
                        className={cn(
                            "flex-1 font-bold rounded-lg h-10 shadow-lg transition-all",
                            added
                                ? "bg-green-500 hover:bg-green-500 shadow-green-500/20"
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
                                    <div className="bg-white/20 p-1 rounded-md">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            aria-modal="true"
                            role="dialog"
                            className="bg-zinc-950 border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setShowDetails(false)}
                                aria-label="Fechar detalhes do produto"
                                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side - Image */}
                            <div className={cn(
                                "relative w-full md:w-1/2 min-h-[300px] md:min-h-[500px] flex items-center justify-center p-8 overflow-hidden",
                                color
                            )}>
                                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950/50" />

                                {image && (
                                    <div className="relative w-full h-full max-w-[300px] max-h-[300px] md:max-w-none md:max-h-none flex items-center justify-center">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="relative w-full aspect-square"
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
                            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-zinc-950/50">
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider rounded-full">
                                            {category === 'coins' ? 'Moedas' : category === 'vips' ? 'Vip' : 'Item'}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black font-outfit text-white mb-2 leading-tight">
                                        {name}
                                    </h2>
                                    <p className="text-2xl md:text-3xl font-black text-brand-orange mb-8">
                                        {price}
                                    </p>

                                    <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed space-y-4">
                                        {description ? (
                                            description.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))
                                        ) : (
                                            <p>Este item incrível irá melhorar sua jornada no servidor. Adquira agora e receba instantaneamente!</p>
                                        )}

                                        <ul className="grid gap-2 mt-6">
                                            <li className="flex items-center gap-3 text-zinc-300">
                                                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                    <Check size={14} />
                                                </div>
                                                Entrega Automática
                                            </li>
                                            <li className="flex items-center gap-3 text-zinc-300">
                                                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                                    <Check size={14} />
                                                </div>
                                                Suporte 24/7
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <Button
                                        onClick={() => {
                                            handleAdd();
                                            setShowDetails(false);
                                        }}
                                        disabled={added}
                                        className={cn(
                                            "w-full h-14 text-lg font-bold rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            added
                                                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20"
                                                : "bg-brand-blue hover:bg-brand-blue/90 text-white shadow-brand-blue/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {added ? (
                                                <>
                                                    <div className="bg-white/20 p-1 rounded-full"><Check size={20} /></div>
                                                    Adicionado ao Carrinho
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-white/20 p-1 rounded-full"><ShoppingCart size={20} /></div>
                                                    Adicionar ao Carrinho
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                    <p className="text-center text-zinc-500 text-xs mt-4">
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

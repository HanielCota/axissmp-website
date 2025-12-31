"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Info, Check } from "lucide-react";
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
            className="group bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-brand-dark/5 hover:border-brand-blue/30 transition-all hover:shadow-md"
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
            <h3 className="font-bold text-brand-dark text-lg leading-tight mb-1">{name}</h3>
            <p className="font-black text-brand-orange text-xl mb-4">{price}</p>

            {/* Actions */}
            <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                {/* Info Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(true)}
                    className="w-full bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark/50 hover:text-brand-blue rounded-lg h-10"
                >
                    <Info size={18} />
                </Button>

                {/* Quantity & Add */}
                <div className="col-span-2 flex items-center gap-2">
                    {category === 'coins' && (
                        <div className="flex items-center bg-brand-dark/5 rounded-lg h-10 px-1">
                            <button
                                onClick={decrement}
                                disabled={added}
                                className="w-8 h-full flex items-center justify-center text-brand-dark/50 hover:text-brand-dark transition-colors disabled:opacity-50"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-bold text-brand-dark text-sm">{quantity}</span>
                            <button
                                onClick={increment}
                                disabled={added}
                                className="w-8 h-full flex items-center justify-center text-brand-dark/50 hover:text-brand-dark transition-colors disabled:opacity-50"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowDetails(false)}
                                className="absolute top-4 right-4 text-brand-dark/30 hover:text-brand-dark transition-colors"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>

                            <div className={cn(
                                "w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center",
                                color
                            )}>
                                {image && (
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-brand-dark text-center mb-2">{name}</h2>
                            <p className="text-brand-orange text-xl font-black text-center mb-6">{price}</p>

                            <div className="prose prose-sm max-h-60 overflow-y-auto mb-8 text-brand-dark/70 text-center">
                                {description || "Nenhuma descrição disponível para este item."}
                            </div>

                            <Button
                                onClick={() => {
                                    handleAdd();
                                    setShowDetails(false);
                                }}
                                disabled={added}
                                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-brand-blue/20"
                            >
                                Adicionar ao Carrinho
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

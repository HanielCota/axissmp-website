"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NicknameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (nickname: string) => void;
}

export function NicknameModal({ isOpen, onClose, onConfirm }: NicknameModalProps) {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Minecraft nickname validation: 3-16 characters, letters, numbers, and underscores only
    const isValidNickname = (nick: string): boolean => {
        return /^[a-zA-Z0-9_]{3,16}$/.test(nick);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setError("Por favor, digite seu nickname.");
            return;
        }

        if (!isValidNickname(trimmedNickname)) {
            setError("Nickname inválido (3-16 caracteres, apenas letras, números e _)");
            return;
        }

        onConfirm(trimmedNickname);
    };

    // Lock body scroll when modal is open with scrollbar compensation
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
            return;
        }

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-50 w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        {/* Header */}
                        <div className="bg-slate-50 dark:bg-zinc-950/50 p-8 border-b border-slate-100 dark:border-white/5 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                            <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center mb-6 text-white shadow-lg shadow-brand-orange/20">
                                <User size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Identifique-se no Servidor</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                                Para entregar seus produtos corretamente, precisamos saber seu nickname oficial do Minecraft.
                            </p>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="space-y-3">
                                <label
                                    htmlFor="nickname"
                                    className="text-base font-bold text-slate-700 dark:text-slate-300 ml-1"
                                >
                                    Seu Nick (Minecraft)
                                </label>
                                <div className="relative group">
                                    <input
                                        id="nickname"
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value);
                                            if (e.target.value) setError(null);
                                        }}
                                        placeholder="Ex: Steve"
                                        maxLength={16}
                                        className={cn(
                                            "w-full bg-slate-50 dark:bg-zinc-950/50 border-2 rounded-2xl px-6 py-4 text-xl text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold",
                                            error
                                                ? "border-red-500/50 focus:border-red-500"
                                                : "border-slate-100 dark:border-white/5 focus:border-brand-orange dark:focus:border-brand-orange group-hover:border-slate-200 dark:group-hover:border-white/10"
                                        )}
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!nickname.trim()}
                                    className="w-full bg-brand-orange hover:bg-orange-500 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-[0_0_30px_-10px_rgba(255,166,0,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
                                >
                                    <span>Confirmar e Ir para o Carrinho</span>
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

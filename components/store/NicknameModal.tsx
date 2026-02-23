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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-zinc-900"
                    >
                        {/* Header */}
                        <div className="relative border-b border-slate-100 bg-slate-50 p-8 dark:border-white/5 dark:bg-zinc-950/50">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <div className="bg-brand-orange shadow-brand-orange/20 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg">
                                <User size={32} />
                            </div>
                            <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Identifique-se no Servidor
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                                Para entregar seus produtos corretamente, precisamos saber seu
                                nickname oficial do Minecraft.
                            </p>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="space-y-8 p-8">
                            <div className="space-y-3">
                                <label
                                    htmlFor="nickname"
                                    className="ml-1 text-base font-bold text-slate-700 dark:text-slate-300"
                                >
                                    Seu Nick (Minecraft)
                                </label>
                                <div className="group relative">
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
                                            "w-full rounded-2xl border-2 bg-slate-50 px-6 py-4 text-xl font-bold text-slate-900 transition-all outline-none placeholder:text-slate-300 dark:bg-zinc-950/50 dark:text-white dark:placeholder:text-slate-600",
                                            error
                                                ? "border-red-500/50 focus:border-red-500"
                                                : "focus:border-brand-orange dark:focus:border-brand-orange border-slate-100 group-hover:border-slate-200 dark:border-white/5 dark:group-hover:border-white/10"
                                        )}
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="mt-2 ml-1 text-sm font-medium text-red-500">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!nickname.trim()}
                                    className="bg-brand-orange group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-black text-white shadow-[0_0_30px_-10px_rgba(255,166,0,0.3)] transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <span>Confirmar e Ir para o Carrinho</span>
                                    <ArrowRight
                                        size={22}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

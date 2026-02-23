"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, socialLinks } from "@/constants/constants";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, X, ChevronRight, User as UserIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserWithRole extends User {
    role?: string;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { totalItems } = useCart();
    const [user, setUser] = useState<UserWithRole | null>(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchUserWithRole = async (authUser: User | null): Promise<UserWithRole | null> => {
            if (!authUser) return null;

            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", authUser.id)
                .single();

            return { ...authUser, role: profile?.role };
        };

        supabase.auth.getUser().then(async ({ data: { user } }) => {
            const userWithRole = await fetchUserWithRole(user);
            setUser(userWithRole);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session) {
                setUser(null);
                return;
            }

            const {
                data: { user },
            } = await supabase.auth.getUser();
            const userWithRole = await fetchUserWithRole(user);
            setUser(userWithRole);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-brand-light fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col md:hidden dark:bg-zinc-950"
                >
                    {/* Menu Header */}
                    <div className="border-brand-dark/5 flex items-center justify-between border-b px-6 py-4 dark:border-white/5">
                        <div className="relative h-12 w-24">
                            <Image
                                src="/images/logo/logo.png"
                                alt="AxisSMP Logo"
                                fill
                                sizes="96px"
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10 rounded-full p-3 transition-all active:scale-95 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="flex flex-col gap-4">
                            {/* Login/Account - Mobile */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Link
                                    href={user ? "/dashboard" : "/login"}
                                    onClick={onClose}
                                    className="bg-brand-orange text-brand-dark flex items-center gap-4 rounded-2xl p-5 text-xl font-black transition-all active:scale-[0.98]"
                                >
                                    <div className="bg-brand-dark/10 rounded-lg p-2">
                                        <UserIcon size={24} />
                                    </div>
                                    {user ? "Meu Dashboard" : "Minha Conta"}
                                </Link>
                            </motion.div>

                            {/* Admin Link Mobile */}
                            {user?.role === "admin" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 }}
                                >
                                    <Link
                                        href="/admin"
                                        onClick={onClose}
                                        className="flex items-center gap-4 rounded-2xl bg-red-500/10 p-5 text-xl font-black text-red-500 transition-all active:scale-[0.98]"
                                    >
                                        <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
                                            <ShieldAlert size={24} />
                                        </div>
                                        Painel Admin
                                    </Link>
                                </motion.div>
                            )}

                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        onClick={onClose}
                                        className="text-brand-dark group border-brand-dark/5 flex items-center justify-between rounded-2xl border bg-white p-5 text-xl font-black shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-white/5 dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-brand-light rounded-lg p-2 transition-colors group-hover:bg-white dark:bg-white/10 dark:group-hover:bg-white/20">
                                                <link.icon className="h-6 w-6" />
                                            </div>
                                            {link.name}
                                        </div>
                                        <ChevronRight
                                            size={20}
                                            className="opacity-40 transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Cart Item - Highlighted */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="border-brand-dark/10 flex items-center justify-between rounded-2xl border-2 bg-white p-5 shadow-lg transition-all active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-brand-orange relative rounded-lg p-2">
                                            <ShoppingCart size={24} className="text-brand-dark" />
                                            {totalItems > 0 && (
                                                <span className="bg-brand-dark absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-brand-dark text-xl font-black tracking-tight uppercase dark:text-white">
                                            Carrinho
                                        </span>
                                    </div>
                                    <ChevronRight
                                        size={20}
                                        className="text-brand-dark/40 dark:text-white/40"
                                    />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer: Social Links */}
                    <div className="mt-auto bg-slate-50 p-6 dark:bg-black">
                        <p className="mb-4 text-center text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Acompanhe nossas redes
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-brand-dark flex flex-1 items-center justify-center rounded-2xl p-4 text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-95"
                                >
                                    <social.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

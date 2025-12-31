"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, socialLinks } from "@/lib/constants";
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
                .from('profiles')
                .select('role')
                .eq('id', authUser.id)
                .single();

            return { ...authUser, role: profile?.role };
        };

        supabase.auth.getUser().then(async ({ data: { user } }) => {
            const userWithRole = await fetchUserWithRole(user);
            setUser(userWithRole);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session) {
                setUser(null);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
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
                    className="fixed inset-0 z-[100] h-[100dvh] w-full bg-brand-orange md:hidden flex flex-col"
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
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
                            className="bg-black/5 p-3 rounded-full text-brand-dark hover:bg-black/10 active:scale-95 transition-all"
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
                                    className="flex items-center gap-4 rounded-2xl bg-white/20 p-5 font-black text-xl text-white transition-all active:scale-[0.98]"
                                >
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <UserIcon size={24} />
                                    </div>
                                    {user ? "Meu Dashboard" : "Minha Conta"}
                                </Link>
                            </motion.div>

                            {/* Admin Link Mobile */}
                            {user?.role === 'admin' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 }}
                                >
                                    <Link
                                        href="/admin"
                                        onClick={onClose}
                                        className="flex items-center gap-4 rounded-2xl bg-brand-dark/10 p-5 font-black text-xl text-brand-dark transition-all active:scale-[0.98]"
                                    >
                                        <div className="bg-brand-dark/10 p-2 rounded-lg text-brand-dark">
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
                                        className="text-brand-dark group flex items-center justify-between rounded-2xl bg-white/10 p-5 font-black text-xl transition-all hover:bg-white/20 active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                                                <link.icon className="h-6 w-6" />
                                            </div>
                                            {link.name}
                                        </div>
                                        <ChevronRight size={20} className="opacity-40 group-hover:translate-x-1 transition-transform" />
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
                                    className="flex items-center justify-between rounded-2xl border-2 border-brand-dark/10 bg-white p-5 shadow-lg active:scale-[0.98] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative bg-brand-orange p-2 rounded-lg">
                                            <ShoppingCart size={24} className="text-brand-dark" />
                                            {totalItems > 0 && (
                                                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark text-[10px] font-black text-white shadow-md">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-black text-xl text-brand-dark uppercase tracking-tight">Carrinho</span>
                                    </div>
                                    <ChevronRight size={20} className="text-brand-dark/40" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer: Social Links */}
                    <div className="p-6 bg-black/5 mt-auto">
                        <p className="text-brand-dark/60 text-xs font-bold uppercase tracking-widest text-center mb-4">Acompanhe nossas redes</p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-brand-dark hover:bg-zinc-800 flex flex-1 items-center justify-center rounded-2xl p-4 text-white shadow-lg active:scale-95 transition-all"
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

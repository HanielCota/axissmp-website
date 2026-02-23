"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Menu,
    X,
    Home,
    LogOut,
    Loader2,
    LayoutDashboard,
    ShoppingBag,
    FileText,
    Package,
    MessageSquare,
    Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produtos", icon: ShoppingBag },
    { href: "/admin/posts", label: "Notícias", icon: FileText },
    { href: "/admin/orders", label: "Pedidos", icon: Package },
    { href: "/admin/tickets", label: "Tickets", icon: MessageSquare },
    { href: "/admin/users", label: "Usuários", icon: Users },
];

export function AdminMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-50 flex h-full w-72 flex-col border-l border-white/5 bg-zinc-900"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 p-4">
                                <h2 className="text-lg font-black">Menu</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg p-2 text-white/60 hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1 p-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                                    >
                                        <item.icon size={20} />
                                        <span className="text-sm font-bold">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="space-y-2 border-t border-white/5 p-4">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    <Home size={20} />
                                    <span className="text-sm font-bold">Voltar ao Site</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                                >
                                    {loggingOut ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <LogOut size={20} />
                                    )}
                                    <span className="text-sm font-bold">Sair</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

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
    Users
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
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-72 bg-zinc-900 border-l border-white/5 z-50 flex flex-col"
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h2 className="font-black text-lg">Menu</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
                                    >
                                        <item.icon size={20} />
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-white/5 space-y-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                                >
                                    <Home size={20} />
                                    <span className="font-bold text-sm">Voltar ao Site</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                                >
                                    {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                                    <span className="font-bold text-sm">Sair</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

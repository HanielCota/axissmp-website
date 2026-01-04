"use client";

import { User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserWithRole extends User {
    role?: string;
}

export function UserMenu() {
    const [user, setUser] = useState<UserWithRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchUserWithRole = async (authUser: User | null) => {
            try {
                if (!authUser) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authUser.id)
                    .single();

                if (error) {
                    console.error("Error fetching role:", error);
                }

                setUser({ ...authUser, role: profile?.role });
            } catch (err) {
                console.error("UserMenu error:", err);
            } finally {
                setLoading(false);
            }
        };

        // Safety timeout to ensure loading clears
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        // Check current user
        supabase.auth.getUser()
            .then(({ data: { user } }) => {
                fetchUserWithRole(user);
            })
            .catch(() => {
                setLoading(false);
            });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session) {
                setUser(null);
                setLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            fetchUserWithRole(user);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    if (loading) {
        return <div className="h-10 w-28 animate-pulse rounded-full bg-white/10 border border-white/10" />;
    }

    if (!user) {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Link
                    href="/login"
                    className="group flex items-center gap-2 rounded-full bg-brand-orange border border-brand-orange shadow-lg shadow-brand-orange/20 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white hover:text-brand-orange"
                >
                    <UserIcon size={18} className="text-white transition-colors group-hover:text-brand-orange" />
                    <span>Entrar</span>
                </Link>
            </motion.div>
        );
    }

    const nickname = user.user_metadata?.nickname || "Steve";

    return (
        <div className="flex items-center gap-3">
            {user.role === 'admin' && (
                <Link href="/admin">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center rounded-full border border-brand-orange/50 bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange backdrop-blur-md transition-all hover:bg-brand-orange hover:text-brand-dark"
                    >
                        ADMIN
                    </motion.div>
                </Link>
            )}
            <Link href="/dashboard">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-4 pr-1 py-1 backdrop-blur-md transition-all hover:bg-white/10"
                >
                    <span className="text-sm font-black text-white uppercase tracking-tight">{nickname}</span>
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-brand-orange bg-black/20">
                        <img
                            src={`https://mc-heads.net/avatar/${nickname}/32`}
                            alt={nickname}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}

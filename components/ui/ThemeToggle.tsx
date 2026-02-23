"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />;
    }

    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hover:border-brand-orange/50 group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10"
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon size={18} className="text-brand-orange" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: 90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun size={18} className="text-brand-orange" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

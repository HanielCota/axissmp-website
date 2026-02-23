"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/useScrolled";
import { PlayersOnline } from "./PlayersOnline";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const scrolled = useScrolled(200);

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-50 flex w-full flex-col items-center"
            >
                {/* Background Render */}
                <div className="absolute inset-0 z-0 h-[180px] w-full overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                    <Image
                        src="/images/site/render.jpg"
                        alt="Header Background"
                        fill
                        sizes="100vw"
                        className="object-cover object-[center_60%] opacity-70"
                        priority
                        quality={100}
                    />
                </div>

                {/* Top Section: Header Content */}
                <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 py-4 md:flex-row md:gap-0">
                    {/* Left: Players Online (Equal width flex container on desktop) */}
                    <div className="flex justify-center md:flex-1 md:justify-start">
                        <PlayersOnline />
                    </div>

                    {/* Center: Logo */}
                    <div className="relative h-24 w-48 flex-none drop-shadow-2xl transition-transform duration-300 hover:scale-105 md:h-32 md:w-64">
                        <Link href="/" className="relative block h-full w-full">
                            <Image
                                src="/images/logo/logo.png"
                                alt="AxisSMP Logo"
                                fill
                                sizes="(max-width: 768px) 192px, 256px"
                                className="object-contain"
                                priority
                                quality={100}
                            />
                        </Link>
                    </div>

                    {/* Right: Search & User (Equal width flex container on desktop) */}
                    <div className="hidden items-center justify-end gap-4 md:flex md:flex-1">
                        <SearchBar />
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                {/* Bottom Section: Nav Bar */}
                <div className="relative h-16 w-full">
                    <div
                        className={cn(
                            "bg-brand-orange shadow-brand-orange/20 z-50 w-full border-y border-white/10 shadow-lg backdrop-blur-sm transition-all duration-300",
                            scrolled
                                ? "animate-in slide-in-from-top bg-brand-orange/95 fixed top-0 left-0 duration-300"
                                : "relative"
                        )}
                    >
                        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:justify-center">
                            {/* Mobile Toggle */}
                            <button
                                className="text-brand-dark rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            {/* Desktop Links */}
                            <DesktopNav />

                            {/* Mobile Right Spacer */}
                            <div className="w-10 md:hidden" />
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

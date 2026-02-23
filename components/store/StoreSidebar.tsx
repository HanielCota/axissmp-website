"use client";

import { Crown, Gem, Shield, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Category } from "@/types/store";

interface CategoryItem {
    id: Category;
    name: string;
    icon: React.ElementType;
}

const categories: CategoryItem[] = [
    { id: "vips", name: "VIPs", icon: Crown },
    { id: "coins", name: "Coins", icon: Gem },
    { id: "unban", name: "Unban", icon: Shield },
];

interface StoreSidebarProps {
    activeCategory: Category;
    onSelectCategory: (id: Category) => void;
}

export function StoreSidebar({ activeCategory, onSelectCategory }: StoreSidebarProps) {
    return (
        <aside className="sticky top-24 w-full shrink-0 space-y-8 lg:w-72 lg:pt-2">
            {/* Categories Navigation */}
            <div className="space-y-2">
                <h3 className="text-brand-orange mb-4 hidden px-2 text-xs font-bold tracking-widest uppercase lg:block">
                    Categorias
                </h3>

                <div className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth pb-4 lg:flex-col lg:overflow-x-visible lg:pb-0">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={cn(
                                    "flex flex-none items-center justify-between rounded-xl border-2 p-3 font-bold whitespace-nowrap transition-all lg:w-full lg:p-4",
                                    isActive
                                        ? "border-brand-blue text-brand-blue shadow-brand-blue/5 bg-white shadow-lg dark:bg-zinc-800"
                                        : "text-brand-dark/60 hover:text-brand-dark border-transparent bg-transparent hover:bg-white/50 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "rounded-lg p-2 transition-colors",
                                            isActive
                                                ? "bg-brand-blue/10"
                                                : "bg-brand-dark/5 dark:bg-white/5"
                                        )}
                                    >
                                        <cat.icon size={20} />
                                    </div>
                                    <span>{cat.name}</span>
                                </div>
                                {isActive && (
                                    <div className="bg-brand-blue hidden h-2 w-2 rounded-full lg:block" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Support Link */}
            <div className="border-brand-dark/5 border-t pt-4 dark:border-white/5">
                <button className="text-brand-dark/50 hover:text-brand-dark flex w-full items-center gap-3 rounded-xl p-4 font-medium transition-colors dark:text-white/50 dark:hover:text-white">
                    <HelpCircle size={20} />
                    <span>Precisa de ajuda?</span>
                </button>
            </div>
        </aside>
    );
}

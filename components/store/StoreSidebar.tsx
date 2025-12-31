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
    { id: "unban", name: "Desban", icon: Shield },
];

interface StoreSidebarProps {
    activeCategory: Category;
    onSelectCategory: (id: Category) => void;
}

export function StoreSidebar({ activeCategory, onSelectCategory }: StoreSidebarProps) {
    return (
        <aside className="w-full lg:w-72 shrink-0 space-y-8 sticky top-24 lg:pt-2">


            {/* Categories Navigation */}
            <div className="space-y-2">
                <h3 className="hidden lg:block text-brand-orange font-bold text-xs uppercase tracking-widest px-2 mb-4">Categorias</h3>

                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 no-scrollbar scroll-smooth">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={cn(
                                    "flex-none lg:w-full flex items-center justify-between p-3 lg:p-4 rounded-xl font-bold transition-all border-2 whitespace-nowrap",
                                    isActive
                                        ? "bg-white border-brand-blue text-brand-blue shadow-lg shadow-brand-blue/5"
                                        : "bg-transparent border-transparent text-brand-dark/60 hover:bg-white/50 hover:text-brand-dark"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        isActive ? "bg-brand-blue/10" : "bg-brand-dark/5"
                                    )}>
                                        <cat.icon size={20} />
                                    </div>
                                    <span>{cat.name}</span>
                                </div>
                                {isActive && (
                                    <div className="hidden lg:block w-2 h-2 rounded-full bg-brand-blue" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Support Link */}
            <div className="pt-4 border-t border-brand-dark/5">
                <button className="w-full flex items-center gap-3 p-4 rounded-xl text-brand-dark/50 hover:text-brand-dark font-medium transition-colors">
                    <HelpCircle size={20} />
                    <span>Precisa de ajuda?</span>
                </button>
            </div>
        </aside>
    );
}

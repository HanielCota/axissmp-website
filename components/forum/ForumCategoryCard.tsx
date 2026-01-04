import { Card } from "@/components/ui/card";
import { MessageSquare, Megaphone, Lightbulb, HelpCircle, AlertTriangle, Coffee, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
    "Megaphone": Megaphone,
    "MessageSquare": MessageSquare,
    "Lightbulb": Lightbulb,
    "HelpCircle": HelpCircle,
    "AlertTriangle": AlertTriangle,
    "Coffee": Coffee,
};

interface Props {
    category: {
        id: string;
        name: string;
        description: string;
        slug: string;
        icon: string;
        threadCount?: number;
    };
}

export function ForumCategoryCard({ category }: Props) {
    const Icon = iconMap[category.icon] || MessageSquare;

    return (
        <Link href={`/forum/${category.slug}`}>
            <Card className="h-full bg-card border-border/40 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-xl overflow-hidden group">
                <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-muted/20">
                    <div className="p-6 flex items-start gap-4">
                        {/* Icon Box */}
                        <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <Icon size={24} strokeWidth={2} />
                        </div>

                        <div className="space-y-2 flex-1">
                            <h3 className="font-outfit font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                                {category.name}
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>

                            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
                                {category.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto px-6 py-3 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span className="uppercase tracking-wider">Estatísticas</span>

                        <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-bold">{category.threadCount || 0}</span>
                            <span>tópicos</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

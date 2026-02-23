import { Card } from "@/components/ui/card";
import {
    MessageSquare,
    Megaphone,
    Lightbulb,
    HelpCircle,
    AlertTriangle,
    Coffee,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
    Megaphone: Megaphone,
    MessageSquare: MessageSquare,
    Lightbulb: Lightbulb,
    HelpCircle: HelpCircle,
    AlertTriangle: AlertTriangle,
    Coffee: Coffee,
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
            <Card className="bg-card border-border/40 hover:border-primary/50 group h-full overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="to-muted/20 flex h-full flex-col bg-gradient-to-b from-transparent">
                    <div className="flex items-start gap-4 p-6">
                        {/* Icon Box */}
                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0 rounded-lg p-3 transition-all duration-300">
                            <Icon size={24} strokeWidth={2} />
                        </div>

                        <div className="flex-1 space-y-2">
                            <h3 className="font-outfit text-foreground group-hover:text-primary flex items-center justify-between text-lg font-bold transition-colors">
                                {category.name}
                                <ChevronRight className="text-muted-foreground h-4 w-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </h3>

                            <p className="text-muted-foreground/80 line-clamp-2 text-sm leading-relaxed">
                                {category.description}
                            </p>
                        </div>
                    </div>

                    <div className="border-border/40 bg-muted/10 text-muted-foreground mt-auto flex items-center justify-between border-t px-6 py-3 text-xs font-medium">
                        <span className="tracking-wider uppercase">Estatísticas</span>

                        <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-bold">
                                {category.threadCount || 0}
                            </span>
                            <span>tópicos</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

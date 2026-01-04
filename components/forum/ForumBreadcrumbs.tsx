"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function ForumBreadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);

    // If we are just at /forum, we might not need breadcrumbs or just show Home > Forum
    if (paths.length === 0) return null;

    const breadcrumbs = [
        { href: "/", label: "Início", icon: Home },
        { href: "/forum", label: "Fórum", icon: null },
    ];

    // Build breadcrumbs dynamically based on path segments
    // Example: /forum/geral/create -> Home > Forum > Geral > Create
    // In a real app, we might want to map slugs to pretty names via a context or lookup,
    // but for now we'll format the slug.

    if (paths.length > 1) {
        // paths[0] is 'forum'
        // paths[1] is category slug
        if (paths[1]) {
            breadcrumbs.push({
                href: `/forum/${paths[1]}`,
                label: formatSlug(paths[1]),
                icon: null
            });
        }

        // paths[2] could be 'create' or 'thread'
        if (paths[2]) {
            if (paths[2] === 'create') {
                breadcrumbs.push({
                    href: `/forum/${paths[1]}/create`,
                    label: "Criar Tópico",
                    icon: null
                });
            } else if (paths[2] === 'thread' && paths[3]) {
                // /forum/thread/[id]
                // We typically don't show the ID in breadcrumb, maybe just "Tópico"
                // Or if we had the thread title, that would be ideal.
                // For this component (client-side), we might not have the title easily unless passed as prop.
                // Let's just say "Visualizar Tópico"
                breadcrumbs.push({
                    href: pathname, // Current page
                    label: "Visualizar Tópico",
                    icon: null
                });
            }
        }
    }

    // Determine current active item (last one)
    const activeIndex = breadcrumbs.length - 1;

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                {breadcrumbs.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}

                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-1.5 transition-colors hover:text-primary",
                                    isActive && "font-semibold text-primary pointer-events-none"
                                )}
                            >
                                {item.icon && <item.icon className="w-4 h-4" />}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function formatSlug(slug: string) {
    if (!slug) return "";
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

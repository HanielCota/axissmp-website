import { createClient } from "@/lib/supabase/server";
import { ForumCategoryCard } from "@/components/forum/ForumCategoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ForumSearch } from "@/components/forum/ForumSearch";
import { ForumServerStatus } from "@/components/forum/ForumServerStatus";
import { RecentThreadsWidget, QuickLinksWidget } from "@/components/forum/ForumSidebar";
import { BackButton } from "@/components/ui/back-button";

import { ForumCategory } from "@/types/forum";
import { unstable_noStore as noStore } from "next/cache";

// Force dynamic rendering
export const revalidate = 0;

async function getForumCategories() {
    const supabase = await createClient();
    const { data: rawData, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) throw error;

    return JSON.parse(JSON.stringify(rawData));
}

export default async function ForumPage() {
    noStore();
    let categories;
    try {
        categories = await getForumCategories();
    } catch (error) {
        console.error("Error fetching forum categories:", error);
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                    Não foi possível carregar as categorias do fórum. Tente novamente mais tarde.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <div className="from-card via-card to-primary/5 border-border/50 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-xl shadow-black/5 md:p-12">
                {/* Animated Background Orbs */}
                <div className="bg-primary/20 absolute -top-24 -right-24 h-64 w-64 animate-pulse rounded-full blur-[100px]" />
                <div className="bg-primary/10 absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-[120px]" />
                <div
                    className="bg-secondary/10 absolute top-1/2 right-1/4 h-32 w-32 animate-pulse rounded-full blur-[80px]"
                    style={{ animationDelay: "1s" }}
                />

                {/* Noise Texture Overlay */}
                <div className="bg-noise pointer-events-none absolute inset-0 opacity-50" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="max-w-xl space-y-5 text-center md:text-left">
                        <BackButton href="/" label="Voltar ao Início" className="mb-2 md:-ml-4" />
                        <h1 className="font-outfit text-foreground text-4xl leading-[1.1] font-black tracking-tight md:text-5xl lg:text-6xl">
                            Fórum da{" "}
                            <span className="text-primary relative">
                                Comunidade
                                <svg
                                    className="text-primary/30 absolute -bottom-2 left-0 h-3 w-full"
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0,8 Q50,0 100,8 T200,8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-muted-foreground/80 max-w-md text-lg leading-relaxed">
                            O lugar ideal para discutir, compartilhar ideias e tirar dúvidas sobre o
                            servidor.
                        </p>
                    </div>

                    <div className="relative w-full md:w-[420px]">
                        <div className="from-primary/20 to-secondary/20 absolute -inset-2 rounded-2xl bg-gradient-to-r via-transparent opacity-60 blur-xl" />
                        <ForumSearch placeholder="O que você procura hoje?" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Categories Section */}
                <div className="flex-1 space-y-6">
                    <div className="border-border/40 flex items-center justify-between border-b pb-4">
                        <h2 className="font-outfit text-foreground/90 text-2xl font-black tracking-tight uppercase">
                            Explorar Unidades
                        </h2>
                        <div className="flex gap-2">
                            <div className="bg-primary h-2 w-2 rounded-full" />
                            <div className="bg-primary/30 h-2 w-2 rounded-full" />
                            <div className="bg-primary/10 h-2 w-2 rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {(categories || []).map((cat: ForumCategory) => (
                            <ForumCategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                </div>

                {/* Sidebar Section */}
                <aside className="w-full space-y-6 lg:w-[480px]">
                    <div className="border-border/40 flex items-center justify-between border-b pb-4 lg:hidden">
                        <h2 className="font-outfit text-foreground/90 text-2xl font-black tracking-tight uppercase">
                            Utilidades
                        </h2>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-24">
                        <ForumServerStatus />
                        <QuickLinksWidget />
                        <RecentThreadsWidget />
                    </div>
                </aside>
            </div>
        </div>
    );
}

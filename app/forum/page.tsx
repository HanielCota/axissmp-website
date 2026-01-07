import { createClient } from "@/lib/supabase/server";
import { ForumCategoryCard } from "@/components/forum/ForumCategoryCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ForumSearch } from "@/components/forum/ForumSearch";
import { ForumServerStatus } from "@/components/forum/ForumServerStatus";
import { RecentThreadsWidget, QuickLinksWidget } from "@/components/forum/ForumSidebar";
import { BackButton } from "@/components/ui/back-button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ForumCategory } from "@/types/forum";
import { unstable_noStore as noStore } from 'next/cache';

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
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 p-8 md:p-12 shadow-xl shadow-black/5">
                {/* Animated Background Orbs */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-5 max-w-xl text-center md:text-left">
                        <BackButton href="/" label="Voltar ao Início" className="md:-ml-4 mb-2" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit text-foreground tracking-tight leading-[1.1]">
                            Fórum da <span className="text-primary relative">
                                Comunidade
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                                    <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-md">
                            O lugar ideal para discutir, compartilhar ideias e tirar dúvidas sobre o servidor.
                        </p>
                    </div>

                    <div className="w-full md:w-[420px] relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-2xl blur-xl opacity-60" />
                        <ForumSearch placeholder="O que você procura hoje?" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories Section */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                        <h2 className="text-2xl font-black font-outfit text-foreground/90 tracking-tight uppercase">Explorar Unidades</h2>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-2 h-2 rounded-full bg-primary/30" />
                            <div className="w-2 h-2 rounded-full bg-primary/10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(categories || []).map((cat: ForumCategory) => (
                            <ForumCategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                </div>

                {/* Sidebar Section */}
                <aside className="w-full lg:w-[480px] space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4 lg:hidden">
                        <h2 className="text-2xl font-black font-outfit text-foreground/90 tracking-tight uppercase">Utilidades</h2>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-24">
                        <ForumServerStatus />
                        <QuickLinksWidget />
                        {/* @ts-ignore - Async components in arrays are fine in RSC */}
                        <RecentThreadsWidget />
                    </div>
                </aside>
            </div>
        </div>
    );
}

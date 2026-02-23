import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MessageSquare,
    ExternalLink,
    BookOpen,
    Scale,
    Headphones,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ForumServerStatus } from "./ForumServerStatus";

export async function RecentThreadsWidget() {
    const supabase = await createClient();
    const { data: threadsRaw } = await supabase
        .from("forum_threads")
        .select("id, title, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(4);

    const userIds = Array.from(new Set(threadsRaw?.map((t) => t.user_id) || []));
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]));

    return (
        <Card className="bg-card border-border/40 divide-border/40 flex h-full flex-col space-y-0 divide-y overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="bg-muted/30 px-5 py-4">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                    <MessageSquare className="text-primary h-4 w-4" strokeWidth={2.5} />
                    Tópicos Recentes
                </CardTitle>
            </CardHeader>
            <div className="divide-border/40 flex-1 divide-y">
                {threadsRaw?.map((thread) => {
                    const profile = profileMap.get(thread.user_id);
                    const nickname = profile?.nickname || "Jogador";
                    const avatarUrl = `https://mc-heads.net/avatar/${nickname}/48`;

                    return (
                        <Link
                            key={thread.id}
                            href={`/forum/thread/${thread.id}`}
                            className="hover:bg-muted/20 group flex items-center gap-4 p-4 transition-colors"
                        >
                            <div className="relative flex-shrink-0">
                                <div className="bg-primary/20 absolute -inset-1.5 rounded-xl opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                                <img
                                    src={avatarUrl}
                                    alt={nickname}
                                    className="border-border/40 relative z-10 h-12 w-12 rounded-xl border-2 transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="flex min-w-0 flex-col gap-1">
                                <h4 className="group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors">
                                    {thread.title}
                                </h4>
                                <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium">
                                    <span className="text-primary/70 font-black tracking-wider uppercase">
                                        {nickname}
                                    </span>
                                    <span className="opacity-30">•</span>
                                    <span>
                                        {formatDistanceToNow(new Date(thread.created_at), {
                                            addSuffix: true,
                                            locale: ptBR,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {(!threadsRaw || threadsRaw.length === 0) && (
                <div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-center text-sm">
                    Nenhum tópico recente
                </div>
            )}
        </Card>
    );
}

const quickLinks = [
    { href: "/rules", label: "Regras do Servidor", icon: Scale, color: "text-red-500" },
    { href: "/wiki", label: "Wiki do Axis", icon: BookOpen, color: "text-blue-500" },
    { href: "/support", label: "Central de Suporte", icon: Headphones, color: "text-green-500" },
];

export function QuickLinksWidget() {
    return (
        <div className="grid h-full grid-cols-1 gap-3">
            {quickLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="bg-card border-border/40 hover:border-primary/40 group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm lg:min-h-[80px]"
                >
                    <div
                        className={`bg-muted/30 group-hover:bg-primary/10 rounded-lg p-2 transition-colors ${link.color}`}
                    >
                        <link.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                        <span className="text-foreground group-hover:text-primary block text-sm font-bold transition-colors">
                            {link.label}
                        </span>
                        <span className="text-muted-foreground text-xs">Acessar área</span>
                    </div>
                    <ChevronRight className="text-muted-foreground/50 group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
                </Link>
            ))}
        </div>
    );
}

export function ForumSidebar() {
    return (
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
            <ForumServerStatus />

            <div className="grid grid-cols-3 gap-2">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="bg-card border-border/40 hover:border-primary/40 group flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all hover:shadow-sm"
                        title={link.label}
                    >
                        <div
                            className={`bg-muted/30 group-hover:bg-primary/10 rounded-lg p-2 transition-colors ${link.color}`}
                        >
                            <link.icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <span className="text-muted-foreground group-hover:text-primary line-clamp-1 w-full text-[10px] leading-tight font-bold transition-colors">
                            {link.label.split(" ")[0]}
                        </span>
                    </Link>
                ))}
            </div>
            <RecentThreadsWidget />
        </aside>
    );
}

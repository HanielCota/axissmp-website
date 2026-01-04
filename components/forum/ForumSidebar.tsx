import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ExternalLink, BookOpen, Scale, Headphones, ChevronRight } from "lucide-react";
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

    const userIds = Array.from(new Set(threadsRaw?.map(t => t.user_id) || []));
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]));

    return (
        <Card className="bg-card border-border/40 space-y-0 overflow-hidden divide-y divide-border/40 rounded-xl shadow-sm h-full flex flex-col">
            <CardHeader className="bg-muted/30 py-4 px-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2.5} />
                    Tópicos Recentes
                </CardTitle>
            </CardHeader>
            <div className="divide-y divide-border/40 flex-1">
                {threadsRaw?.map((thread) => {
                    const profile = profileMap.get(thread.user_id);
                    const nickname = profile?.nickname || "Jogador";
                    const avatarUrl = `https://mc-heads.net/avatar/${nickname}/48`;

                    return (
                        <Link
                            key={thread.id}
                            href={`/forum/thread/${thread.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group"
                        >
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-1.5 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={avatarUrl}
                                    alt={nickname}
                                    className="w-12 h-12 rounded-xl border-2 border-border/40 relative z-10 transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <h4 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                    {thread.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <span className="text-primary/70 font-black uppercase tracking-wider">{nickname}</span>
                                    <span className="opacity-30">•</span>
                                    <span>
                                        {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: ptBR })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {(!threadsRaw || threadsRaw.length === 0) && (
                <div className="p-4 text-center text-sm text-muted-foreground flex-1 flex items-center justify-center">
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
        <div className="grid grid-cols-1 gap-3 h-full">
            {quickLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-4 p-4 bg-card border border-border/40 rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group lg:min-h-[80px]"
                >
                    <div className={`p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-colors ${link.color}`}>
                        <link.icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                        <span className="block font-bold text-sm text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                        <span className="text-xs text-muted-foreground">Acessar área</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
            ))}
        </div>
    );
}

export function ForumSidebar() {
    return (
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <ForumServerStatus />

            <div className="grid grid-cols-3 gap-2">
                {quickLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-card border border-border/40 rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group text-center"
                        title={link.label}
                    >
                        <div className={`p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-colors ${link.color}`}>
                            <link.icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1 w-full">{link.label.split(' ')[0]}</span>
                    </Link>
                ))}
            </div>
            <RecentThreadsWidget />
        </aside>
    );
}

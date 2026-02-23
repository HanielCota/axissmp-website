import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Pin, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ForumThread } from "@/types/forum";

export function ThreadList({ threads }: { threads: ForumThread[] }) {
    if (!threads || threads.length === 0) {
        return (
            <div className="text-muted-foreground bg-card/50 rounded-xl border border-dashed py-12 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <h3 className="text-lg font-medium">Nenhum tópico encontrado</h3>
                <p>Seja o primeiro a criar um tópico nesta categoria!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header (Simplified) */}
            <div className="text-muted-foreground/50 hidden items-center px-6 py-3 text-xs font-bold tracking-widest uppercase md:flex">
                <div className="flex-1">Tópico</div>
                <div className="w-32 text-center">Respostas</div>
                <div className="w-48 pr-4 text-right">Autor</div>
            </div>

            <div className="flex flex-col gap-3">
                {threads.map((thread) => {
                    const isNew =
                        new Date(thread.updated_at || thread.created_at).getTime() >
                        Date.now() - 24 * 60 * 60 * 1000;

                    return (
                        <Link key={thread.id} href={`/forum/thread/${thread.id}`}>
                            <Card className="group bg-card/10 hover:border-primary/40 hover:shadow-primary/5 relative cursor-pointer overflow-hidden border border-white/5 backdrop-blur-md transition-all duration-500 hover:translate-x-1 hover:shadow-2xl">
                                <div className="flex items-center gap-5 p-5">
                                    {/* Status Indicator */}
                                    <div
                                        className={cn(
                                            "h-14 w-1.5 flex-shrink-0 rounded-full transition-all duration-500 group-hover:h-16",
                                            thread.is_pinned
                                                ? "bg-primary shadow-[0_0_15px_rgba(254,176,93,0.4)]"
                                                : thread.is_locked
                                                    ? "bg-destructive/40"
                                                    : "bg-white/5"
                                        )}
                                    />

                                    {/* Main Info */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                                        <div className="mb-2 flex items-center gap-3">
                                            {thread.is_pinned && (
                                                <Pin className="text-primary h-4 w-4 rotate-45" />
                                            )}
                                            {thread.is_locked && (
                                                <Lock className="text-destructive/70 h-4 w-4" />
                                            )}

                                            <h3 className="font-outfit text-foreground/90 group-hover:text-primary truncate text-lg font-black tracking-tight uppercase transition-colors duration-300">
                                                {thread.title}
                                            </h3>

                                            {isNew && (
                                                <Badge className="bg-primary/20 text-primary border-primary/20 h-5 animate-pulse px-2 text-[9px] font-black uppercase shadow-[0_0_10px_rgba(254,176,93,0.2)]">
                                                    Novo
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="text-muted-foreground/60 flex items-center gap-4 text-xs font-medium tracking-wide">
                                            <span
                                                className={cn(
                                                    "bg-muted/30 rounded-md border border-white/5 px-2 py-0.5",
                                                    thread.author.role === "admin"
                                                        ? "text-destructive border-destructive/20 bg-destructive/5"
                                                        : thread.author.role === "mod"
                                                            ? "text-secondary border-secondary/20 bg-secondary/5"
                                                            : ""
                                                )}
                                            >
                                                {thread.author.username}
                                            </span>
                                            <span className="flex items-center gap-1.5 capitalize">
                                                <div className="bg-primary/40 h-1 w-1 rounded-full" />
                                                {formatDistanceToNow(new Date(thread.created_at), {
                                                    addSuffix: true,
                                                    locale: ptBR,
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="group-hover:border-primary/10 hidden w-28 flex-col items-center justify-center border-x border-white/5 px-4 transition-colors duration-500 md:flex">
                                        <span className="font-outfit text-foreground group-hover:text-primary text-2xl font-black transition-colors duration-500">
                                            {thread.reply_count}
                                        </span>
                                        <span className="text-muted-foreground/40 text-[9px] font-black tracking-[0.2em] uppercase">
                                            Respostas
                                        </span>
                                    </div>

                                    {/* Last Active */}
                                    <div className="hidden w-56 items-center justify-end pl-4 md:flex">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-foreground/80 group-hover:text-foreground text-sm font-bold transition-colors">
                                                    {thread.author.username}
                                                </p>
                                                <p className="text-muted-foreground/40 text-[10px] font-bold tracking-wider uppercase">
                                                    Ativo{" "}
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            thread.last_reply_at ||
                                                            thread.created_at
                                                        ),
                                                        { locale: ptBR, addSuffix: true }
                                                    )}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <div className="bg-primary/20 absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                                                <Avatar className="relative z-10 h-11 w-11 border-2 border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                                                    <AvatarImage src={thread.author.avatar_url} />
                                                    <AvatarFallback className="bg-muted text-[10px] font-black">
                                                        {thread.author.username
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

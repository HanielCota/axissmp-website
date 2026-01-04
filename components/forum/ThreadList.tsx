import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, User, Pin, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ForumThread } from "@/types/forum";

export function ThreadList({ threads }: { threads: ForumThread[] }) {
    if (!threads || threads.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed">
                <MessageSquare className="mx-auto h-12 w-12 opacity-50 mb-4" />
                <h3 className="text-lg font-medium">Nenhum tópico encontrado</h3>
                <p>Seja o primeiro a criar um tópico nesta categoria!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header (Simplified) */}
            <div className="hidden md:flex items-center px-6 py-3 text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
                <div className="flex-1">Tópico</div>
                <div className="w-32 text-center">Respostas</div>
                <div className="w-48 text-right pr-4">Autor</div>
            </div>

            <div className="flex flex-col gap-3">
                {threads.map((thread) => {
                    const isNew = new Date(thread.updated_at || thread.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;

                    return (
                        <Link key={thread.id} href={`/forum/thread/${thread.id}`}>
                            <Card className="group relative overflow-hidden transition-all duration-500 cursor-pointer bg-card/10 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:translate-x-1">
                                <div className="flex items-center gap-5 p-5">
                                    {/* Status Indicator */}
                                    <div className={cn(
                                        "w-1.5 h-14 rounded-full flex-shrink-0 transition-all duration-500 group-hover:h-16",
                                        thread.is_pinned ? "bg-primary shadow-[0_0_15px_rgba(254,176,93,0.4)]" :
                                            thread.is_locked ? "bg-destructive/40" : "bg-white/5"
                                    )} />

                                    {/* Main Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-2">
                                            {thread.is_pinned && <Pin className="w-4 h-4 text-primary rotate-45" />}
                                            {thread.is_locked && <Lock className="w-4 h-4 text-destructive/70" />}

                                            <h3 className="font-outfit font-black text-lg text-foreground/90 uppercase tracking-tight truncate group-hover:text-primary transition-colors duration-300">
                                                {thread.title}
                                            </h3>

                                            {isNew && (
                                                <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] uppercase font-black px-2 h-5 animate-pulse shadow-[0_0_10px_rgba(254,176,93,0.2)]">
                                                    Novo
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60 tracking-wide">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md bg-muted/30 border border-white/5",
                                                thread.author.role === 'admin' ? "text-destructive border-destructive/20 bg-destructive/5" :
                                                    thread.author.role === 'mod' ? "text-secondary border-secondary/20 bg-secondary/5" : ""
                                            )}>
                                                {thread.author.username}
                                            </span>
                                            <span className="flex items-center gap-1.5 capitalize">
                                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                                {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex flex-col items-center justify-center w-28 px-4 border-x border-white/5 group-hover:border-primary/10 transition-colors duration-500">
                                        <span className="text-2xl font-black font-outfit text-foreground group-hover:text-primary transition-colors duration-500">
                                            {thread.reply_count}
                                        </span>
                                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Respostas</span>
                                    </div>

                                    {/* Last Active */}
                                    <div className="hidden md:flex items-center justify-end w-56 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">{thread.author.username}</p>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider">
                                                    Ativo {formatDistanceToNow(new Date(thread.last_reply_at || thread.created_at), { locale: ptBR, addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <Avatar className="w-11 h-11 border-2 border-white/5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-110">
                                                    <AvatarImage src={thread.author.avatar_url} />
                                                    <AvatarFallback className="text-[10px] bg-muted font-black">
                                                        {thread.author.username.slice(0, 2).toUpperCase()}
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


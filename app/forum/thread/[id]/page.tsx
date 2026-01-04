import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pin, Lock, Calendar, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { ForumAdminActions } from "@/components/forum/ForumAdminActions";
import { BackButton } from "@/components/ui/back-button";
import { PlayerModel } from "@/components/minecraft/PlayerModel";
import { PostReactions } from "@/components/forum/PostReactions";
import { SolveButton } from "@/components/forum/SolveButton";
import { ReportButton } from "@/components/forum/ReportButton";
import { EditButton } from "@/components/forum/EditButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

interface Props {
    params: {
        id: string;
    };
}

// Types for raw Supabase data
interface RawReply {
    id: string;
    thread_id: string;
    user_id: string;
    content: string;
    is_solution: boolean;
    created_at: string;
    updated_at: string;
}

interface Profile {
    id: string;
    nickname: string;
    role: string;
    avatar_url: string | null;
}

interface PostCount {
    user_id: string;
}

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: Props) {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Fetch Thread Details
    const { data: thread, error: threadError } = await supabase
        .from("forum_threads")
        .select(`
            *,
            category:forum_categories(name, slug)
        `)
        .eq("id", id)
        .single();

    if (threadError || !thread) {
        console.error("Error fetching thread:", threadError);
        notFound();
    }

    // 2. Fetch Replies
    const { data: repliesRaw, error: repliesError } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("thread_id", id)
        .order("created_at", { ascending: true });

    // 3. Fetch Reactions
    const { data: threadReactions } = await supabase
        .from("forum_reactions")
        .select("*")
        .eq("thread_id", id);

    const { data: postReactions } = await supabase
        .from("forum_reactions")
        .select("*")
        .in("post_id", repliesRaw?.map(r => r.id) || []);

    // 4. Fetch Authors and their post counts
    const userIds = new Set<string>();
    userIds.add(thread.user_id);
    repliesRaw?.forEach((r: RawReply) => userIds.add(r.user_id));
    const uniqueUserIds = Array.from(userIds);

    const [profilesRes, postCountsRes] = await Promise.all([
        supabase
            .from("profiles")
            .select("id, nickname, role, avatar_url")
            .in("id", uniqueUserIds),
        supabase
            .from("forum_posts")
            .select("user_id")
            .in("user_id", uniqueUserIds)
    ]);

    const profiles = profilesRes.data;
    const allPosts = postCountsRes.data || [];

    // Calculate post count per user
    const postCountMap = new Map<string, number>();
    (allPosts as PostCount[]).forEach((p) => {
        postCountMap.set(p.user_id, (postCountMap.get(p.user_id) || 0) + 1);
    });

    const profileMap = new Map<string, Profile>();
    (profiles as Profile[] | null)?.forEach((p) => profileMap.set(p.id, p));

    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const getAuthorDisplay = (userId: string) => {
        const profile = profileMap.get(userId);
        const nickname = profile?.nickname || "Jogador";
        const avatarUrl = profile?.avatar_url || `https://mc-heads.net/avatar/${nickname}/64`;
        const postCount = postCountMap.get(userId) || 0;

        // Simple rank system based on post count
        let rank = "Novato";
        if (postCount > 100) rank = "Veterano";
        else if (postCount > 50) rank = "Elite";
        else if (postCount > 10) rank = "Membro";

        return {
            username: nickname,
            avatar_url: avatarUrl,
            role: profile?.role || "Membro",
            postCount: postCount,
            rank: rank
        };
    };

    const author = getAuthorDisplay(thread.user_id);

    // 5. Fetch Current User Role (for Admin Actions)
    let isAdmin = false;
    if (currentUser) {
        const { data: currentUserProfile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .single();

        isAdmin = currentUserProfile?.role === "admin" || currentUserProfile?.role === "mod";
    }

    const isAuthor = currentUser?.id === thread.user_id;

    return (
        <div className="space-y-8 pb-20">
            <BackButton href={`/forum/${thread.category?.slug}`} label={`Voltar para ${thread.category?.name || 'Categoria'}`} />

            {/* Thread Header / OP */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-background/50">{thread.category?.name}</Badge>
                            {thread.is_pinned && <Badge className="bg-primary/20 text-primary hover:bg-primary/30"><Pin className="w-3 h-3 mr-1" /> Fixo</Badge>}
                            {thread.is_locked && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20"><Lock className="w-3 h-3 mr-1" /> Fechado</Badge>}
                        </div>
                        {isAdmin && (
                            <ForumAdminActions
                                threadId={thread.id}
                                isPinned={thread.is_pinned}
                                isLocked={thread.is_locked}
                            />
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-outfit text-foreground tracking-tight">{thread.title}</h1>
                </div>

                <Card className="border-primary/10 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl shadow-black/20">
                    <CardHeader className="flex flex-col md:flex-row items-start gap-8 p-8 bg-muted/20 border-b relative">
                        {/* Author Sidebar (Traditional Forum Style) */}
                        <div className="flex flex-col items-center gap-4 min-w-[140px] w-full md:w-auto p-4 rounded-2xl bg-black/20 border border-white/5 shadow-inner">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <PlayerModel
                                    nickname={author.username}
                                    mode="body"
                                    size={100}
                                    className="relative z-10"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-black text-lg tracking-tight text-primary leading-none">{author.username}</p>
                                <Badge variant="default" className="text-[10px] uppercase font-black px-2.5 h-6 bg-primary text-primary-foreground border-none">
                                    {author.role}
                                </Badge>
                                <div className="pt-2 grid grid-cols-2 gap-2 text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span>Rank</span>
                                        <span className="text-foreground">{author.rank}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Posts</span>
                                        <span className="text-foreground">{author.postCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0 pt-2 flex flex-col h-full">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-8 pb-4 border-b border-white/5">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary/40" />
                                    Postado em {format(new Date(thread.created_at), "PPP 'às' HH:mm", { locale: ptBR })}
                                </span>
                                <span className="bg-muted px-2.5 py-1 rounded-md border border-border/50 text-foreground/50">#{thread.id.slice(0, 8)}</span>
                            </div>
                            <div className="prose prose-invert max-w-none text-[15px] leading-relaxed font-medium mb-8">
                                <Markdown>{thread.content}</Markdown>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <PostReactions
                                    postId={thread.id}
                                    initialReactions={threadReactions?.map(r => ({ ...r, current_user_id: currentUser?.id }))}
                                />
                                <div className="flex items-center gap-2">
                                    {isAuthor && (
                                        <EditButton postId={thread.id} initialContent={thread.content} isThread className="text-muted-foreground hover:text-primary" />
                                    )}
                                    <ReportButton postId={thread.id} className="text-muted-foreground hover:text-destructive" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Replies List */}
            {repliesRaw && repliesRaw.length > 0 && (
                <div className="space-y-6 pt-10">
                    <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Respostas ({repliesRaw.length})</h2>
                    </div>

                    {(repliesRaw as RawReply[]).map((reply, index: number) => {
                        const replyAuthor = getAuthorDisplay(reply.user_id);
                        const isSolved = thread.solved_post_id === reply.id;
                        const currentReactions = postReactions?.filter(r => r.post_id === reply.id);

                        return (
                            <Card key={reply.id} id={reply.id} className={cn(
                                "border-primary/5 bg-card/40 hover:bg-card/60 transition-all overflow-hidden",
                                isSolved && "ring-2 ring-green-500/50 bg-green-500/5 border-green-500/20"
                            )}>
                                <CardContent className="flex flex-col md:flex-row items-start gap-8 p-8 relative">
                                    {isSolved && (
                                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Melhor Resposta
                                        </div>
                                    )}

                                    {/* Author Side */}
                                    <div className="flex flex-col items-center gap-3 min-w-[120px] w-full md:w-auto md:border-r md:border-white/5 md:pr-8">
                                        <PlayerModel
                                            nickname={replyAuthor.username}
                                            mode="head"
                                            size={64}
                                        />
                                        <div className="text-center space-y-1">
                                            <p className="font-bold text-sm tracking-tight">{replyAuthor.username}</p>
                                            <Badge variant="secondary" className="text-[8px] uppercase font-black px-1.5 h-4 leading-none">
                                                {replyAuthor.role}
                                            </Badge>
                                            <div className="pt-2 flex flex-col gap-1 text-[8px] uppercase font-black text-muted-foreground/60 tracking-widest border-t border-white/5">
                                                <div className="flex justify-between gap-2">
                                                    <span>Rank:</span>
                                                    <span className="text-foreground">{replyAuthor.rank}</span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Posts:</span>
                                                    <span className="text-foreground">{replyAuthor.postCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="flex-1 min-w-0 flex flex-col h-full">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-4 border-b border-white/5 pb-2">
                                            <span>Em {format(new Date(reply.created_at), "PPP 'às' HH:mm", { locale: ptBR })}</span>
                                            <span>#{index + 1}</span>
                                        </div>
                                        <div className="prose prose-invert max-w-none text-sm leading-relaxed mb-6">
                                            <Markdown>{reply.content}</Markdown>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-4">
                                            <PostReactions
                                                postId={reply.id}
                                                initialReactions={currentReactions?.map(r => ({ ...r, current_user_id: currentUser?.id }))}
                                            />

                                            <div className="flex items-center gap-2">
                                                {currentUser?.id === reply.user_id && (
                                                    <EditButton postId={reply.id} initialContent={reply.content} showIconOnly className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" />
                                                )}
                                                {(isAdmin || isAuthor) && !isSolved && !thread.is_locked && (
                                                    <SolveButton threadId={thread.id} postId={reply.id} />
                                                )}
                                                <ReportButton postId={reply.id} showIconOnly className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Reply Form */}
            {!thread.is_locked ? (
                <div className="pt-10">
                    <ReplyForm threadId={id} />
                </div>
            ) : (
                <div className="mt-10 p-8 rounded-3xl bg-destructive/5 border border-destructive/20 text-center text-destructive animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Lock className="w-10 h-10 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-black font-outfit uppercase mb-2">Tópico Fechado</h3>
                    <p className="font-medium text-sm text-destructive/80">Este tópico foi arquivado e não aceita mais comentários.</p>
                </div>
            )}
        </div>
    );
}

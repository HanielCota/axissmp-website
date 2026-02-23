import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pin, Lock, Calendar, MessageSquare, CheckCircle2 } from "lucide-react";
import { ForumAdminActions } from "@/components/forum/ForumAdminActions";
import { BackButton } from "@/components/ui/back-button";
import { PlayerModel } from "@/components/minecraft/PlayerModel";
import { PostReactions } from "@/components/forum/PostReactions";
import { SolveButton } from "@/components/forum/SolveButton";
import { ReportButton } from "@/components/forum/ReportButton";
import { EditButton } from "@/components/forum/EditButton";

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

export default async function ThreadPage({ params }: Props) {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Fetch Thread Details
    const { data: thread, error: threadError } = await supabase
        .from("forum_threads")
        .select(
            `
            *,
            category:forum_categories(name, slug)
        `
        )
        .eq("id", id)
        .single();

    if (threadError || !thread) {
        console.error("Error fetching thread:", threadError);
        notFound();
    }

    // 2. Fetch Replies
    const { data: repliesRaw } = await supabase
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
        .in("post_id", repliesRaw?.map((r) => r.id) || []);

    // 4. Fetch Authors and their post counts
    const userIds = new Set<string>();
    userIds.add(thread.user_id);
    repliesRaw?.forEach((r: RawReply) => userIds.add(r.user_id));
    const uniqueUserIds = Array.from(userIds);

    const [profilesRes, postCountsRes] = await Promise.all([
        supabase.from("profiles").select("id, nickname, role, avatar_url").in("id", uniqueUserIds),
        supabase.from("forum_posts").select("user_id").in("user_id", uniqueUserIds),
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

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

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
            rank: rank,
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
            <BackButton
                href={`/forum/${thread.category?.slug}`}
                label={`Voltar para ${thread.category?.name || "Categoria"}`}
            />

            {/* Thread Header / OP */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="bg-background/50">
                                {thread.category?.name}
                            </Badge>
                            {thread.is_pinned && (
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                                    <Pin className="mr-1 h-3 w-3" /> Fixo
                                </Badge>
                            )}
                            {thread.is_locked && (
                                <Badge
                                    variant="destructive"
                                    className="bg-destructive/10 text-destructive border-destructive/20"
                                >
                                    <Lock className="mr-1 h-3 w-3" /> Fechado
                                </Badge>
                            )}
                        </div>
                        {isAdmin && (
                            <ForumAdminActions
                                threadId={thread.id}
                                isPinned={thread.is_pinned}
                                isLocked={thread.is_locked}
                            />
                        )}
                    </div>
                    <h1 className="font-outfit text-foreground text-3xl font-black tracking-tight md:text-4xl">
                        {thread.title}
                    </h1>
                </div>

                <Card className="border-primary/10 bg-card/60 overflow-hidden shadow-xl shadow-black/20 backdrop-blur-md">
                    <CardHeader className="bg-muted/20 relative flex flex-col items-start gap-8 border-b p-8 md:flex-row">
                        {/* Author Sidebar (Traditional Forum Style) */}
                        <div className="flex w-full min-w-[140px] flex-col items-center gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 shadow-inner md:w-auto">
                            <div className="group relative">
                                <div className="bg-primary/20 absolute -inset-4 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
                                <PlayerModel
                                    nickname={author.username}
                                    mode="body"
                                    size={100}
                                    className="relative z-10"
                                />
                            </div>
                            <div className="space-y-2 text-center">
                                <p className="text-primary text-lg leading-none font-black tracking-tight">
                                    {author.username}
                                </p>
                                <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground h-6 border-none px-2.5 text-[10px] font-black uppercase"
                                >
                                    {author.role}
                                </Badge>
                                <div className="text-muted-foreground/60 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-[9px] font-black tracking-widest uppercase">
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
                        <div className="flex h-full min-w-0 flex-1 flex-col pt-2">
                            <div className="text-muted-foreground/40 mb-8 flex items-center justify-between border-b border-white/5 pb-4 text-[10px] font-black tracking-[0.2em] uppercase">
                                <span className="flex items-center gap-2">
                                    <Calendar className="text-primary/40 h-4 w-4" />
                                    Postado em{" "}
                                    {format(new Date(thread.created_at), "PPP 'às' HH:mm", {
                                        locale: ptBR,
                                    })}
                                </span>
                                <span className="bg-muted border-border/50 text-foreground/50 rounded-md border px-2.5 py-1">
                                    #{thread.id.slice(0, 8)}
                                </span>
                            </div>
                            <div className="prose prose-invert mb-8 max-w-none text-[15px] leading-relaxed font-medium">
                                <Markdown>{thread.content}</Markdown>
                            </div>

                            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                                <PostReactions
                                    postId={thread.id}
                                    initialReactions={threadReactions?.map((r) => ({
                                        ...r,
                                        current_user_id: currentUser?.id,
                                    }))}
                                />
                                <div className="flex items-center gap-2">
                                    {isAuthor && (
                                        <EditButton
                                            postId={thread.id}
                                            initialContent={thread.content}
                                            isThread
                                            className="text-muted-foreground hover:text-primary"
                                        />
                                    )}
                                    <ReportButton
                                        postId={thread.id}
                                        className="text-muted-foreground hover:text-destructive"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Replies List */}
            {repliesRaw && repliesRaw.length > 0 && (
                <div className="space-y-6 pt-10">
                    <div className="border-primary/10 flex items-center gap-3 border-b pb-4">
                        <MessageSquare className="text-primary h-6 w-6" />
                        <h2 className="font-outfit text-2xl font-black tracking-tighter uppercase">
                            Respostas ({repliesRaw.length})
                        </h2>
                    </div>

                    {(repliesRaw as RawReply[]).map((reply, index: number) => {
                        const replyAuthor = getAuthorDisplay(reply.user_id);
                        const isSolved = thread.solved_post_id === reply.id;
                        const currentReactions = postReactions?.filter(
                            (r) => r.post_id === reply.id
                        );

                        return (
                            <Card
                                key={reply.id}
                                id={reply.id}
                                className={cn(
                                    "border-primary/5 bg-card/40 hover:bg-card/60 overflow-hidden transition-all",
                                    isSolved &&
                                    "border-green-500/20 bg-green-500/5 ring-2 ring-green-500/50"
                                )}
                            >
                                <CardContent className="relative flex flex-col items-start gap-8 p-8 md:flex-row">
                                    {isSolved && (
                                        <div className="absolute top-0 right-0 flex items-center gap-2 rounded-bl-xl bg-green-500 px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Melhor Resposta
                                        </div>
                                    )}

                                    {/* Author Side */}
                                    <div className="flex w-full min-w-[120px] flex-col items-center gap-3 md:w-auto md:border-r md:border-white/5 md:pr-8">
                                        <PlayerModel
                                            nickname={replyAuthor.username}
                                            mode="head"
                                            size={64}
                                        />
                                        <div className="space-y-1 text-center">
                                            <p className="text-sm font-bold tracking-tight">
                                                {replyAuthor.username}
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="h-4 px-1.5 text-[8px] leading-none font-black uppercase"
                                            >
                                                {replyAuthor.role}
                                            </Badge>
                                            <div className="text-muted-foreground/60 flex flex-col gap-1 border-t border-white/5 pt-2 text-[8px] font-black tracking-widest uppercase">
                                                <div className="flex justify-between gap-2">
                                                    <span>Rank:</span>
                                                    <span className="text-foreground">
                                                        {replyAuthor.rank}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Posts:</span>
                                                    <span className="text-foreground">
                                                        {replyAuthor.postCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="flex h-full min-w-0 flex-1 flex-col">
                                        <div className="text-muted-foreground/40 mb-4 flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-bold tracking-widest uppercase">
                                            <span>
                                                Em{" "}
                                                {format(
                                                    new Date(reply.created_at),
                                                    "PPP 'às' HH:mm",
                                                    { locale: ptBR }
                                                )}
                                            </span>
                                            <span>#{index + 1}</span>
                                        </div>
                                        <div className="prose prose-invert mb-6 max-w-none text-sm leading-relaxed">
                                            <Markdown>{reply.content}</Markdown>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-4">
                                            <PostReactions
                                                postId={reply.id}
                                                initialReactions={currentReactions?.map((r) => ({
                                                    ...r,
                                                    current_user_id: currentUser?.id,
                                                }))}
                                            />

                                            <div className="flex items-center gap-2">
                                                {currentUser?.id === reply.user_id && (
                                                    <EditButton
                                                        postId={reply.id}
                                                        initialContent={reply.content}
                                                        showIconOnly
                                                        className="text-muted-foreground hover:text-primary h-8 w-8 rounded-lg"
                                                    />
                                                )}
                                                {(isAdmin || isAuthor) &&
                                                    !isSolved &&
                                                    !thread.is_locked && (
                                                        <SolveButton
                                                            threadId={thread.id}
                                                            postId={reply.id}
                                                        />
                                                    )}
                                                <ReportButton
                                                    postId={reply.id}
                                                    showIconOnly
                                                    className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg"
                                                />
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
                <div className="bg-destructive/5 border-destructive/20 text-destructive animate-in fade-in slide-in-from-bottom-4 mt-10 rounded-3xl border p-8 text-center duration-500">
                    <Lock className="mx-auto mb-4 h-10 w-10 opacity-50" />
                    <h3 className="font-outfit mb-2 text-xl font-black uppercase">
                        Tópico Fechado
                    </h3>
                    <p className="text-destructive/80 text-sm font-medium">
                        Este tópico foi arquivado e não aceita mais comentários.
                    </p>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Smile, X } from "lucide-react";
import { toast } from "sonner";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

interface Reaction {
    emoji: string;
    count: number;
    userReacted: boolean;
}

interface InitialReaction {
    emoji: string;
    user_id: string;
    current_user_id?: string;
    post_id?: string;
    thread_id?: string;
}

export function PostReactions({
    postId,
    initialReactions = [],
}: {
    postId: string;
    initialReactions?: InitialReaction[];
}) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const grouped = EMOJIS.map((emoji) => {
            const matches = initialReactions.filter((r) => r.emoji === emoji);
            return {
                emoji,
                count: matches.length,
                userReacted: matches.some(
                    (r) => r.user_id === initialReactions[0]?.current_user_id
                ),
            };
        }).filter((r) => r.count > 0);

        setReactions(grouped);
    }, [initialReactions]);

    const updateReactionsState = (emoji: string, isAdding: boolean) => {
        setReactions((prev) => {
            const match = prev.find((r) => r.emoji === emoji);

            if (!match && isAdding) {
                return [...prev, { emoji, count: 1, userReacted: true }];
            }

            if (!match) return prev;

            const newCount = isAdding ? match.count + 1 : match.count - 1;

            if (newCount <= 0) {
                return prev.filter((r) => r.emoji !== emoji);
            }

            return prev.map((r) =>
                r.emoji === emoji ? { ...r, count: newCount, userReacted: isAdding } : r
            );
        });
    };

    const handleReact = async (emoji: string) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Você precisa estar logado para reagir.");
            return;
        }

        setLoading(true);
        try {
            const existing = reactions.find((r) => r.emoji === emoji && r.userReacted);

            // Remove reaction if exists
            if (existing) {
                await supabase
                    .from("forum_reactions")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("emoji", emoji)
                    .or(`post_id.eq.${postId},thread_id.eq.${postId}`);

                updateReactionsState(emoji, false);
                return;
            }

            // Add reaction - determine if it's a post or thread
            const { data: post } = await supabase
                .from("forum_posts")
                .select("id")
                .eq("id", postId)
                .single();
            const reactionData = post
                ? { post_id: postId, user_id: user.id, emoji }
                : { thread_id: postId, user_id: user.id, emoji };

            await supabase.from("forum_reactions").insert(reactionData);

            updateReactionsState(emoji, true);
            setShowPicker(false);
        } catch (error) {
            console.error("Error reacting:", error);
            toast.error("Erro ao processar reação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative mt-4 flex items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
                {reactions.map((r) => (
                    <Button
                        key={r.emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReact(r.emoji)}
                        disabled={loading}
                        className={cn(
                            "hover:bg-primary/10 h-8 rounded-full border border-white/5 bg-white/5 px-3 py-0 transition-all duration-300",
                            r.userReacted &&
                                "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(254,176,93,0.2)]"
                        )}
                    >
                        <span className="mr-2 text-base">{r.emoji}</span>
                        <span className="font-outfit text-[11px] font-black">{r.count}</span>
                    </Button>
                ))}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPicker(!showPicker)}
                    className={cn(
                        "text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 rounded-full border border-white/5 bg-white/5 transition-all duration-300",
                        showPicker && "bg-primary text-primary-foreground border-primary"
                    )}
                >
                    {showPicker ? (
                        <X className="h-3.5 w-3.5" />
                    ) : (
                        <Smile className="h-5 w-5" strokeWidth={2.5} />
                    )}
                </Button>

                {showPicker && (
                    <div className="bg-card/80 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 absolute bottom-12 left-0 z-50 flex gap-1.5 rounded-2xl border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl duration-300">
                        {EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleReact(emoji)}
                                className="hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-2xl transition-all duration-300 hover:scale-125 active:scale-95"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

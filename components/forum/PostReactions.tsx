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

export function PostReactions({ postId, initialReactions = [] }: { postId: string, initialReactions?: InitialReaction[] }) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const grouped = EMOJIS.map(emoji => {
            const matches = initialReactions.filter(r => r.emoji === emoji);
            return {
                emoji,
                count: matches.length,
                userReacted: matches.some(r => r.user_id === initialReactions[0]?.current_user_id)
            };
        }).filter(r => r.count > 0);

        setReactions(grouped);
    }, [initialReactions]);

    const updateReactionsState = (emoji: string, isAdding: boolean) => {
        setReactions(prev => {
            const match = prev.find(r => r.emoji === emoji);

            if (!match && isAdding) {
                return [...prev, { emoji, count: 1, userReacted: true }];
            }

            if (!match) return prev;

            const newCount = isAdding ? match.count + 1 : match.count - 1;

            if (newCount <= 0) {
                return prev.filter(r => r.emoji !== emoji);
            }

            return prev.map(r =>
                r.emoji === emoji ? { ...r, count: newCount, userReacted: isAdding } : r
            );
        });
    };

    const handleReact = async (emoji: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Você precisa estar logado para reagir.");
            return;
        }

        setLoading(true);
        try {
            const existing = reactions.find(r => r.emoji === emoji && r.userReacted);

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
            const { data: post } = await supabase.from("forum_posts").select("id").eq("id", postId).single();
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
        <div className="flex items-center gap-2 mt-4 relative">
            <div className="flex items-center gap-2 flex-wrap">
                {reactions.map((r) => (
                    <Button
                        key={r.emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReact(r.emoji)}
                        disabled={loading}
                        className={cn(
                            "h-8 px-3 py-0 rounded-full bg-white/5 hover:bg-primary/10 border border-white/5 transition-all duration-300",
                            r.userReacted && "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(254,176,93,0.2)]"
                        )}
                    >
                        <span className="text-base mr-2">{r.emoji}</span>
                        <span className="text-[11px] font-black font-outfit">{r.count}</span>
                    </Button>
                ))}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPicker(!showPicker)}
                    className={cn(
                        "h-8 w-8 rounded-full bg-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-white/5 transition-all duration-300",
                        showPicker && "bg-primary text-primary-foreground border-primary"
                    )}
                >
                    {showPicker ? <X className="h-3.5 w-3.5" /> : <Smile className="h-5 w-5" strokeWidth={2.5} />}
                </Button>

                {showPicker && (
                    <div className="absolute bottom-12 left-0 z-50 flex gap-1.5 p-2 bg-card/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
                        {EMOJIS.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => handleReact(emoji)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-primary/20 hover:scale-125 rounded-xl transition-all duration-300 text-2xl active:scale-95"
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

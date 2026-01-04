import { createClient } from "@/lib/supabase/server";
import { ThreadList } from "@/components/forum/ThreadList";
import { CreateThreadButton } from "@/components/forum/CreateThreadButton";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ForumThread } from "@/types/forum";
import { ForumSearch } from "@/components/forum/ForumSearch";
import { ForumPagination } from "@/components/forum/ForumPagination";

// Types for raw Supabase data
interface RawThread {
    id: string;
    category_id: string;
    user_id: string;
    title: string;
    content: string;
    view_count: number;
    is_pinned: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
    forum_posts?: { count: number }[];
}

interface Profile {
    id: string;
    nickname: string;
    role: string;
    avatar_url: string | null;
}

interface Props {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
}

// Force dynamic rendering to ensure we always get the latest threads
export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }: Props) {
    const supabase = await createClient();
    const { category } = await params;
    const { page = "1", q = "" } = await searchParams;
    const currentPage = parseInt(page);
    const itemsPerPage = 20;

    // 1. Fetch category details
    const { data: categoryData, error: categoryError } = await supabase
        .from("forum_categories")
        .select("*")
        .eq("slug", category)
        .single();

    if (categoryError || !categoryData) {
        console.error("Error fetching category:", categoryError);
        notFound();
    }

    // 2. Fetch threads for this category along with post counts
    // Using explicit select for count
    let query = supabase
        .from("forum_threads")
        .select("*, forum_posts(count)", { count: "exact" })
        .eq("category_id", categoryData.id);

    // Apply Search
    if (q) {
        query.ilike("title", `%${q}%`);
    }

    // Apply Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data: threadsRaw, error: threadsError, count } = await query
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .range(start, end);

    if (threadsError) {
        console.error("Error fetching threads:", threadsError);
        // Handle error gracefully or show specific UI
    }

    const threads = threadsRaw || [];

    // 3. Fetch Profiles for Authors
    const userIds = Array.from(new Set(threads.map((t: RawThread) => t.user_id)));
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nickname, role, avatar_url")
        .in("id", userIds);

    const profileMap = new Map<string, Profile>();
    (profiles as Profile[] | null)?.forEach((p) => {
        profileMap.set(p.id, p);
    });

    // 4. Transform to ForumThread Type
    const threadsFormatted: ForumThread[] = threads.map((thread: RawThread) => {
        const profile = profileMap.get(thread.user_id);
        const nickname = profile?.nickname || "Jogador";
        // Use profile avatar if available, structure url
        const avatarUrl = profile?.avatar_url || `https://mc-heads.net/avatar/${nickname}/32`;

        return {
            id: thread.id,
            category_id: thread.category_id,
            user_id: thread.user_id,
            title: thread.title,
            content: thread.content,
            view_count: thread.view_count,
            is_pinned: thread.is_pinned,
            is_locked: thread.is_locked,
            created_at: thread.created_at,
            updated_at: thread.updated_at,
            last_reply_at: thread.updated_at,
            reply_count: thread.forum_posts?.[0]?.count || 0,
            author: {
                username: nickname,
                avatar_url: avatarUrl,
                role: profile?.role // Optional
            }
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-primary">{categoryData.name}</h1>
                    <p className="text-muted-foreground">{categoryData.description}</p>
                </div>
                <CreateThreadButton categorySlug={category} />
            </div>

            <div className="mb-6">
                <ForumSearch placeholder={`Pesquisar em ${categoryData.name}...`} />
            </div>

            <Separator />

            <ThreadList threads={threadsFormatted} />

            <ForumPagination totalItems={count || 0} itemsPerPage={itemsPerPage} />
        </div>
    );
}

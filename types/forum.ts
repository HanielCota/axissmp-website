export interface ForumCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    order_index: number;
    threadCount?: number;
}

export interface ForumAuthor {
    username: string;
    avatar_url: string;
    role?: string;
}

export interface ForumThread {
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
    last_reply_at?: string;
    // Computed/Joined fields
    author: ForumAuthor;
    reply_count: number;
    category?: {
        name: string;
        slug: string;
    };
}

export interface ForumPost {
    id: string;
    thread_id: string;
    user_id: string;
    content: string;
    is_solution: boolean;
    created_at: string;
    updated_at: string;
    // Computed/Joined
    author?: ForumAuthor;
}

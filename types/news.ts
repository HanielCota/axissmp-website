export type NewsCategory = "update" | "event" | "maintenance" | "announcement";

export interface NewsPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: NewsCategory;
    author: string;
    image?: string;
}

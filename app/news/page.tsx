import { getPosts } from "@/app/actions/posts";
import { NewsClient, UIPost } from "@/components/news/NewsClient";
import { NewsCategory } from "@/types/news";
import { Footer } from "@/components/layout/Footer";
import { Post } from "@/components/landing/NewsSection";

export default async function NewsPage() {
    const { data: posts } = await getPosts();

    const formattedPosts: UIPost[] = (posts || []).map((post: Post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category as NewsCategory,
        author: post.author,
        date: new Date(post.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        image: post.image
    }));

    return (
        <>
            <NewsClient initialPosts={formattedPosts} />
            <Footer />
        </>
    );
}

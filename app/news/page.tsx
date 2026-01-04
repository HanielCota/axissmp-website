
import { getPosts } from "@/app/actions/posts";
import { NewsClient, UIPost } from "@/components/news/NewsClient";
import { NewsCategory } from "@/lib/news-data";
import { Footer } from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const { data: posts } = await getPosts();

    const formattedPosts: UIPost[] = (posts || []).map((post) => ({
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

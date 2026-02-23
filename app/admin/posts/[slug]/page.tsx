import PostForm from "@/components/admin/PostForm";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <PostForm slugParam={slug} />;
}

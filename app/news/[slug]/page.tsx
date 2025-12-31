
import { getPost } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Calendar, User, Tag, Bell, Wrench, ShieldAlert, type LucideIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    update: { label: "Atualização", color: "text-green-500 bg-green-500/10", icon: Bell },
    event: { label: "Evento", color: "text-purple-500 bg-purple-500/10", icon: Tag },
    maintenance: { label: "Manutenção", color: "text-red-500 bg-red-500/10", icon: Wrench },
    announcement: { label: "Anúncio", color: "text-blue-500 bg-blue-500/10", icon: ShieldAlert },
};

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: post } = await getPost(slug);

    if (!post) {
        notFound();
    }

    const CategoryIcon = categoryConfig[post.category]?.icon || Bell;
    const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <main className="bg-background selection:bg-brand-orange/30 relative min-h-screen">
            <Navbar />

            {/* Background */}
            <div className="absolute top-0 left-0 -z-10 h-[500px] w-full overflow-hidden">
                <div className="bg-brand-dark/5 absolute top-[-20%] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full blur-[120px]" />
                <div className="bg-noise absolute top-0 left-0 h-full w-full opacity-[0.05]" />
            </div>

            <article className="mx-auto max-w-4xl px-6 pt-32 pb-20 md:px-8">
                {/* Navigation */}
                <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Link
                        href="/news"
                        className="text-brand-dark/50 hover:text-brand-orange group inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-colors"
                    >
                        <div className="border-brand-dark/10 group-hover:border-brand-orange/30 flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-colors">
                            <ChevronLeft size={16} />
                        </div>
                        Voltar para Notícias
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold tracking-wider uppercase",
                                categoryConfig[post.category]?.color || "text-gray-500 bg-gray-500/10"
                            )}
                        >
                            <CategoryIcon size={16} />
                            {categoryConfig[post.category]?.label || post.category}
                        </span>
                        <span className="text-brand-dark/50 flex items-center gap-2 text-sm font-medium">
                            <Calendar size={16} /> {formattedDate}
                        </span>
                    </div>

                    <h1 className="text-brand-dark mb-6 text-4xl leading-[1.1] font-black md:text-6xl">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-3 md:justify-start">
                        <div className="bg-brand-dark flex h-10 w-10 items-center justify-center rounded-full text-white">
                            <User size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-brand-dark text-sm font-bold">Publicado por</div>
                            <div className="text-brand-dark/60 text-sm font-medium">
                                {post.author}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="border-brand-dark/5 rounded-[2.5rem] border bg-white p-8 shadow-sm md:p-12 animate-in fade-in duration-500 delay-200">
                    <div className="prose prose-lg prose-headings:font-bold prose-headings:text-brand-dark prose-p:text-brand-dark/70 prose-strong:text-brand-dark prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-li:text-brand-dark/70 max-w-none">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </article>
        </main>
    );
}

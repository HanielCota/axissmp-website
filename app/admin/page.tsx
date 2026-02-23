import { getProducts } from "@/lib/actions/products";
import { getPosts } from "@/lib/actions/posts";
import { getOrdersStats } from "@/lib/actions/orders";
import { getTicketsStats } from "@/lib/actions/tickets";
import { ShoppingBag, FileText, Users, TrendingUp, Package, MessageSquare } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/store";
import { Post } from "@/components/landing/NewsSection";

export default async function AdminDashboardPage() {
    const { data: products } = await getProducts();
    const { data: posts } = await getPosts();
    const { data: ordersStatsData } = await getOrdersStats();
    const { data: ticketsStatsData } = await getTicketsStats();

    const ordersStats = ordersStatsData || { totalSales: 0, pendingCount: 0, paidCount: 0 };
    const ticketsStats = ticketsStatsData || { openCount: 0, answeredCount: 0, closedCount: 0 };

    // Fetch user count
    const supabase = await createClient();
    const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    const stats = [
        {
            label: "Produtos Ativos",
            value: products?.length || 0,
            icon: ShoppingBag,
            color: "text-brand-orange",
            bg: "bg-brand-orange/10",
            href: "/admin/products",
        },
        {
            label: "Notícias Publicadas",
            value: posts?.length || 0,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/admin/posts",
        },
        {
            label: "Usuários Registrados",
            value: userCount || 0,
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/admin/users",
        },
        {
            label: "Vendas Totais",
            value: `R$ ${ordersStats.totalSales.toFixed(2)}`,
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/admin/orders",
        },
        {
            label: "Pedidos Pendentes",
            value: ordersStats.pendingCount,
            icon: Package,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            href: "/admin/orders",
        },
        {
            label: "Tickets Abertos",
            value: ticketsStats.openCount,
            icon: MessageSquare,
            color: "text-red-500",
            bg: "bg-red-500/10",
            href: "/admin/tickets",
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase italic">Visão Geral</h2>
                <p className="font-medium text-white/40">Bem-vindo ao painel administrativo.</p>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href} className="group block">
                        <div className="h-full rounded-3xl border border-white/5 bg-black/20 p-6 backdrop-blur-sm transition-all group-hover:scale-[1.02] group-hover:bg-black/30">
                            <div className="mb-4 flex items-start justify-between">
                                <div className={`rounded-2xl p-3 ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div>
                                <span className="mb-1 block text-xs font-black tracking-widest text-white/30 uppercase">
                                    {stat.label}
                                </span>
                                <span className="text-3xl font-black tracking-tight text-white">
                                    {stat.value}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                    <h3 className="mb-6 text-xl font-bold">Últimos Produtos</h3>
                    <div className="space-y-4">
                        {products?.slice(0, 5).map((product: Product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                            >
                                <div
                                    className={`h-10 w-10 rounded-xl ${product.color || "bg-white/10"} flex items-center justify-center`}
                                >
                                    <ShoppingBag size={16} className="text-white/50" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold">{product.name}</h4>
                                    <span className="text-xs tracking-wider text-white/40 uppercase">
                                        {product.category}
                                    </span>
                                </div>
                                <span className="text-brand-orange font-bold">
                                    R$ {product.price}
                                </span>
                            </div>
                        ))}
                        {(!products || products.length === 0) && (
                            <p className="text-sm text-white/40">Nenhum produto cadastrado.</p>
                        )}
                        <Link
                            href="/admin/products"
                            className="text-brand-orange hover:text-brand-orange/80 mt-4 block text-center text-sm font-bold transition-colors"
                        >
                            Ver todos
                        </Link>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                    <h3 className="mb-6 text-xl font-bold">Últimas Notícias</h3>
                    <div className="space-y-4">
                        {posts?.slice(0, 5).map((post: Post) => (
                            <div
                                key={post.slug}
                                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                            >
                                <div className="flex-1">
                                    <h4 className="line-clamp-1 text-sm font-bold">{post.title}</h4>
                                    <span className="text-xs tracking-wider text-white/40 uppercase">
                                        {post.category} •{" "}
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!posts || posts.length === 0) && (
                            <p className="text-sm text-white/40">Nenhuma notícia cadastrada.</p>
                        )}
                        <Link
                            href="/admin/posts"
                            className="text-brand-orange hover:text-brand-orange/80 mt-4 block text-center text-sm font-bold transition-colors"
                        >
                            Ver todas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

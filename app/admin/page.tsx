import { getProducts } from "@/app/actions/products";
import { getPosts } from "@/app/actions/posts";
import { getOrdersStats } from "@/app/actions/orders";
import { getTicketsStats } from "@/app/actions/tickets";
import { ShoppingBag, FileText, Users, TrendingUp, Package, MessageSquare } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const { data: products } = await getProducts();
    const { data: posts } = await getPosts();
    const ordersStats = await getOrdersStats();
    const ticketsStats = await getTicketsStats();

    // Fetch user count
    const supabase = await createClient();
    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    const stats = [
        {
            label: "Produtos Ativos",
            value: products?.length || 0,
            icon: ShoppingBag,
            color: "text-brand-orange",
            bg: "bg-brand-orange/10",
            href: "/admin/products"
        },
        {
            label: "Notícias Publicadas",
            value: posts?.length || 0,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/admin/posts"
        },
        {
            label: "Usuários Registrados",
            value: userCount || 0,
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/admin/users"
        },
        {
            label: "Vendas Totais",
            value: `R$ ${ordersStats.totalSales.toFixed(2)}`,
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/admin/orders"
        },
        {
            label: "Pedidos Pendentes",
            value: ordersStats.pendingCount,
            icon: Package,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            href: "/admin/orders"
        },
        {
            label: "Tickets Abertos",
            value: ticketsStats.openCount,
            icon: MessageSquare,
            color: "text-red-500",
            bg: "bg-red-500/10",
            href: "/admin/tickets"
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tight">Visão Geral</h2>
                <p className="text-white/40 font-medium">Bem-vindo ao painel administrativo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.href}
                        className="block group"
                    >
                        <div className="h-full rounded-3xl border border-white/5 bg-black/20 p-6 transition-all group-hover:bg-black/30 group-hover:scale-[1.02] backdrop-blur-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`rounded-2xl p-3 ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</span>
                                <span className="text-3xl font-black tracking-tight text-white">{stat.value}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-6">Últimos Produtos</h3>
                    <div className="space-y-4">
                        {products?.slice(0, 5).map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className={`w-10 h-10 rounded-xl ${product.color || 'bg-white/10'} flex items-center justify-center`}>
                                    <ShoppingBag size={16} className="text-white/50" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{product.name}</h4>
                                    <span className="text-xs text-white/40 uppercase tracking-wider">{product.category}</span>
                                </div>
                                <span className="font-bold text-brand-orange">R$ {product.price}</span>
                            </div>
                        ))}
                        {(!products || products.length === 0) && (
                            <p className="text-white/40 text-sm">Nenhum produto cadastrado.</p>
                        )}
                        <Link href="/admin/products" className="block text-center text-sm font-bold text-brand-orange hover:text-brand-orange/80 mt-4 transition-colors">
                            Ver todos
                        </Link>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-6">Últimas Notícias</h3>
                    <div className="space-y-4">
                        {posts?.slice(0, 5).map((post) => (
                            <div key={post.slug} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm line-clamp-1">{post.title}</h4>
                                    <span className="text-xs text-white/40 uppercase tracking-wider">{post.category} • {new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {(!posts || posts.length === 0) && (
                            <p className="text-white/40 text-sm">Nenhuma notícia cadastrada.</p>
                        )}
                        <Link href="/admin/posts" className="block text-center text-sm font-bold text-brand-orange hover:text-brand-orange/80 mt-4 transition-colors">
                            Ver todas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

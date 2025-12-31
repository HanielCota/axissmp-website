import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    Users,
    Home,
    Package,
    MessageSquare
} from "lucide-react";
import { Toaster } from "sonner";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileMenu } from "@/components/admin/AdminMobileMenu";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-brand-dark text-white selection:bg-brand-orange/30 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-black uppercase italic tracking-tight">
                        Axis<span className="text-brand-orange">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-bold text-sm">Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <ShoppingBag size={20} />
                        <span className="font-bold text-sm">Produtos</span>
                    </Link>
                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <FileText size={20} />
                        <span className="font-bold text-sm">Notícias</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <Package size={20} />
                        <span className="font-bold text-sm">Pedidos</span>
                    </Link>
                    <Link
                        href="/admin/tickets"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <MessageSquare size={20} />
                        <span className="font-bold text-sm">Tickets</span>
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <Users size={20} />
                        <span className="font-bold text-sm">Usuários</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <Home size={20} />
                        <span className="font-bold text-sm">Voltar ao Site</span>
                    </Link>
                    <AdminLogoutButton />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center px-6 justify-between">
                <h1 className="text-lg font-black uppercase italic tracking-tight">
                    Axis<span className="text-brand-orange">Admin</span>
                </h1>
                <AdminMobileMenu />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Toaster richColors theme="dark" position="bottom-right" />
        </div>
    );
}

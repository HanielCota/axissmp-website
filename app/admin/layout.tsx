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
    MessageSquare,
} from "lucide-react";
import { Toaster } from "sonner";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileMenu } from "@/components/admin/AdminMobileMenu";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="selection:bg-brand-orange/30 flex h-screen bg-zinc-950 font-sans text-white">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl md:flex">
                <div className="border-b border-white/10 p-6">
                    <h1 className="text-xl font-black tracking-tight uppercase italic">
                        Axis<span className="text-brand-orange">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-bold">Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <ShoppingBag size={20} />
                        <span className="text-sm font-bold">Produtos</span>
                    </Link>
                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <FileText size={20} />
                        <span className="text-sm font-bold">Notícias</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <Package size={20} />
                        <span className="text-sm font-bold">Pedidos</span>
                    </Link>
                    <Link
                        href="/admin/tickets"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <MessageSquare size={20} />
                        <span className="text-sm font-bold">Tickets</span>
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <Users size={20} />
                        <span className="text-sm font-bold">Usuários</span>
                    </Link>
                </nav>

                <div className="space-y-2 border-t border-white/10 p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <Home size={20} />
                        <span className="text-sm font-bold">Voltar ao Site</span>
                    </Link>
                    <AdminLogoutButton />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-6 backdrop-blur-xl md:hidden">
                <h1 className="text-lg font-black tracking-tight uppercase italic">
                    Axis<span className="text-brand-orange">Admin</span>
                </h1>
                <AdminMobileMenu />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                <div className="mx-auto max-w-7xl p-6 md:p-12">{children}</div>
            </main>
            <Toaster richColors theme="dark" position="bottom-right" />
        </div>
    );
}

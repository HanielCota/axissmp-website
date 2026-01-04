"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Gamepad2,
    ShoppingBag,
    Newspaper,
    LifeBuoy,
    BookOpen,
    ShieldCheck
} from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-white/5 pt-12 pb-8 overflow-hidden text-slate-900 dark:text-slate-100">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">

                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:border-brand-orange/50 transition-colors">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="AxisSMP Logo"
                                        fill
                                        sizes="48px"
                                        className="object-contain p-2"
                                    />
                                </div>
                                <span className="text-2xl font-black italic tracking-tighter">
                                    AXIS<span className="text-brand-orange">SMP</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-sm">
                            A nova era do survival está aqui. Uma comunidade apaixonada, economia equilibrada e eventos épicos te esperam.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://discord.gg/axissmp" target="_blank" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-orange hover:border-brand-orange/50 transition-all hover:-translate-y-1">
                                <Gamepad2 size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-orange hover:border-brand-orange/50 transition-all hover:-translate-y-1">
                                <ShieldCheck size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Servidor</h4>
                        <ul className="space-y-4">
                            <li><Link href="/store" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group"><ShoppingBag size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Loja</Link></li>
                            <li><Link href="/news" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group"><Newspaper size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Notícias</Link></li>
                            <li><Link href="/rules" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group"><ShieldCheck size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Regras</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Suporte</h4>
                        <ul className="space-y-4">
                            <li><Link href="/wiki" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group"><BookOpen size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Wiki</Link></li>
                            <li><Link href="/support" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors flex items-center gap-2 group"><LifeBuoy size={16} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Tickets</Link></li>
                        </ul>
                    </div>

                    {/* Server IP Copy */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Jogue Agora</h4>
                        <div className="relative group cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText("jogar.axissmp.com");
                        }}>
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-blue opacity-10 blur group-hover:opacity-20 transition-opacity" />
                            <div className="relative bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-colors group-hover:border-slate-200 dark:group-hover:border-white/20">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">IP do Servidor</p>
                                    <p className="text-lg font-black italic tracking-tighter">jogar.axissmp.com</p>
                                </div>
                                <div className="bg-white dark:bg-black/40 p-2 rounded-xl border border-slate-100 dark:border-white/5 group-hover:bg-brand-orange/10 transition-colors">
                                    <Gamepad2 className="text-slate-400 group-hover:text-brand-orange transition-colors" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} AxisSMP. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

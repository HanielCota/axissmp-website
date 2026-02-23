"use client";

import Link from "next/link";
import Image from "next/image";
import { Gamepad2, ShoppingBag, Newspaper, LifeBuoy, BookOpen, ShieldCheck } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-slate-100 bg-slate-50 pt-12 pb-8 text-slate-900 dark:border-white/5 dark:bg-black dark:text-slate-100">
            {/* Background Decor */}
            <div className="bg-brand-blue/5 pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px]" />
            <div className="bg-brand-orange/5 pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
                <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="space-y-6 lg:col-span-4">
                        <Link href="/" className="group inline-block">
                            <div className="flex items-center gap-3">
                                <div className="group-hover:border-brand-orange/50 relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 transition-colors dark:border-white/10 dark:bg-white/5">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="AxisSMP Logo"
                                        fill
                                        sizes="48px"
                                        className="object-contain p-2"
                                    />
                                </div>
                                <span className="text-2xl font-black tracking-tighter italic">
                                    AXIS<span className="text-brand-orange">SMP</span>
                                </span>
                            </div>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            A nova era do survival está aqui. Uma comunidade apaixonada, economia
                            equilibrada e eventos épicos te esperam.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://discord.gg/axissmp"
                                target="_blank"
                                className="hover:text-brand-orange hover:border-brand-orange/50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-all hover:-translate-y-1 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                            >
                                <Gamepad2 size={20} />
                            </a>
                            <a
                                href="#"
                                className="hover:text-brand-orange hover:border-brand-orange/50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-all hover:-translate-y-1 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                            >
                                <ShieldCheck size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6 lg:col-span-2">
                        <h4 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Servidor
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/store"
                                    className="hover:text-brand-orange group flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors dark:text-slate-300"
                                >
                                    <ShoppingBag
                                        size={16}
                                        className="-ml-5 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                                    />{" "}
                                    Loja
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/news"
                                    className="hover:text-brand-orange group flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors dark:text-slate-300"
                                >
                                    <Newspaper
                                        size={16}
                                        className="-ml-5 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                                    />{" "}
                                    Notícias
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/rules"
                                    className="hover:text-brand-orange group flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors dark:text-slate-300"
                                >
                                    <ShieldCheck
                                        size={16}
                                        className="-ml-5 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                                    />{" "}
                                    Regras
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        <h4 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Suporte
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/wiki"
                                    className="hover:text-brand-orange group flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors dark:text-slate-300"
                                >
                                    <BookOpen
                                        size={16}
                                        className="-ml-5 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                                    />{" "}
                                    Wiki
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/support"
                                    className="hover:text-brand-orange group flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors dark:text-slate-300"
                                >
                                    <LifeBuoy
                                        size={16}
                                        className="-ml-5 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                                    />{" "}
                                    Tickets
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Server IP Copy */}
                    <div className="space-y-6 lg:col-span-4">
                        <h4 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Jogue Agora
                        </h4>
                        <div
                            className="group relative cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText("jogar.axissmp.com");
                            }}
                        >
                            <div className="from-brand-orange to-brand-blue absolute -inset-1 bg-gradient-to-r opacity-10 blur transition-opacity group-hover:opacity-20" />
                            <div className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors group-hover:border-slate-200 dark:border-white/10 dark:bg-white/5 dark:group-hover:border-white/20">
                                <div>
                                    <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-white/60">
                                        IP do Servidor
                                    </p>
                                    <p className="text-lg font-black tracking-tighter italic">
                                        jogar.axissmp.com
                                    </p>
                                </div>
                                <div className="group-hover:bg-brand-orange/10 rounded-xl border border-slate-100 bg-white p-2 transition-colors dark:border-white/5 dark:bg-black/40">
                                    <Gamepad2
                                        className="group-hover:text-brand-orange text-slate-400 transition-colors"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 md:flex-row lg:gap-0 dark:border-white/5">
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                        &copy; {new Date().getFullYear()} AxisSMP. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link
                            href="/terms"
                            className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            Termos de Uso
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            Privacidade
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

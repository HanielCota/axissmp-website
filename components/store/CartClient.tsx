"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CreditCard,
    X,
    ShieldCheck,
    HelpCircle,
    Check,
    Zap,
    Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useCart, formatPrice } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { siteConfig } from "@/lib/config/site";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Helper for steps
const steps = [
    { number: 1, label: "Carrinho" },
    { number: 2, label: "Pagamento" },
];

const faqs = [
    {
        q: "Quanto tempo demora a entrega?",
        a: "A entrega é automática! Geralmente ocorre entre 1 a 5 minutos após a confirmação do pagamento.",
        icon: <Zap className="text-brand-orange" size={20} />,
    },
    {
        q: "Como recebo meus itens?",
        a: "Eles serão ativados diretamente no servidor para o seu nickname digitado. Certifique-se de estar online.",
        icon: <Check className="text-green-500" size={20} />,
    },
    {
        q: "Posso pedir reembolso?",
        a: "Por se tratar de produtos digitais ativados instantaneamente, não oferecemos reembolsos após a entrega.",
        icon: <X className="text-red-500" size={20} />,
    },
];

export function CartClient() {
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, nickname, clearCart } =
        useCart();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Calculates savings (Using centralized config)
    const savings = 0; // Future dynamic coupon logic goes here
    const pixPrice = totalPrice * (1 - siteConfig.payment.pixDiscount);

    const handleCheckout = async () => {
        if (!acceptedTerms) return;
        setIsProcessing(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Você precisa estar logado para finalizar a compra.");
            router.push("/login?returnUrl=/cart");
            setIsProcessing(false);
            return;
        }

        // Create order in Supabase
        const { error } = await supabase.from("orders").insert({
            user_id: user.id,
            nickname: nickname || user.user_metadata?.nickname || "Steve",
            items: items,
            total_amount: totalPrice,
            status: "pending",
        });

        if (error) {
            console.error("Error creating order:", error);
            toast.error("Erro ao processar pedido. Tente novamente.");
            setIsProcessing(false);
            return;
        }

        toast.success("Pedido realizado com sucesso!");
        clearCart();
        router.push("/dashboard");
    };

    return (
        <div className="bg-brand-light dark:bg-background text-brand-dark relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans transition-colors duration-300 dark:text-white">
            {/* Dark Header Background for Contrast (Matches Store Page) */}
            <div className="bg-brand-dark/5 fixed top-0 right-0 left-0 -z-10 h-[400px] dark:bg-white/5" />

            <Navbar />

            <main className="z-0 container mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-40 pb-24 lg:px-8">
                {/* 1. Progress Stepper */}
                <div className="mb-12 flex w-full justify-center">
                    <div className="flex items-center gap-2 text-sm sm:gap-4 md:gap-8 md:text-base">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="flex items-center gap-2 sm:gap-4 md:gap-8"
                            >
                                <div
                                    className={`flex items-center gap-2 ${step.number === 1 ? "text-brand-orange font-bold" : "text-brand-dark/30 dark:text-white/30"}`}
                                >
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs md:text-sm ${step.number === 1 ? "border-brand-orange bg-brand-orange text-brand-dark" : "border-brand-dark/20 bg-transparent dark:border-white/20"}`}
                                    >
                                        {step.number}
                                    </span>
                                    <span>{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="bg-brand-dark/10 h-[1px] w-8 md:w-16 dark:bg-white/10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Alert Banner - Removed Artificial Scarcity */}

                {items.length === 0 ? (
                    <div className="border-brand-dark/5 flex w-full flex-1 flex-col items-center justify-center rounded-2xl border bg-white p-8 text-center shadow-sm transition-colors dark:border-white/10 dark:bg-zinc-900">
                        <div className="bg-brand-light mb-6 flex h-20 w-20 items-center justify-center rounded-full dark:bg-white/5">
                            <ShoppingBag
                                size={40}
                                className="text-brand-dark/20 dark:text-white/20"
                            />
                        </div>
                        <h2 className="text-brand-dark mb-2 text-2xl font-black dark:text-white">
                            Seu carrinho está vazio
                        </h2>
                        <p className="text-brand-dark/50 mb-8 max-w-sm dark:text-white/50">
                            Você ainda não escolheu seus produtos. Navegue na loja para encontrar o
                            que precisa.
                        </p>
                        <Link href="/store">
                            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-dark rounded-xl px-8 py-6 font-black">
                                Voltar para a Loja
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="w-full space-y-8">
                        {/* Player Identity Section */}
                        {nickname && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl md:flex-row dark:border-white/10 dark:bg-zinc-900"
                            >
                                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-2 md:h-32 md:w-32">
                                    <Image
                                        src={`https://mc-heads.net/body/${nickname}/100`}
                                        alt={`Minecraft skin de ${nickname}`}
                                        fill
                                        className="object-contain"
                                        quality={100}
                                        unoptimized // Skins change and we want it fresh
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="mb-1 text-xs font-black tracking-widest text-zinc-500 uppercase">
                                        Comprando para a conta:
                                    </p>
                                    <h2 className="mb-2 text-3xl font-black text-white">
                                        {nickname}
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 md:justify-start">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="text-sm font-medium text-zinc-400">
                                            Nickname configurado e pronto para receber
                                        </span>
                                    </div>
                                </div>
                                <div className="md:ml-auto">
                                    <Link href="/store">
                                        <Button
                                            variant="ghost"
                                            className="text-xs font-bold tracking-wider text-zinc-400 uppercase hover:bg-white/5 hover:text-white"
                                        >
                                            Alterar Nickname
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        <div className="border-brand-dark/5 w-full rounded-3xl border bg-white p-6 shadow-sm transition-colors md:p-8 dark:border-white/10 dark:bg-zinc-900">
                            {/* 3. Items Table */}
                            <div className="mb-12">
                                {/* Desktop Headers */}
                                <div className="border-brand-dark/5 text-brand-dark/40 hidden grid-cols-[3fr_1fr_1fr] gap-4 border-b pb-4 text-sm font-black tracking-wider uppercase md:grid dark:border-white/10 dark:text-white/40">
                                    <div>Produtos</div>
                                    <div className="text-center">Quantidade</div>
                                    <div className="text-right">Valor Total</div>
                                </div>

                                {/* List */}
                                <div className="text-brand-dark space-y-4 md:space-y-0 dark:text-white">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border-brand-dark/5 group relative flex flex-col gap-4 border-b py-6 last:border-0 md:grid md:grid-cols-[3fr_1fr_1fr] md:items-center dark:border-white/5"
                                        >
                                            {/* Product Info */}
                                            <div className="flex items-start gap-4 md:items-center">
                                                <div className="bg-brand-light border-brand-dark/5 relative h-20 w-20 shrink-0 rounded-lg border p-2 dark:border-white/10 dark:bg-zinc-950">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain"
                                                            sizes="80px"
                                                            quality={100}
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <ShoppingBag
                                                                size={24}
                                                                className="text-brand-dark/20 dark:text-white/20"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 text-lg leading-tight font-bold dark:text-white">
                                                        {item.name}
                                                    </h3>
                                                    <div className="text-brand-dark/40 space-y-0.5 text-sm dark:text-white/40">
                                                        <p>Entrega Automática</p>
                                                        <p className="capitalize">
                                                            Categoria: {item.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="mt-4 flex items-center justify-between md:mt-0 md:justify-center">
                                                <span className="text-brand-dark/50 text-sm font-medium md:hidden dark:text-white/50">
                                                    Quantidade:
                                                </span>
                                                {item.category === "coins" ? (
                                                    <div className="border-brand-dark/10 bg-brand-light/50 flex items-center rounded-lg border dark:border-white/10 dark:bg-white/5">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus
                                                                size={14}
                                                                className="text-brand-dark/60 dark:text-white/60"
                                                            />
                                                        </button>
                                                        <span className="text-brand-dark w-12 text-center font-bold tabular-nums dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                                                        >
                                                            <Plus
                                                                size={14}
                                                                className="text-brand-dark/60 dark:text-white/60"
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-brand-dark/5 text-brand-dark/40 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold dark:bg-white/5 dark:text-white/40">
                                                        <Check size={14} /> Unitário
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="mt-2 flex items-center justify-between md:mt-0 md:flex-col md:items-end md:justify-center">
                                                <span className="text-brand-dark/50 text-sm font-medium md:hidden dark:text-white/50">
                                                    Total:
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-brand-dark text-lg font-black tracking-tight md:text-xl dark:text-white">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold tracking-wider text-red-500 uppercase transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                                                    title="Remover item"
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="transition-transform group-hover:scale-110"
                                                    />
                                                    <span>Remover</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Footer Section (3 Columns) */}
                            <div className="border-brand-dark/10 grid grid-cols-1 gap-8 border-t pt-8 lg:grid-cols-3 lg:gap-12 dark:border-white/10">
                                {/* Column 1: Delivery Info (Bento Card) */}
                                <div className="bg-brand-light/50 border-brand-dark/5 flex h-full flex-col space-y-6 rounded-3xl border p-8 shadow-sm dark:border-white/5 dark:bg-white/5">
                                    <div className="flex-1 space-y-6">
                                        <h3 className="text-brand-dark flex items-center gap-3 text-xl font-bold dark:text-white">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-900/30 dark:text-blue-400">
                                                <ShoppingBag size={18} />
                                            </div>
                                            Prazo de entrega
                                        </h3>

                                        <div className="border-brand-dark/5 rounded-2xl border bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-brand-dark text-base font-bold dark:text-white">
                                                    Entrega Automática
                                                </span>
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-black text-green-600 uppercase dark:bg-green-900/30 dark:text-green-400">
                                                    Grátis
                                                </span>
                                            </div>
                                            <p className="text-brand-dark/60 text-sm leading-relaxed dark:text-white/60">
                                                Seus itens serão ativados automaticamente logo após
                                                a confirmação.
                                            </p>
                                        </div>

                                        {/* Activation Process Timeline */}
                                        <div className="space-y-5 pt-4">
                                            <h4 className="text-brand-dark/80 flex items-center gap-2 text-base font-bold tracking-wide uppercase dark:text-white/80">
                                                <Zap size={16} className="text-brand-orange" />
                                                Processo de Ativação
                                            </h4>
                                            <div className="space-y-5 pl-2">
                                                <div className="relative flex gap-4">
                                                    <div className="bg-brand-dark/10 absolute top-2 left-[11px] h-full w-px dark:bg-white/10" />
                                                    <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-50 bg-green-100 text-xs font-bold text-green-700 shadow-sm dark:border-green-800/20 dark:bg-green-900/30 dark:text-green-400">
                                                        1
                                                    </div>
                                                    <div>
                                                        <p className="text-brand-dark text-base font-bold dark:text-white">
                                                            Pagamento Aprovado
                                                        </p>
                                                        <p className="text-brand-dark/60 mt-0.5 text-sm leading-tight dark:text-white/60">
                                                            Gateway confirma a transação
                                                            instantaneamente.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative flex gap-4">
                                                    <div className="bg-brand-dark/10 absolute top-2 left-[11px] h-full w-px dark:bg-white/10" />
                                                    <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-50 bg-blue-100 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-800/20 dark:bg-blue-900/30 dark:text-blue-400">
                                                        2
                                                    </div>
                                                    <div>
                                                        <p className="text-brand-dark text-base font-bold dark:text-white">
                                                            Sincronização
                                                        </p>
                                                        <p className="text-brand-dark/60 mt-0.5 text-sm leading-tight dark:text-white/60">
                                                            O sistema identifica seu nick no
                                                            servidor.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative flex gap-4">
                                                    <div className="bg-brand-orange/10 border-brand-orange/20 text-brand-orange z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm">
                                                        3
                                                    </div>
                                                    <div>
                                                        <p className="text-brand-dark text-base font-bold dark:text-white">
                                                            Entrega no Jogo
                                                        </p>
                                                        <p className="text-brand-dark/60 mt-0.5 text-sm leading-tight dark:text-white/60">
                                                            Itens entregues em aproximadamente 1
                                                            min.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/rules"
                                        className="text-brand-dark/50 hover:text-brand-dark block pt-6 pl-2 text-sm underline transition-colors dark:text-white/50 dark:hover:text-white"
                                    >
                                        Política de Entrega e Reembolso
                                    </Link>
                                </div>

                                {/* Column 2: Coupon (Bento Card) */}
                                <div className="bg-brand-light/50 border-brand-dark/5 flex h-full flex-col space-y-6 rounded-3xl border p-8 shadow-sm dark:border-white/5 dark:bg-white/5">
                                    <div className="flex-1 space-y-6">
                                        <h3 className="text-brand-dark flex items-center gap-3 text-xl font-bold dark:text-white">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-sm dark:bg-purple-900/30 dark:text-purple-400">
                                                <CreditCard size={18} />
                                            </div>
                                            Cupom de desconto
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="border-brand-dark/5 focus-within:border-brand-orange flex gap-2 rounded-2xl border bg-white p-2 shadow-sm transition-colors dark:border-white/10 dark:bg-zinc-950">
                                                <input
                                                    type="text"
                                                    placeholder="Cupom ou Gift Card"
                                                    className="text-brand-dark placeholder:text-brand-dark/30 w-full border-0 bg-transparent px-4 py-3 text-base font-medium ring-0 outline-none focus:ring-0 dark:text-white dark:placeholder:text-white/30"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    className="bg-brand-dark dark:text-brand-dark hover:bg-brand-dark/90 h-auto rounded-xl px-6 py-2 text-sm font-bold tracking-wide text-white uppercase hover:text-white dark:bg-white dark:hover:bg-gray-100"
                                                >
                                                    Aplicar
                                                </Button>
                                            </div>

                                            <div className="flex gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-800/20 dark:bg-indigo-900/10">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 shadow-sm dark:bg-indigo-900/30">
                                                    <Gift
                                                        size={20}
                                                        className="text-indigo-600 dark:text-indigo-400"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-base font-bold text-indigo-900 dark:text-indigo-300">
                                                        Quer descontos?
                                                    </p>
                                                    <p className="text-sm leading-snug text-indigo-800/80 dark:text-indigo-300/60">
                                                        Fique de olho em nosso{" "}
                                                        <Link
                                                            href={siteConfig.links.discord}
                                                            target="_blank"
                                                            className="font-bold underline hover:text-indigo-900 dark:hover:text-indigo-200"
                                                        >
                                                            Discord
                                                        </Link>{" "}
                                                        para cupons relâmpago!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Summary (Premium Bento Card) */}
                                <div className="border-brand-dark/5 relative space-y-6 overflow-hidden rounded-[2.5rem] border bg-white p-8 shadow-xl transition-colors dark:border-white/10 dark:bg-zinc-900">
                                    <div className="bg-brand-orange/5 absolute top-0 right-0 -mt-12 -mr-12 h-24 w-24 rounded-full blur-3xl" />

                                    <h3 className="text-brand-dark relative z-10 flex items-center gap-3 px-1 text-xl font-bold dark:text-white">
                                        <div className="bg-brand-orange/10 text-brand-orange flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm">
                                            <ShoppingBag size={18} />
                                        </div>
                                        Resumo do Pedido
                                    </h3>

                                    <div className="border-brand-dark/10 relative z-10 space-y-4 border-b px-1 pb-6 dark:border-white/10">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-brand-dark/60 font-medium dark:text-white/60">
                                                Valor dos produtos
                                            </span>
                                            <span className="text-brand-dark font-bold dark:text-white">
                                                {formatPrice(totalPrice)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-medium text-green-600 dark:text-green-400">
                                            <span>Descontos</span>
                                            <span>- {formatPrice(savings)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-brand-dark/60 font-medium dark:text-white/60">
                                                Frete
                                            </span>
                                            <span className="text-brand-orange bg-brand-orange/10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase">
                                                Grátis
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-5 px-1 pt-2">
                                        <div className="flex items-end justify-between">
                                            <span className="text-brand-dark/40 mb-1 text-xs font-black tracking-widest uppercase dark:text-white/40">
                                                Total do pedido
                                            </span>
                                            <div className="text-right">
                                                <span className="text-brand-orange block text-4xl leading-none font-black tracking-tighter">
                                                    {formatPrice(totalPrice)}
                                                </span>
                                                <span className="mt-1 block text-[10px] font-bold tracking-wider text-green-600 uppercase">
                                                    ou {formatPrice(pixPrice)} via Pix
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <label className="group flex cursor-pointer items-start gap-3">
                                                <div className="relative mt-0.5 shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={acceptedTerms}
                                                        onChange={(e) =>
                                                            setAcceptedTerms(e.target.checked)
                                                        }
                                                        className="peer sr-only"
                                                    />
                                                    <div className="peer-checked:bg-brand-orange peer-checked:border-brand-orange h-5 w-5 rounded-lg border-2 border-zinc-200 shadow-sm transition-all dark:border-zinc-700" />
                                                    <Check
                                                        size={14}
                                                        className="absolute top-0.5 left-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                                    />
                                                </div>
                                                <span className="group-hover:text-brand-dark text-xs leading-relaxed font-medium text-zinc-500 transition-colors dark:text-zinc-400 dark:group-hover:text-white">
                                                    Eu declaro que li e concordo com os{" "}
                                                    <Link
                                                        href={siteConfig.links.rules}
                                                        className="text-brand-orange font-bold hover:underline"
                                                    >
                                                        Termos de Uso
                                                    </Link>{" "}
                                                    e entendo que não há reembolso.
                                                </span>
                                            </label>

                                            <Button
                                                disabled={!acceptedTerms || isProcessing}
                                                onClick={handleCheckout}
                                                className="bg-brand-orange text-brand-dark h-auto w-full rounded-2xl py-7 text-lg font-black tracking-wider uppercase shadow-[0_12px_30px_-10px_rgba(255,166,0,0.4)] transition-all hover:bg-orange-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
                                            >
                                                {isProcessing ? (
                                                    <div className="border-brand-dark h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                                                ) : (
                                                    "Finalizar Compra"
                                                )}
                                            </Button>

                                            {/* Trust Badges */}
                                            <div className="space-y-4 pt-4">
                                                <div className="flex items-center justify-center gap-4 border-t border-zinc-100 pt-6 dark:border-white/5">
                                                    <Image
                                                        src="/images/site/metodos-pagamento.png"
                                                        alt="Métodos de Pagamento"
                                                        width={280}
                                                        height={45}
                                                        className="transition-all hover:scale-105 dark:opacity-80"
                                                        quality={100}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50 py-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:border-white/5 dark:bg-white/5 dark:text-zinc-500">
                                                    <ShieldCheck
                                                        size={16}
                                                        className="text-green-500"
                                                    />
                                                    Ambiente 100% Seguro
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="border-brand-dark/10 grid grid-cols-1 gap-8 border-t pt-8 md:grid-cols-3 dark:border-white/10">
                                <div className="md:col-span-2">
                                    <h3 className="text-brand-dark mb-8 flex items-center gap-2 text-2xl font-bold dark:text-white">
                                        <HelpCircle className="text-brand-orange" size={28} />
                                        Dúvidas Frequentes
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        {faqs.map((faq, i) => (
                                            <div
                                                key={i}
                                                className="border-brand-dark/5 space-y-3 rounded-2xl border bg-white/50 p-6 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-brand-light rounded-lg p-2 dark:bg-white/5">
                                                        {faq.icon}
                                                    </div>
                                                    <h4 className="text-brand-dark text-base leading-tight font-bold dark:text-white">
                                                        {faq.q}
                                                    </h4>
                                                </div>
                                                <p className="text-brand-dark/60 pl-12 text-sm leading-relaxed dark:text-white/60">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center rounded-[2rem] border border-orange-100 bg-orange-50 p-8 text-center dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <h4 className="text-brand-dark mb-3 text-xl font-black dark:text-white">
                                        Precisa de ajuda?
                                    </h4>
                                    <p className="text-brand-dark/70 mb-8 px-4 text-sm leading-relaxed dark:text-white/70">
                                        Nossa equipe está disponível 24/7 no Discord para te
                                        auxiliar.
                                    </p>
                                    <Link href={siteConfig.links.discord} target="_blank">
                                        <Button
                                            variant="outline"
                                            className="border-brand-orange text-brand-orange hover:bg-brand-orange w-full rounded-2xl py-8 text-base font-black shadow-sm transition-all hover:text-white active:scale-[0.98]"
                                        >
                                            Abrir Ticket no Discord
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

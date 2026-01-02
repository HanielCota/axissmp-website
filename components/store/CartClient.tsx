"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, X, ShieldCheck, HelpCircle, Check, Zap, Gift } from "lucide-react";
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
        icon: <Zap className="text-brand-orange" size={20} />
    },
    {
        q: "Como recebo meus itens?",
        a: "Eles serão ativados diretamente no servidor para o seu nickname digitado. Certifique-se de estar online.",
        icon: <Check className="text-green-500" size={20} />
    },
    {
        q: "Posso pedir reembolso?",
        a: "Por se tratar de produtos digitais ativados instantaneamente, não oferecemos reembolsos após a entrega.",
        icon: <X className="text-red-500" size={20} />
    }
];

export function CartClient() {
    const { items, totalItems, totalPrice, updateQuantity, removeFromCart, nickname, clearCart } = useCart();
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

        const { data: { user } } = await supabase.auth.getUser();

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
            status: "pending"
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
        <div className="min-h-screen bg-brand-light text-brand-dark font-sans flex flex-col relative w-full overflow-x-hidden">
            {/* Dark Header Background for Contrast (Matches Store Page) */}
            <div className="fixed top-0 left-0 right-0 h-[400px] bg-brand-dark/5 -z-10" />

            <Navbar />

            <main className="container mx-auto px-4 lg:px-8 pt-40 pb-24 max-w-7xl flex-1 flex flex-col w-full z-0">

                {/* 1. Progress Stepper */}
                <div className="flex justify-center mb-12 w-full">
                    <div className="flex items-center gap-2 sm:gap-4 md:gap-8 text-sm md:text-base">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center gap-2 sm:gap-4 md:gap-8">
                                <div className={`flex items-center gap-2 ${step.number === 1 ? "text-brand-orange font-bold" : "text-brand-dark/30"}`}>
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs md:text-sm border ${step.number === 1 ? "border-brand-orange bg-brand-orange text-brand-dark" : "border-brand-dark/20"}`}>
                                        {step.number}
                                    </span>
                                    <span>{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-8 md:w-16 h-[1px] bg-brand-dark/10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Alert Banner - Removed Artificial Scarcity */}

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-sm border border-brand-dark/5 w-full">
                        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-brand-dark/20" />
                        </div>
                        <h2 className="text-2xl font-black mb-2 text-brand-dark">Seu carrinho está vazio</h2>
                        <p className="text-brand-dark/50 mb-8 max-w-sm">Você ainda não escolheu seus produtos. Navegue na loja para encontrar o que precisa.</p>
                        <Link href="/store">
                            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-dark font-black px-8 py-6 rounded-xl">
                                Voltar para a Loja
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8 w-full">
                        {/* Player Identity Section */}
                        {nickname && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl"
                            >
                                <div className="relative w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden p-2">
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
                                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Comprando para a conta:</p>
                                    <h2 className="text-3xl font-black text-white mb-2">{nickname}</h2>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-zinc-400 text-sm font-medium">Nickname configurado e pronto para receber</span>
                                    </div>
                                </div>
                                <div className="md:ml-auto">
                                    <Link href="/store">
                                        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider">
                                            Alterar Nickname
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        <div className="bg-white rounded-3xl shadow-sm border border-brand-dark/5 p-6 md:p-8 w-full">
                            {/* 3. Items Table */}
                            <div className="mb-12">
                                {/* Desktop Headers */}
                                <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] gap-4 pb-4 border-b border-brand-dark/5 text-sm font-black uppercase tracking-wider text-brand-dark/40">
                                    <div>Produtos</div>
                                    <div className="text-center">Quantidade</div>
                                    <div className="text-right">Valor Total</div>
                                </div>

                                {/* List */}
                                <div className="space-y-4 md:space-y-0 text-brand-dark">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr] gap-4 md:items-center py-6 border-b border-brand-dark/5 last:border-0 relative group">

                                            {/* Product Info */}
                                            <div className="flex items-start gap-4 md:items-center">
                                                <div className="w-20 h-20 bg-brand-light rounded-lg border border-brand-dark/5 p-2 shrink-0 relative">
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
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingBag size={24} className="text-brand-dark/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                                                    <div className="text-sm text-brand-dark/40 space-y-0.5">
                                                        <p>Entrega Automática</p>
                                                        <p className="capitalize">Categoria: {item.category}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="flex items-center justify-between md:justify-center mt-4 md:mt-0">
                                                <span className="md:hidden text-sm text-brand-dark/50 font-medium">Quantidade:</span>
                                                {item.category === 'coins' ? (
                                                    <div className="flex items-center border border-brand-dark/10 rounded-lg bg-brand-light/50">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={14} className="text-brand-dark/60" />
                                                        </button>
                                                        <span className="w-12 text-center font-bold tabular-nums text-brand-dark">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                                                        >
                                                            <Plus size={14} className="text-brand-dark/60" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-2 bg-brand-dark/5 rounded-lg text-brand-dark/40 text-sm font-bold">
                                                        <Check size={14} /> Unitário
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center mt-2 md:mt-0">
                                                <span className="md:hidden text-sm text-brand-dark/50 font-medium">Total:</span>
                                                <div className="text-right">
                                                    <p className="font-black text-lg md:text-xl text-brand-dark tracking-tight">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all font-bold text-xs uppercase tracking-wider group"
                                                    title="Remover item"
                                                >
                                                    <Trash2 size={16} className="transition-transform group-hover:scale-110" />
                                                    <span>Remover</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Footer Section (3 Columns) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pt-8 border-t border-brand-dark/10">

                                {/* Column 1: Delivery Info (Bento Card) */}
                                <div className="space-y-6 bg-brand-light/50 p-8 rounded-3xl border border-brand-dark/5 shadow-sm h-full flex flex-col">
                                    <div className="space-y-6 flex-1">
                                        <h3 className="font-bold text-xl text-brand-dark flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                                <ShoppingBag size={18} />
                                            </div>
                                            Prazo de entrega
                                        </h3>

                                        <div className="p-5 rounded-2xl border border-brand-dark/5 bg-white shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-base font-bold text-brand-dark">Entrega Automática</span>
                                                <span className="text-green-600 text-[11px] font-black uppercase bg-green-100 px-3 py-1 rounded-full">Grátis</span>
                                            </div>
                                            <p className="text-sm text-brand-dark/60 leading-relaxed">
                                                Seus itens serão ativados automaticamente logo após a confirmação.
                                            </p>
                                        </div>

                                        {/* Activation Process Timeline */}
                                        <div className="pt-4 space-y-5">
                                            <h4 className="text-base font-bold text-brand-dark/80 flex items-center gap-2 uppercase tracking-wide">
                                                <Zap size={16} className="text-brand-orange" />
                                                Processo de Ativação
                                            </h4>
                                            <div className="space-y-5 pl-2">
                                                <div className="flex gap-4 relative">
                                                    <div className="w-px h-full bg-brand-dark/10 absolute left-[11px] top-2" />
                                                    <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-50 flex items-center justify-center text-xs font-bold text-green-700 z-10 shrink-0 shadow-sm">1</div>
                                                    <div>
                                                        <p className="text-base font-bold text-brand-dark">Pagamento Aprovado</p>
                                                        <p className="text-sm text-brand-dark/60 leading-tight mt-0.5">Gateway confirma a transação instantaneamente.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 relative">
                                                    <div className="w-px h-full bg-brand-dark/10 absolute left-[11px] top-2" />
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-50 flex items-center justify-center text-xs font-bold text-blue-700 z-10 shrink-0 shadow-sm">2</div>
                                                    <div>
                                                        <p className="text-base font-bold text-brand-dark">Sincronização</p>
                                                        <p className="text-sm text-brand-dark/60 leading-tight mt-0.5">O sistema identifica seu nick no servidor.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 relative">
                                                    <div className="w-6 h-6 rounded-full bg-brand-orange/10 border-2 border-brand-orange/20 flex items-center justify-center text-xs font-bold text-brand-orange z-10 shrink-0 shadow-sm">3</div>
                                                    <div>
                                                        <p className="text-base font-bold text-brand-dark">Entrega no Jogo</p>
                                                        <p className="text-sm text-brand-dark/60 leading-tight mt-0.5">Itens entregues em aproximadamente 1 min.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/rules" className="text-sm text-brand-dark/50 underline hover:text-brand-dark transition-colors pl-2 pt-6 block">
                                        Política de Entrega e Reembolso
                                    </Link>
                                </div>

                                {/* Column 2: Coupon (Bento Card) */}
                                <div className="space-y-6 bg-brand-light/50 p-8 rounded-3xl border border-brand-dark/5 shadow-sm h-full flex flex-col">
                                    <div className="space-y-6 flex-1">
                                        <h3 className="font-bold text-xl text-brand-dark flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                                                <CreditCard size={18} />
                                            </div>
                                            Cupom de desconto
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-white border border-brand-dark/5 rounded-2xl p-2 flex gap-2 shadow-sm focus-within:border-brand-orange transition-colors">
                                                <input
                                                    type="text"
                                                    placeholder="Cupom ou Gift Card"
                                                    className="bg-transparent border-0 ring-0 focus:ring-0 text-brand-dark placeholder:text-brand-dark/30 text-base w-full px-4 py-3 outline-none font-medium"
                                                />
                                                <Button variant="ghost" className="bg-brand-dark text-white hover:bg-brand-dark/90 hover:text-white rounded-xl px-6 font-bold h-auto py-2 text-sm uppercase tracking-wide">
                                                    Aplicar
                                                </Button>
                                            </div>

                                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                                                    <Gift size={20} className="text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-indigo-900 mb-1">Quer descontos?</p>
                                                    <p className="text-sm text-indigo-800/80 leading-snug">
                                                        Fique de olho em nosso <Link href={siteConfig.links.discord} target="_blank" className="underline hover:text-indigo-900 font-bold">Discord</Link> para cupons relâmpago!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Summary (Premium Bento Card) */}
                                <div className="space-y-6 bg-white border border-brand-dark/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-3xl -mr-12 -mt-12" />

                                    <h3 className="font-bold text-xl text-brand-dark px-1 flex items-center gap-3 relative z-10">
                                        <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shadow-sm shrink-0">
                                            <ShoppingBag size={18} />
                                        </div>
                                        Resumo do Pedido
                                    </h3>

                                    <div className="space-y-4 pb-6 border-b border-brand-dark/10 px-1 relative z-10">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-brand-dark/60 font-medium">Valor dos produtos</span>
                                            <span className="font-bold text-brand-dark">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                                            <span>Descontos</span>
                                            <span>- {formatPrice(savings)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-brand-dark/60 font-medium">Frete</span>
                                            <span className="text-brand-orange font-black uppercase text-[10px] bg-brand-orange/10 px-2.5 py-1 rounded-full">Grátis</span>
                                        </div>
                                    </div>

                                    <div className="space-y-5 px-1 pt-2 relative z-10">
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-brand-dark/40 uppercase tracking-widest text-xs mb-1">Total do pedido</span>
                                            <div className="text-right">
                                                <span className="block text-4xl font-black text-brand-orange leading-none tracking-tighter">{formatPrice(totalPrice)}</span>
                                                <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1 block">ou {formatPrice(pixPrice)} via Pix</span>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative mt-0.5 shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={acceptedTerms}
                                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="w-5 h-5 border-2 border-zinc-200 rounded-lg peer-checked:bg-brand-orange peer-checked:border-brand-orange transition-all shadow-sm" />
                                                    <Check size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                </div>
                                                <span className="text-xs text-zinc-500 leading-relaxed font-medium group-hover:text-brand-dark transition-colors">
                                                    Eu declaro que li e concordo com os <Link href={siteConfig.links.rules} className="text-brand-orange font-bold hover:underline">Termos de Uso</Link> e entendo que não há reembolso.
                                                </span>
                                            </label>

                                            <Button
                                                disabled={!acceptedTerms || isProcessing}
                                                onClick={handleCheckout}
                                                className="w-full bg-brand-orange hover:bg-orange-500 text-brand-dark font-black text-lg py-7 rounded-2xl shadow-[0_12px_30px_-10px_rgba(255,166,0,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-wider h-auto"
                                            >
                                                {isProcessing ? (
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
                                                ) : (
                                                    "Finalizar Compra"
                                                )}
                                            </Button>

                                            {/* Trust Badges */}
                                            <div className="pt-4 space-y-4">
                                                <div className="flex items-center justify-center gap-4 border-t border-zinc-100 pt-6">
                                                    <Image src="/images/site/metodos-pagamento.png" alt="Métodos de Pagamento" width={280} height={45} className="hover:scale-105 transition-all" quality={100} />
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-50 py-2 rounded-lg border border-zinc-100">
                                                    <ShieldCheck size={16} className="text-green-500" />
                                                    Ambiente 100% Seguro
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* FAQ Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-dark/10">
                                <div className="md:col-span-2">
                                    <h3 className="font-bold text-2xl text-brand-dark mb-8 flex items-center gap-2">
                                        <HelpCircle className="text-brand-orange" size={28} />
                                        Dúvidas Frequentes
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white/50 border border-brand-dark/5 p-6 rounded-2xl space-y-3 hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-brand-light rounded-lg">
                                                        {faq.icon}
                                                    </div>
                                                    <h4 className="font-bold text-base text-brand-dark leading-tight">{faq.q}</h4>
                                                </div>
                                                <p className="text-sm text-brand-dark/60 leading-relaxed pl-12">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 flex flex-col justify-center text-center">
                                    <h4 className="font-black text-brand-dark mb-3 text-xl">Precisa de ajuda?</h4>
                                    <p className="text-brand-dark/70 text-sm mb-8 px-4 leading-relaxed">
                                        Nossa equipe está disponível 24/7 no Discord para te auxiliar.
                                    </p>
                                    <Link href={siteConfig.links.discord} target="_blank">
                                        <Button variant="outline" className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-black rounded-2xl py-8 text-base shadow-sm transition-all active:scale-[0.98]">
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

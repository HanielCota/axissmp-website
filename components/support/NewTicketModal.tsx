"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, AlertCircle, LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewTicketModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const categories = [
    { id: "vendas", label: "Vendas / VIP", icon: "💰" },
    { id: "bug", label: "Reportar Bug", icon: "🐛" },
    { id: "suporte", label: "Suporte Geral", icon: "🛠️" },
    { id: "outro", label: "Outros", icon: "❓" },
];

export function NewTicketModal({ onClose, onSuccess }: NewTicketModalProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !content) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setIsSubmitting(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Você precisa estar logado.");
            setIsSubmitting(false);
            return;
        }

        // 1. Create Ticket
        const { data: ticket, error: ticketError } = await supabase
            .from("tickets")
            .insert({
                user_id: user.id,
                title,
                category,
                status: "open",
            })
            .select()
            .single();

        if (ticketError) {
            toast.error("Erro ao abrir ticket.");
            setIsSubmitting(false);
            return;
        }

        // 2. Add First Message
        const { error: msgError } = await supabase.from("ticket_messages").insert({
            ticket_id: ticket.id,
            user_id: user.id,
            content,
            is_staff: false,
        });

        if (msgError) {
            toast.error("Ticket aberto, mas não conseguimos enviar a mensagem inicial.");
            setIsSubmitting(false);
            return;
        }

        toast.success("Ticket aberto com sucesso!");
        onSuccess();
        onClose();
        // Reset fields
        setTitle("");
        setCategory("");
        setContent("");
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950"
            >
                {/* Modal Header */}
                <div className="relative border-b border-slate-100 bg-slate-50 p-8 dark:border-white/5 dark:bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <div className="mb-2 flex items-center gap-4">
                        <div className="bg-brand-orange text-brand-dark rounded-2xl p-3">
                            <LifeBuoy size={24} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                            Novo Ticket
                        </h2>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-white/40">
                        Explique seu problema da melhor forma possível.
                    </p>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/40">
                            Categoria do Atendimento
                        </label>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all",
                                        category === cat.id
                                            ? "bg-brand-orange border-brand-orange text-brand-dark"
                                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:border-white/20 dark:hover:bg-white/10"
                                    )}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="text-[10px] font-black tracking-tight uppercase">
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/40">
                            Assunto Curto
                        </label>
                        <Input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Problema com Ativação de VIP"
                            className="focus-visible:border-brand-orange/50 h-auto w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-900 transition-all placeholder:text-slate-400 focus-visible:ring-0 md:text-base dark:border-white/10 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-white/10"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/40">
                            Descrição Detalhada
                        </label>
                        <Textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            placeholder="Descreva aqui o que aconteceu. Se for um bug, como podemos reproduzi-lo? Se for uma compra, nos informe o ID do pedido."
                            className="focus-visible:border-brand-orange/50 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-medium text-slate-900 transition-all placeholder:text-slate-400 focus-visible:ring-0 dark:border-white/10 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-white/10"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-brand-orange text-brand-dark flex w-full items-center justify-center gap-3 rounded-2xl py-5 font-black shadow-[0_10px_30px_-10px_rgba(255,166,0,0.3)] transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="border-brand-dark h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                            ) : (
                                <>
                                    <span>Abrir Ticket Agora</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-white/20">
                            <AlertCircle size={14} />
                            Atendimento humano em até 12 horas
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

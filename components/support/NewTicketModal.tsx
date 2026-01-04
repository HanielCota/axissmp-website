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
    { id: 'vendas', label: 'Vendas / VIP', icon: '💰' },
    { id: 'bug', label: 'Reportar Bug', icon: '🐛' },
    { id: 'suporte', label: 'Suporte Geral', icon: '🛠️' },
    { id: 'outro', label: 'Outros', icon: '❓' },
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
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !content) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setIsSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();

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
                status: 'open'
            })
            .select()
            .single();

        if (ticketError) {
            toast.error("Erro ao abrir ticket.");
            setIsSubmitting(false);
            return;
        }

        // 2. Add First Message
        const { error: msgError } = await supabase
            .from("ticket_messages")
            .insert({
                ticket_id: ticket.id,
                user_id: user.id,
                content,
                is_staff: false
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
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 dark:border-white/5 relative bg-slate-50 dark:bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-colors p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-brand-orange text-brand-dark">
                            <LifeBuoy size={24} />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Novo Ticket</h2>
                    </div>
                    <p className="text-slate-500 dark:text-white/40 text-sm font-medium">Explique seu problema da melhor forma possível.</p>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-1">Categoria do Atendimento</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all",
                                        category === cat.id
                                            ? "bg-brand-orange border-brand-orange text-brand-dark"
                                            : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200 dark:hover:border-white/20"
                                    )}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-1">Assunto Curto</label>
                        <Input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Problema com Ativação de VIP"
                            className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-4 md:text-base text-slate-900 dark:text-white focus-visible:ring-0 focus-visible:border-brand-orange/50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/10 font-bold h-auto"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-1">Descrição Detalhada</label>
                        <Textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            placeholder="Descreva aqui o que aconteceu. Se for um bug, como podemos reproduzi-lo? Se for uma compra, nos informe o ID do pedido."
                            className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus-visible:ring-0 focus-visible:border-brand-orange/50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/10 font-medium resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-orange hover:bg-orange-500 text-brand-dark font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(255,166,0,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
                            ) : (
                                <>
                                    <span>Abrir Ticket Agora</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">
                            <AlertCircle size={14} />
                            Atendimento humano em até 12 horas
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

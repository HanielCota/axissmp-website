"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

function ModalInner({ open, onOpenChange, title, description, children, footer }: ModalProps) {
    useLockBodyScroll();

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative w-full max-w-md my-auto bg-card border border-primary/20 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black font-outfit uppercase tracking-tight text-foreground">{title}</h2>
                        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                {footer && (
                    <div className="p-6 pt-0 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export function Modal(props: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !props.open) return null;

    return <ModalInner {...props} />;
}

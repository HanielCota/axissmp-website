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
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4">
            <div
                className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-sm duration-300"
                onClick={() => onOpenChange(false)}
            />
            <div className="bg-card border-primary/20 animate-in zoom-in-95 relative my-auto w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl shadow-black/50 duration-300">
                <div className="border-primary/10 flex items-center justify-between border-b p-6">
                    <div>
                        <h2 className="font-outfit text-foreground text-xl font-black tracking-tight uppercase">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl p-2 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="flex justify-end gap-3 p-6 pt-0">{footer}</div>}
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

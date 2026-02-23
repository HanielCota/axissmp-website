"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/actions/users";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserRoleButtonProps {
    userId: string;
    currentRole: "user" | "admin" | "mod";
}

const roleOptions: { value: "user" | "admin" | "mod"; label: string }[] = [
    { value: "user", label: "Usuário" },
    { value: "mod", label: "Moderador" },
    { value: "admin", label: "Admin" },
];

export function UserRoleButton({ userId, currentRole }: UserRoleButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleRoleChange = (role: "user" | "admin" | "mod") => {
        if (role === currentRole) {
            setIsOpen(false);
            return;
        }

        setIsOpen(false);

        startTransition(async () => {
            const result = await updateUserRole(userId, role);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Cargo atualizado!");
            router.refresh();
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
                {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <ChevronDown size={16} />
                )}
                <span className="text-xs font-bold">Alterar</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
                        {roleOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleRoleChange(option.value)}
                                className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/5 ${
                                    currentRole === option.value
                                        ? "text-brand-orange"
                                        : "text-white/80"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

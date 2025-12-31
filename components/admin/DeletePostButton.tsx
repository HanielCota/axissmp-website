"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/posts";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePostButtonProps {
    slug: string;
}

export function DeletePostButton({ slug }: DeletePostButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

        startTransition(async () => {
            const result = await deletePost(slug);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Notícia excluída!");
            router.refresh();
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Excluir"
        >
            <Trash2 size={18} />
        </button>
    );
}

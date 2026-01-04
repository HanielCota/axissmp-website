"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CreateThreadButtonProps {
    categorySlug: string;
}

export function CreateThreadButton({ categorySlug }: CreateThreadButtonProps) {
    return (
        <Link href={`/forum/${categorySlug}/create`}>
            <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Tópico
            </Button>
        </Link>
    );
}

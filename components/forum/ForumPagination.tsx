"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ForumPaginationProps {
    totalItems: number;
    itemsPerPage?: number;
}

export function ForumPagination({ totalItems, itemsPerPage = 20 }: ForumPaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => router.push(createPageURL(currentPage - 1))}
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium mx-2">
                Página {currentPage} de {totalPages}
            </span>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => router.push(createPageURL(currentPage + 1))}
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}

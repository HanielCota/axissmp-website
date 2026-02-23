"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ForumSearch({ placeholder = "Pesquisar tópicos..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (!term) {
            params.delete("q");
            replace(`?${params.toString()}`);
            return;
        }

        params.set("q", term);
        replace(`?${params.toString()}`);
    }, 300);

    return (
        <div className="group relative">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
                placeholder={placeholder}
                aria-label="Pesquisar tópicos"
                className="bg-muted/30 border-input focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground h-11 w-full rounded-xl pl-10 shadow-sm backdrop-blur-sm transition-all focus:ring-1"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
        </div>
    );
}

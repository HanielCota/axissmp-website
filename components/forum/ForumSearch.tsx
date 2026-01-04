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
        <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
                placeholder={placeholder}
                aria-label="Pesquisar tópicos"
                className="pl-10 h-11 w-full bg-muted/30 backdrop-blur-sm border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl text-foreground placeholder:text-muted-foreground shadow-sm"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
        </div>
    );
}

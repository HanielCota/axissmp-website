"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center py-20">
            <div className="max-w-md space-y-6 text-center">
                <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <AlertTriangle className="text-destructive h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="font-outfit text-foreground text-xl font-black">
                        Erro no Dashboard
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Não foi possível carregar seus dados. Tente novamente.
                    </p>
                </div>

                <div className="flex justify-center gap-3">
                    <Button onClick={() => reset()} size="sm" className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Tentar novamente
                    </Button>

                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Início
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

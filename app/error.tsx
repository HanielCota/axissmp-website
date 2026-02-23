"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error:", error);
    }, [error]);

    return (
        <div className="bg-background flex min-h-screen items-center justify-center p-6">
            <div className="max-w-md space-y-6 text-center">
                <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                    <AlertTriangle className="text-destructive h-10 w-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="font-outfit text-foreground text-2xl font-black">
                        Algo deu errado
                    </h1>
                    <p className="text-muted-foreground">
                        Ocorreu um erro inesperado. Nossa equipe foi notificada.
                    </p>
                </div>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={() => reset()} variant="default" className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Tentar novamente
                    </Button>

                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Voltar ao início
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-muted-foreground/50 font-mono text-xs">
                        Código: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}

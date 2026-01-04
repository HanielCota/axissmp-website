'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="text-center max-w-md space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black font-outfit text-foreground">
                        Algo deu errado
                    </h1>
                    <p className="text-muted-foreground">
                        Ocorreu um erro inesperado. Nossa equipe foi notificada.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => reset()}
                        variant="default"
                        className="gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Tentar novamente
                    </Button>

                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Voltar ao início
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-xs text-muted-foreground/50 font-mono">
                        Código: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}

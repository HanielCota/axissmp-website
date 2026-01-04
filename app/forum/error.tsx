'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForumError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Forum Error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-black font-outfit text-foreground">
                        Erro no Fórum
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Não foi possível carregar o conteúdo. Tente novamente.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button onClick={() => reset()} size="sm" className="gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Tentar novamente
                    </Button>

                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/forum">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

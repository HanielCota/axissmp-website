import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href: string;
    label?: string;
    className?: string;
}

export function BackButton({ href, label = "Voltar", className }: BackButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
                "text-muted-foreground hover:text-primary gap-2 pl-0 transition-colors hover:bg-transparent",
                className
            )}
        >
            <Link href={href}>
                <ArrowLeft size={16} />
                {label}
            </Link>
        </Button>
    );
}

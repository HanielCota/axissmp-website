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
            className={cn("gap-2 text-muted-foreground hover:text-primary pl-0 hover:bg-transparent transition-colors", className)}
        >
            <Link href={href}>
                <ArrowLeft size={16} />
                {label}
            </Link>
        </Button>
    );
}

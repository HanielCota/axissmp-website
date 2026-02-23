import Link from "next/link";
import { navLinks } from "@/constants/constants";

export function DesktopNav() {
    return (
        <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="group text-brand-dark relative flex items-center gap-2 px-6 py-4 font-black tracking-wide uppercase transition-colors hover:bg-white/10"
                >
                    <link.icon className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
                    <span>{link.name}</span>
                    {link.name === "Loja" && (
                        <span className="absolute top-3 right-3 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}

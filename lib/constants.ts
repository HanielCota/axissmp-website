import {
    Home,
    ShoppingCart,
    MessageSquare,
    Trophy,
    BookOpen,
    ScrollText,
    Bell,
    Gamepad2,
    Instagram,
    Music,
} from "lucide-react";
import { NavLink, SocialLink } from "@/types/navigation";

export const SERVER_IP = "sp-10.magnohost.com.br:25517";

export const navLinks: NavLink[] = [
    { name: "Início", href: "/", icon: Home },
    { name: "Wiki", href: "/wiki", icon: BookOpen },
    { name: "Notícias", href: "/news", icon: Bell },
    { name: "Regras", href: "/rules", icon: ScrollText },
    { name: "Votar", href: "https://axissmp.com.br/votar", icon: Trophy, external: true },
    { name: "Fórum", href: "#", icon: MessageSquare },
    { name: "Loja", href: "/store", icon: ShoppingCart },
];

export const socialLinks: SocialLink[] = [
    { name: "Discord", href: "https://discord.gg/axissmp", icon: Gamepad2 },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "TikTok", href: "#", icon: Music },
];

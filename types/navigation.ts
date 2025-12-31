import { LucideIcon } from "lucide-react";

export interface NavLink {
    name: string;
    href: string;
    icon: LucideIcon;
    external?: boolean;
}

export interface SocialLink {
    name: string;
    href: string;
    icon: LucideIcon;
}

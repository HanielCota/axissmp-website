"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface PlayerModelProps {
    nickname: string;
    size?: number;
    className?: string;
    mode?: "head" | "body" | "bust";
}

export function PlayerModel({ nickname, size = 64, className, mode = "head" }: PlayerModelProps) {
    // mc-heads.net is a reliable API for Minecraft heads and skins
    const baseUrl = "https://mc-heads.net";
    let url = "";

    switch (mode) {
        case "body":
            url = `${baseUrl}/body/${nickname}/right`;
            break;
        case "bust":
            url = `${baseUrl}/player/${nickname}/${size}`;
            break;
        default:
            url = `${baseUrl}/head/${nickname}/${size}`;
    }

    return (
        <div
            className={cn("relative flex items-center justify-center overflow-hidden", className)}
            style={{ width: size, height: mode === "body" ? size * 2 : size }}
        >
            <Image
                src={url}
                alt={`${nickname}'s Minecraft ${mode}`}
                width={size}
                height={mode === "body" ? size * 2 : size}
                className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                unoptimized // External API images
            />
        </div>
    );
}

"use client";

import { useServerStatus } from "@/hooks/useServerStatus";
import { SERVER_IP } from "@/constants/constants";

export function PlayersOnline() {
    const { status, loading } = useServerStatus(SERVER_IP);

    const formatNumber = (num: number) => {
        return num.toLocaleString("pt-BR");
    };

    return (
        <div className="hidden flex-col items-start md:flex">
            <span className="text-brand-orange text-4xl leading-none font-black tracking-tighter">
                {loading ? "..." : formatNumber(status?.players.online || 0)}
            </span>
            <span className="text-sm font-bold tracking-wider text-white uppercase opacity-80">
                Jogadores Online
            </span>
        </div>
    );
}

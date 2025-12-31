"use client";

import { Server } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useServerStatus } from "@/hooks/useServerStatus";
import { SERVER_IP } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServerStatusCardProps {
    itemVariants: Variants;
}

export function ServerStatusCard({ itemVariants }: ServerStatusCardProps) {
    const { status, loading } = useServerStatus(SERVER_IP);

    const formatNumber = (num: number) => {
        return num.toLocaleString("pt-BR");
    };

    const isOnline = status?.online ?? false;

    return (
        <motion.div
            variants={itemVariants}
            className="border-brand-dark/5 hover:border-brand-blue/30 group col-span-1 flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-colors hover:shadow-md md:col-span-3 lg:col-span-4"
        >
            <div className="flex items-start justify-between">
                <div className="bg-brand-blue/10 text-brand-blue flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                    <Server />
                </div>
                <span className="flex h-3 w-3">
                    <span
                        className={cn(
                            "absolute inline-flex h-3 w-3 animate-ping rounded-full opacity-75",
                            isOnline ? "bg-green-400" : "bg-red-400"
                        )}
                    ></span>
                    <span
                        className={cn(
                            "relative inline-flex h-3 w-3 rounded-full",
                            isOnline ? "bg-green-500" : "bg-red-500"
                        )}
                    ></span>
                </span>
            </div>
            <div>
                <h3 className="text-brand-dark mt-4 text-3xl font-black">
                    {loading ? "..." : formatNumber(status?.players.online || 0)}
                </h3>
                <p className="text-brand-dark/60 text-sm font-medium">
                    {isOnline ? "Jogadores Online agora" : "Servidor Offline"}
                </p>
            </div>
        </motion.div>
    );
}

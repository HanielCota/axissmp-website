"use client";

import { useState, useEffect, useCallback } from "react";

export interface ServerStatus {
    online: boolean;
    players: {
        online: number;
        max: number;
    };
    version: string;
    motd: string;
}

interface UseServerStatusReturn {
    status: ServerStatus | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const DEFAULT_STATUS: ServerStatus = {
    online: false,
    players: { online: 0, max: 0 },
    version: "",
    motd: "",
};

export function useServerStatus(
    serverAddress: string,
    refreshInterval: number = 60000
): UseServerStatusReturn {
    const [status, setStatus] = useState<ServerStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Using mcsrvstat.us API - free Minecraft server status API
            const response = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`);

            if (!response.ok) {
                throw new Error("Failed to fetch server status");
            }

            const data = await response.json();

            if (data.online) {
                setStatus({
                    online: true,
                    players: {
                        online: data.players?.online || 0,
                        max: data.players?.max || 0,
                    },
                    version: data.version || "",
                    motd: data.motd?.clean?.[0] || "",
                });
            } else {
                setStatus({ ...DEFAULT_STATUS, online: false });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            setStatus(DEFAULT_STATUS);
        } finally {
            setLoading(false);
        }
    }, [serverAddress]);

    useEffect(() => {
        fetchStatus();

        const interval = setInterval(fetchStatus, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchStatus, refreshInterval]);

    return { status, loading, error, refetch: fetchStatus };
}

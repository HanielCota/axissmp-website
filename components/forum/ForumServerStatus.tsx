"use client";

import { useServerStatus } from "@/hooks/useServerStatus";
import { SERVER_IP } from "@/constants/constants";
import { Users, Globe, Play, Server, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ForumServerStatus() {
    const { status, loading } = useServerStatus(SERVER_IP);
    const online = status?.players.online || 0;
    const max = status?.players.max || 100;
    const percentage = Math.min(100, (online / max) * 100);

    return (
        <Card className="bg-card border-border/40 space-y-4 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Jogadores
                        </p>
                        <p className="text-foreground font-bold tabular-nums">
                            {loading ? (
                                "..."
                            ) : (
                                <span className="text-lg">
                                    {online}/{max}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 rounded-md bg-green-500/10 px-2 py-1 text-xs font-bold text-green-500">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                        Online
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${loading ? 0 : percentage}%` }}
                    />
                </div>
            </div>

            <div className="border-border/40 border-t pt-2">
                <div className="bg-muted/30 border-border/20 mb-3 flex items-center justify-between rounded-lg border p-2">
                    <span className="text-muted-foreground font-mono text-xs">{SERVER_IP}</span>
                    <Server className="text-muted-foreground h-3.5 w-3.5" />
                </div>
                <Button className="w-full font-bold shadow-none" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Jogar Agora
                </Button>
            </div>
        </Card>
    );
}

"use client";

import { useServerStatus } from "@/hooks/useServerStatus";
import { SERVER_IP } from "@/lib/constants";
import { Users, Globe, Play, Server, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ForumServerStatus() {
    const { status, loading } = useServerStatus(SERVER_IP);
    const online = status?.players.online || 0;
    const max = status?.players.max || 100;
    const percentage = Math.min(100, (online / max) * 100);

    return (
        <Card className="bg-card border-border/40 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Jogadores</p>
                        <p className="font-bold text-foreground tabular-nums">
                            {loading ? "..." : <span className="text-lg">{online}/{max}</span>}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-md">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Online
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${loading ? 0 : percentage}%` }}
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-border/40">
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border/20 mb-3">
                    <span className="text-xs font-mono text-muted-foreground">{SERVER_IP}</span>
                    <Server className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <Button className="w-full font-bold shadow-none" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Jogar Agora
                </Button>
            </div>
        </Card>
    );
}

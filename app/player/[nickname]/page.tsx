import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import PlayerProfileClient from "./PlayerProfileClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

interface PublicProfile {
    nickname: string;
    level: number;
    created_at: string;
}

interface PageProps {
    params: Promise<{ nickname: string }>;
}

async function getProfile(nickname: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("nickname, level, created_at")
        .ilike("nickname", nickname)
        .single();

    if (error || !data) return null;
    return data as PublicProfile;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { nickname } = await params;
    const profile = await getProfile(nickname);

    if (!profile) {
        return {
            title: "Jogador não encontrado | AxisSMP",
        };
    }

    return {
        title: `${profile.nickname} - Nível ${profile.level}`,
        description: `Veja o perfil de ${profile.nickname} no AxisSMP. Nível ${profile.level}, jogando desde ${new Date(profile.created_at).toLocaleDateString()}.`,
        openGraph: {
            title: `${profile.nickname} | AxisSMP`,
            description: `Perfil oficial de ${profile.nickname}. Entre agora para jogar junto!`,
            images: [`https://mc-heads.net/avatar/${profile.nickname}/1200`],
        },
    };
}

export default async function PlayerProfilePage({ params }: PageProps) {
    const { nickname } = await params;
    const profile = await getProfile(nickname);

    if (!profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-background text-slate-900 dark:text-white p-6">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-slate-100 dark:text-white/5 italic">404</h1>
                    <h2 className="text-2xl font-bold">Jogador não encontrado</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Não encontramos nenhum jogador com o nickname "{nickname}".</p>
                    <Link href="/" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:underline">
                        <ArrowLeft size={16} /> Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <PlayerProfileClient profile={profile} />
            <Footer />
        </>
    );
}

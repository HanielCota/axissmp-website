import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Shield, ShieldAlert, ExternalLink } from "lucide-react";
import { UserRoleButton } from "@/components/admin/UserRoleButton";

interface Profile {
    id: string;
    nickname: string;
    level: number;
    balance: number;
    role: "user" | "admin" | "mod";
    created_at: string;
}

const roleConfig = {
    user: { label: "Usuário", color: "text-white/60", bg: "bg-white/5", icon: User },
    mod: { label: "Moderador", color: "text-blue-500", bg: "bg-blue-500/10", icon: Shield },
    admin: {
        label: "Admin",
        color: "text-brand-orange",
        bg: "bg-brand-orange/10",
        icon: ShieldAlert,
    },
};

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="py-12 text-center text-white/40">Erro ao buscar usuários.</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight uppercase italic">Usuários</h2>
                <p className="font-medium text-white/40">Gerencie os usuários do servidor.</p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-white/5 text-xs font-black tracking-widest text-white/40 uppercase">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Nível</th>
                                <th className="px-6 py-4">Saldo</th>
                                <th className="px-6 py-4">Cargo</th>
                                <th className="px-6 py-4">Registro</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {profiles?.map((profile: Profile) => {
                                const role = roleConfig[profile.role] || roleConfig.user;
                                const RoleIcon = role.icon;
                                return (
                                    <tr
                                        key={profile.id}
                                        className="group transition-colors hover:bg-white/[0.02]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={`https://mc-heads.net/avatar/${profile.nickname}/32`}
                                                    alt={profile.nickname}
                                                    className="h-10 w-10 rounded-xl border border-white/10"
                                                />
                                                <div>
                                                    <Link
                                                        href={`/player/${profile.nickname}`}
                                                        className="hover:text-brand-orange font-bold transition-colors"
                                                    >
                                                        {profile.nickname}
                                                    </Link>
                                                    <div className="font-mono text-xs text-white/40">
                                                        {profile.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-white/80">
                                                Nv. {profile.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-500">
                                            R$ {profile.balance?.toFixed(2) || "0.00"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${role.bg} ${role.color}`}
                                            >
                                                <RoleIcon size={14} />
                                                <span className="text-xs font-bold uppercase">
                                                    {role.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            {new Date(profile.created_at).toLocaleDateString(
                                                "pt-BR"
                                            )}
                                        </td>
                                        <td className="flex items-center justify-end gap-2 px-6 py-4 text-right">
                                            <Link
                                                href={`/player/${profile.nickname}`}
                                                className="rounded-lg bg-white/5 p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                                                title="Ver Perfil Público"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                            <UserRoleButton
                                                userId={profile.id}
                                                currentRole={profile.role}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!profiles || profiles.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-white/20"
                                    >
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

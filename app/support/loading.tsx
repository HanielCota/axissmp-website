import { Navbar } from "@/components/layout/Navbar"

export default function SupportLoading() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                {/* Header Skeleton */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-white/10" />
                        <div className="mb-2 h-12 w-80 animate-pulse rounded bg-white/10" />
                        <div className="h-5 w-64 animate-pulse rounded bg-white/10" />
                    </div>
                    <div className="h-14 w-48 animate-pulse rounded-2xl bg-white/10" />
                </div>

                {/* Tickets List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 animate-pulse rounded-2xl bg-white/5 border border-white/10"
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

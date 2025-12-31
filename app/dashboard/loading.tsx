export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Header Skeleton */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-white/10" />
                        <div className="mb-2 h-12 w-72 animate-pulse rounded bg-white/10" />
                        <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
                    </div>
                    <div className="h-12 w-36 animate-pulse rounded-2xl bg-white/10" />
                </div>

                {/* Bento Grid Skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-2 lg:grid-rows-3">
                    {/* Character Card */}
                    <div className="col-span-1 h-[500px] animate-pulse rounded-[2.5rem] bg-white/5 md:col-span-8 md:row-span-2 lg:col-span-6 lg:row-span-3" />

                    {/* Stats Cards */}
                    <div className="col-span-1 h-40 animate-pulse rounded-[2.5rem] bg-white/5 md:col-span-4 lg:col-span-3" />
                    <div className="col-span-1 h-40 animate-pulse rounded-[2.5rem] bg-white/5 md:col-span-4 lg:col-span-3" />
                    <div className="col-span-1 h-40 animate-pulse rounded-[2.5rem] bg-white/5 md:col-span-4 lg:col-span-3" />

                    {/* Quick Links */}
                    <div className="col-span-1 h-64 animate-pulse rounded-[2.5rem] bg-white/5 md:col-span-8 lg:col-span-3 lg:row-span-2" />
                </div>

                {/* Orders Section Skeleton */}
                <div className="mt-12 h-80 animate-pulse rounded-[2.5rem] bg-white/5" />
            </div>
        </div>
    )
}

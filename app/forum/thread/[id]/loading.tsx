import { Skeleton } from "@/components/ui/skeleton";

export default function ThreadLoading() {
    return (
        <div className="space-y-8 pb-20">
            {/* Back Button */}
            <Skeleton className="h-10 w-48 rounded-lg" />

            {/* Thread Header */}
            <div className="space-y-4">
                {/* Badges */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Title */}
                <Skeleton className="h-12 w-3/4" />

                {/* Main Card */}
                <div className="border-primary/10 bg-card/60 rounded-xl border p-8">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Author Sidebar */}
                        <div className="flex min-w-[140px] flex-col items-center gap-4 rounded-2xl bg-black/20 p-4">
                            <Skeleton className="h-24 w-20 rounded-lg" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <div className="grid w-full grid-cols-2 gap-2 border-t border-white/5 pt-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center gap-2 pt-6">
                                <Skeleton className="h-8 w-16 rounded-full" />
                                <Skeleton className="h-8 w-16 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-6 pt-10">
                <div className="border-primary/10 flex items-center gap-3 border-b pb-4">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-8 w-48" />
                </div>

                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card/40 rounded-xl border p-8">
                        <div className="flex flex-col gap-8 md:flex-row">
                            <div className="flex min-w-[120px] flex-col items-center gap-3">
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Form */}
            <div className="pt-10">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        </div>
    );
}

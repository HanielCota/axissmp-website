import { Skeleton } from "@/components/ui/skeleton";

export default function ForumLoading() {
    return (
        <div className="space-y-8 pb-10">
            {/* Hero Skeleton */}
            <Skeleton className="h-[300px] w-full rounded-3xl" />

            <div className="px-0">
                <div className="border-border/40 mb-6 flex items-center justify-between border-b pb-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-2 w-2 rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

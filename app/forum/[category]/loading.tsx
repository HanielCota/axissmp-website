import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Search */}
            <Skeleton className="h-12 w-full rounded-xl" />

            {/* Separator */}
            <Skeleton className="h-px w-full" />

            {/* Thread List Header */}
            <div className="hidden md:flex items-center px-6 py-3">
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-4" />
            </div>

            {/* Threads */}
            <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 pt-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
        </div>
    );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="mb-2 h-9 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Search */}
            <Skeleton className="h-12 w-full rounded-xl" />

            {/* Separator */}
            <Skeleton className="h-px w-full" />

            {/* Thread List Header */}
            <div className="hidden items-center px-6 py-3 md:flex">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
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

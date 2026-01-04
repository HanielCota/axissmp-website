export default function StoreLoading() {
    return (
        <main className="min-h-screen bg-brand-light dark:bg-[#09090b] pt-32 px-6 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="h-16 w-64 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl" />
                    <div className="h-12 w-96 bg-slate-200 dark:bg-white/5 animate-pulse rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-80 bg-slate-200 dark:bg-white/5 animate-pulse rounded-[2rem]" />
                    ))}
                </div>
            </div>
        </main>
    );
}

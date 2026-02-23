export default function StoreLoading() {
    return (
        <main className="bg-brand-light min-h-screen px-6 pt-32 transition-colors duration-300 md:px-8 dark:bg-[#09090b]">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="h-16 w-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5" />
                    <div className="h-12 w-96 animate-pulse rounded-full bg-slate-200 dark:bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="h-80 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-white/5"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

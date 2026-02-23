export default function NewsLoading() {
    return (
        <main className="bg-background min-h-screen px-6 pt-32 transition-colors duration-300 md:px-8">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="h-20 w-1/3 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-96 animate-pulse rounded-[2.5rem] bg-slate-100 dark:bg-white/5"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

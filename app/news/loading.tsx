export default function NewsLoading() {
    return (
        <main className="min-h-screen bg-background pt-32 px-6 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="h-20 w-1/3 bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-96 bg-slate-100 dark:bg-white/5 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        </main>
    );
}

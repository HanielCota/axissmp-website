export default function PlayerLoading() {
    return (
        <main className="min-h-screen bg-white pt-32 px-6 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 bg-slate-50 animate-pulse rounded-full" />
                    <div className="h-12 w-48 bg-slate-50 animate-pulse rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 h-[500px] bg-slate-50 animate-pulse rounded-[2.5rem]" />
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="h-48 bg-slate-50 animate-pulse rounded-[2.5rem]" />
                        <div className="grid grid-cols-2 gap-6">
                            <div className="h-32 bg-slate-50 animate-pulse rounded-[2rem]" />
                            <div className="h-32 bg-slate-50 animate-pulse rounded-[2rem]" />
                        </div>
                        <div className="flex-1 h-64 bg-slate-50 animate-pulse rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        </main>
    );
}

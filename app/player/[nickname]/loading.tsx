export default function PlayerLoading() {
    return (
        <main className="min-h-screen bg-white px-6 pt-32 md:px-8">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 animate-pulse rounded-full bg-slate-50" />
                    <div className="h-12 w-48 animate-pulse rounded-2xl bg-slate-50" />
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="h-[500px] animate-pulse rounded-[2.5rem] bg-slate-50 lg:col-span-7" />
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <div className="h-48 animate-pulse rounded-[2.5rem] bg-slate-50" />
                        <div className="grid grid-cols-2 gap-6">
                            <div className="h-32 animate-pulse rounded-[2rem] bg-slate-50" />
                            <div className="h-32 animate-pulse rounded-[2rem] bg-slate-50" />
                        </div>
                        <div className="h-64 flex-1 animate-pulse rounded-[2.5rem] bg-slate-50" />
                    </div>
                </div>
            </div>
        </main>
    );
}

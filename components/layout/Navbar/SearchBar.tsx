import { Search } from "lucide-react";

export function SearchBar() {
    return (
        <div className="w-64">
            <div className="group relative">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="focus:border-brand-orange/50 h-10 w-full rounded-full border border-white/5 bg-white/5 pr-10 pl-4 text-sm font-medium text-white backdrop-blur-sm transition-all placeholder:text-white/50 hover:border-white/10 hover:bg-white/10 focus:bg-black/40 focus:outline-none"
                />
                <button className="hover:text-brand-orange absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-white/70 transition-all hover:bg-white/10">
                    <Search size={16} />
                </button>
            </div>
        </div>
    );
}

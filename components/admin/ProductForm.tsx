"use client";

import { createProduct, updateProduct, getProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ProductFormProps {
    id: string; // "new" or uuid
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    color: string;
}

export default function ProductForm({ id }: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(id !== "new");
    const [product, setProduct] = useState<Product | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("vips");
    const [image, setImage] = useState("");
    const [color, setColor] = useState("bg-brand-orange/20");

    useEffect(() => {
        if (id === "new") return;

        const fetchProduct = async () => {
            const { data, error } = await getProduct(id);

            if (error) {
                toast.error(error);
                router.push("/admin/products");
                return;
            }

            if (!data) {
                setLoading(false);
                return;
            }

            setProduct(data);
            setName(data.name);
            setPrice(data.price.toString());
            setCategory(data.category);
            setImage(data.image);
            setColor(data.color || "bg-brand-orange/20");
            setLoading(false);
        };

        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("category", category);
        formData.set("image", image);
        formData.set("color", color);

        startTransition(async () => {
            const result = id === "new"
                ? await createProduct(formData)
                : await updateProduct(id, formData);

            if (result.error) {
                toast.error(result.error);
                if (result.details) {
                    console.error(result.details);
                }
                return;
            }

            toast.success(id === "new" ? "Produto criado!" : "Produto atualizado!");
            router.push("/admin/products");
            router.refresh();
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-brand-orange" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Voltar para Produtos
            </Link>

            <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">
                    {id === "new" ? "Novo Produto" : "Editar Produto"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Nome do Produto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                            placeholder="Ex: VIP Lendário"
                        />
                    </div>

                    {/* Price and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all appearance-none cursor-pointer"
                            >
                                <option value="vips">VIPs</option>
                                <option value="coins">Coins</option>
                                <option value="unban">Desbanimento</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Imagem do Produto</label>
                        <ImageUpload
                            value={image}
                            onChange={setImage}
                        />
                    </div>

                    {/* Color Class */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Cor de Fundo (Tailwind Class)</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="flex-1 rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                                placeholder="bg-brand-orange/20"
                            />
                            <div className={`w-12 h-12 rounded-xl border border-white/5 ${color} shrink-0`}></div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-xl bg-brand-orange px-8 py-3 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {id === "new" ? "Criar Produto" : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

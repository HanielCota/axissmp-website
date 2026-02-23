"use client";

import { createProduct, updateProduct, getProduct } from "@/lib/actions/products";
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
            const result =
                id === "new" ? await createProduct(formData) : await updateProduct(id, formData);

            if (result.error) {
                toast.error(result.error);
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
                <Loader2 className="text-brand-orange animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-2xl duration-500">
            <Link
                href="/admin/products"
                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-white"
            >
                <ArrowLeft size={16} />
                Voltar para Produtos
            </Link>

            <div className="rounded-3xl border border-white/5 bg-black/20 p-8 backdrop-blur-sm">
                <h2 className="mb-8 text-2xl font-black tracking-tight uppercase italic">
                    {id === "new" ? "Novo Produto" : "Editar Produto"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                            Nome do Produto
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                            placeholder="Ex: VIP Lendário"
                        />
                    </div>

                    {/* Price and Category */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Preço (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="focus:border-brand-orange focus:ring-brand-orange w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                                Categoria
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="focus:border-brand-orange focus:ring-brand-orange w-full cursor-pointer appearance-none rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none"
                            >
                                <option value="vips">VIPs</option>
                                <option value="coins">Coins</option>
                                <option value="unban">Unban</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                            Imagem do Produto
                        </label>
                        <ImageUpload value={image} onChange={setImage} />
                    </div>

                    {/* Color Class */}
                    <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-white/40 uppercase">
                            Cor de Fundo (Tailwind Class)
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="focus:border-brand-orange focus:ring-brand-orange flex-1 rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-all placeholder:text-white/20 focus:ring-1 focus:outline-none"
                                placeholder="bg-brand-orange/20"
                            />
                            <div
                                className={`h-12 w-12 rounded-xl border border-white/5 ${color} shrink-0`}
                            ></div>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-white/5 pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-brand-orange text-brand-dark flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-black uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {id === "new" ? "Criar Produto" : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

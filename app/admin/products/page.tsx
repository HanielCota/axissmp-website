import { getProducts } from "@/app/actions/products";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Product } from "@/lib/products";

export default async function AdminProductsPage() {
    const { data: products } = await getProducts();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Produtos</h2>
                    <p className="text-white/40 font-medium">Gerencie os itens da loja.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-black uppercase text-brand-dark transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    Novo Produto
                </Link>
            </div>

            <div className="rounded-3xl border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-xs font-black uppercase tracking-widest text-white/40">
                            <tr>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products?.map((product: Product) => (
                                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${product.color || 'bg-white/10'} flex items-center justify-center relative overflow-hidden`}>
                                                {product.image && (product.image.startsWith('/') || product.image.startsWith('http')) ? (
                                                    <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <span className="text-xs">IMG</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">{product.name}</div>
                                                <div className="text-xs text-white/40 font-mono">ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-white/[0.03] border border-white/5 px-2.5 py-0.5 text-xs font-bold text-white/50 uppercase">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-orange">
                                        R$ {product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!products || products.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/20">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

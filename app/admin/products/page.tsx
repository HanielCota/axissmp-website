import { getProducts } from "@/lib/actions/products";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Product } from "@/types/store";

export default async function AdminProductsPage() {
    const { data: products } = await getProducts();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase italic">
                        Produtos
                    </h2>
                    <p className="font-medium text-white/40">Gerencie os itens da loja.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-brand-orange text-brand-dark flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black uppercase transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={18} />
                    Novo Produto
                </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-white/5 text-xs font-black tracking-widest text-white/40 uppercase">
                            <tr>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products?.map((product: Product) => (
                                <tr
                                    key={product.id}
                                    className="group transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`h-12 w-12 rounded-xl ${product.color || "bg-white/10"} relative flex items-center justify-center overflow-hidden`}
                                            >
                                                {product.image &&
                                                    (product.image.startsWith("/") ||
                                                        product.image.startsWith("http")) ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-8 w-8 object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs">IMG</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">{product.name}</div>
                                                <div className="font-mono text-xs text-white/40">
                                                    ID: {product.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-0.5 text-xs font-bold text-white/50 uppercase">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="text-brand-orange px-6 py-4 font-bold">
                                        R$ {product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
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
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-white/20"
                                    >
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

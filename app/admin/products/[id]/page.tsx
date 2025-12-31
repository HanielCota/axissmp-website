
import ProductForm from "@/components/admin/ProductForm";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductForm id={id} />;
}

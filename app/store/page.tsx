import { StoreClient } from "@/components/store/StoreClient";
import { getProducts } from "@/lib/actions/products";
import { Footer } from "@/components/layout/Footer";

export default async function StorePage() {
    const { data: products } = await getProducts();
    return (
        <>
            <StoreClient products={products || []} />
            <Footer />
        </>
    );
}

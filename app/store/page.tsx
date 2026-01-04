import { StoreClient } from "@/components/store/StoreClient";
import { getProducts } from "@/app/actions/products";
import { Footer } from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function StorePage() {
    const { data: products } = await getProducts();
    return (
        <>
            <StoreClient products={products || []} />
            <Footer />
        </>
    );
}

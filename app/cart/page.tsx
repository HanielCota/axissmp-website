import { CartClient } from "@/components/store/CartClient";
import { Footer } from "@/components/layout/Footer";

export default function CartPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <CartClient />
            </main>
            <Footer />
        </div>
    );
}

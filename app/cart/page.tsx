import { CartClient } from "@/components/store/CartClient";
import { Footer } from "@/components/layout/Footer";

export default function CartPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <CartClient />
            </main>
            <Footer />
        </div>
    );
}

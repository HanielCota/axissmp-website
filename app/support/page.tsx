import { SupportClient } from "@/components/support/SupportClient";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Suporte | AxisSMP",
    description: "Central de atendimento oficial do servidor AxisSMP.",
};

export default function SupportPage() {
    return (
        <>
            <SupportClient />
            <Footer />
        </>
    );
}

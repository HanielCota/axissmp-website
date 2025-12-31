import { AdminTicketDetail } from "@/components/admin/AdminTicketDetail";

interface TicketDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminTicketDetailPage({ params }: TicketDetailPageProps) {
    const { id } = await params;
    return <AdminTicketDetail ticketId={id} />;
}

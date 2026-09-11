import Navbar from "@/components/portal/AI/Navbar";
import PendaftaranDetail from "@/components/portal/asesi/PendaftaranDetail";
import Footer from "@/components/portal/AI/Footer";

export default async function PendaftaranDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main>
            <Navbar />
            <PendaftaranDetail id={id} />
            <Footer />
        </main>
    );
}
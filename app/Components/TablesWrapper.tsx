import { createClient } from "@/utils/supabase/server";
import Tables from "./Tables";

// Next.js Server Component menerima searchParams secara otomatis
export default async function TablesWrapper({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const resolvedParams = await searchParams;
    const page = Number(resolvedParams.page) || 1; // Default ke halaman 1 jika tidak ada

    const supabase = await createClient();
    const itemsPerPage = 8;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Tambahkan count: "exact" untuk mendapatkan total seluruh data di database
    const { data, error, count } = await supabase
        .from("sidang_list")
        .select("*", { count: "exact" })
        .order("id", { ascending: true })
        .range(from, to);

    console.log("Data:", data);
    console.log("Error:", error);

    // Kirim data, currentPage, dan totalItems ke komponen Tables
    return (
        <Tables
            sidangData={data ?? []}
            currentPage={page}
            totalItems={count ?? 0}
            itemsPerPage={itemsPerPage}
        />
    );
}
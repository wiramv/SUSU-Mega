import { createClient } from "@/utils/supabase/server";
import Tables from "./Tables";

export default async function TablesWrapper({ page = 1 }) {
    const supabase = await createClient();
    const itemsPerPage = 8;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await supabase
        .from("sidang_list")
        .select()
        .order("id", { ascending: true }) // pastikan urut
        .range(from, to);

    console.log("Data:", data);
    console.log("Error:", error);

    return <Tables sidangData={data ?? []} />;
}




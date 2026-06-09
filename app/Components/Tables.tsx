'use client'
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"
import { HiPencilAlt } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import Link from 'next/link'


import AddSidang from "@/app/Components/AddSidang";
import IndexPage from "@/app/Components/IndexPages";

type SidData = {
    id: number;
    user_id: string;
    no_perkara: string;
    jenis_perkara: string;
    tgl_putus: string;
    tgl_pemberitahuan: string;
    tgl_bht: string;
    tgl_kekuatan: string;
    keterangan?: string;
};

type TablesProps = {
    sidangData: SidData[];
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
};

export default function Tables({ sidangData, currentPage, totalItems, itemsPerPage }: TablesProps) {
    const [rows, setRows] = useState<SidData[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRows(sidangData);
    }, [sidangData]);

    // FIX 1: Perbaikan logika tanggal & tipe return string yang konsisten
    const getBHTStatus = (tglBHT: string | null | undefined): string => {
        if (!tglBHT || tglBHT.trim() === "") return "Belum ada BHT";

        const today = new Date();
        const bhtDate = new Date(tglBHT);

        // Validasi jika string tanggal rusak/invalid
        if (isNaN(bhtDate.getTime())) return "Tanggal Invalid";

        today.setHours(0, 0, 0, 0);
        bhtDate.setHours(0, 0, 0, 0);

        const todayTime = today.getTime();
        const bhtTime = bhtDate.getTime();

        if (bhtTime > todayTime) return "belum BHT";
        if (bhtTime < todayTime) return "terlewat";
        return "sudah BHT"; // Menggunakan s kecil agar sinkron dengan getBHTColor
    };

    // FIX 2: Sinkronisasi text case dengan getBHTStatus
    const getBHTColor = (status: string) => {
        if (status === "belum BHT") return "bg-bluish p-1 rounded-sm";
        if (status === "sudah BHT") return "bg-true p-1 rounded-sm";
        if (status === "terlewat") return "bg-false p-1 rounded-sm text-red-50";
        return "bg-orange-600 p-1 rounded-sm text-red-50"; // Untuk 'Belum ada BHT' atau 'Tanggal Invalid'
    };

    const supabase = createClient();
    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from("sidang_list")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Gagal hapus data:", error.message);
            alert("Delete gagal: " + error.message);
        } else {
            setRows((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="text-main-color font-poppins flex flex-col gap-10 justify-center items-center py-3.75">
            <div className="mt-9 flex items-center flex-col gap-3.75">
                <h1 className="font-bold text-7xl">SUSU</h1>
                <h6 className="font-semibold text-3xl">Sistem Urusan Sidang Umum</h6>
            </div>

            <div className="font-poppins bg-white w-300">
                <div className="overflow-x-auto relative">
                    <table className={'w-full'}>
                        <thead className="border-b-2 border-bluish/30">
                        <tr className="text-sm font-semibold text-slate-700">
                            <th className="px-4 py-3 text-left">No Perkara</th>
                            <th className="px-4 py-3 text-left">Jenis Perkara</th>
                            <th className="px-4 py-3 text-left">Tgl. Putus</th>
                            <th className="px-4 py-3 text-left">Tgl. Pemberitahuan Putus</th>
                            <th className="px-4 py-3 text-left">Tgl. BHT</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Keterangan</th>
                            <th className="px-4 py-3"></th>
                            <th className="px-4 py-3"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-bluish/20 text-sm">
                        {rows.map((item) => {
                            // FIX 3: Simpan status ke variabel agar tidak memanggil fungsi 2 kali (lebih optimal)
                            const statusBHT = getBHTStatus(item.tgl_bht);
                            const warnaBHT = getBHTColor(statusBHT);

                            return (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">{item.no_perkara}</td>
                                    <td className="px-4 py-3">{item.jenis_perkara}</td>
                                    <td className="px-4 py-3">{item.tgl_putus ? item.tgl_putus : "-----"}</td>
                                    <td className="px-4 py-3">{item.tgl_pemberitahuan ? item.tgl_pemberitahuan : "-----"}</td>
                                    <td className="px-4 py-3">{item.tgl_bht ? item.tgl_bht : "-----"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            <div className={`w-28 text-center ${warnaBHT}`}>
                                                {statusBHT}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            {item.keterangan && <div className="">{item.keterangan}</div>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/formpage?id=${item.id}&no_perkara=${encodeURIComponent(item.no_perkara)}&jenis_perkara=${encodeURIComponent(item.jenis_perkara)}&keterangan=${encodeURIComponent(item.keterangan || '')}&tgl_putus=${item.tgl_putus}&tgl_pemberitahuan=${item.tgl_pemberitahuan}`}>
                                            <HiPencilAlt size={18} className="text-bluish"/>
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDelete(item.id)} className={'cursor-pointer'}>
                                            <FaTrash size={16} className="text-false"/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <AddSidang/>
            </div>

            <IndexPage
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
            />

        </div>
    );
}
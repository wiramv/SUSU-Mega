'use client'
import {useState, useEffect} from "react";
import {createClient} from "@/utils/supabase/client"
// icons
import {PiNoteBlankFill} from "react-icons/pi";
import {HiPencilAlt} from "react-icons/hi";
import {FaTrash} from "react-icons/fa";

// components

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
    keterangan?: string; // optional karena bisa kosong
};

type TablesProps = {
    sidangData: SidData[];
};

export default function Tables({sidangData}: TablesProps) {
    const [rows, setRows] = useState<SidData[]>([]);
    useEffect(() => {
        console.log("Data dari Supabase:", sidangData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRows(sidangData);
    }, [sidangData]);

    const getBHTStatus = (tglBHT: string) => {
        const today = new Date();
        const bhtDate = new Date(tglBHT);

        today.setHours(0, 0, 0, 0);
        bhtDate.setHours(0, 0, 0, 0);

        if (bhtDate > today) return "belum BHT";
        if (bhtDate < today) return "terlewat";
        return "sudah BHT"; // sama persis dengan hari ini
    };

// mapping warna
    const getBHTColor = (status: string) => {
        if (status === "belum BHT") return "bg-bluish p-1 rounded-sm";
        if (status === "sudah BHT") return "bg-true p-1 rounded-sm";
        return "bg-false p-1 rounded-sm text-red-50";
    };


    const supabase = createClient();
    const handleDelete = async (id: number) => {
        const {error} = await supabase
            .from("sidang_list")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Gagal hapus data:", error.message);
            alert("Delete gagal: " + error.message);
        } else {
            console.log(`Data dengan id ${id} berhasil dihapus`);
            setRows((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="text-main-color font-poppins flex flex-col gap-10 justify-center items-center py-3.75">
            <div className="mt-9 flex items-center flex-col gap-3.75">
                <h1 className="font-bold text-7xl">SUSU</h1>
                <h6 className="font-semibold text-3xl">Sistem Urusan Sidang Umum</h6>
            </div>

            {/* tables */}
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
                        {rows.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{item.no_perkara}</td>
                                <td className="px-4 py-3">{item.jenis_perkara}</td>
                                <td className="px-4 py-3">{item.tgl_putus}</td>
                                <td className="px-4 py-3">{item.tgl_pemberitahuan}</td>
                                <td className="px-4 py-3">{item.tgl_bht}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                        <div
                                            className={` w-28 text-center ${getBHTColor(getBHTStatus(item.tgl_bht))}`}
                                        >
                                            {getBHTStatus(item.tgl_bht)}
                                        </div>

                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                        {item.keterangan && (
                                            <div

                                                className=""
                                            >
                                                {item.keterangan}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button>
                                        <HiPencilAlt size={18} className="text-bluish"/>
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleDelete(item.id)} className={'cursor-pointer'}>
                                        <FaTrash size={16} className="text-false"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <AddSidang/>
            </div>
            <IndexPage/>
        </div>
    );
}
"use client";

import { useState } from "react";
import {useRouter} from "next/navigation";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdArrowDropdownCircle, IoMdAddCircle } from "react-icons/io";
import Calendar from "react-calendar";
import { createClient } from "@/utils/supabase/client";

import "react-calendar/dist/Calendar.css";

type CalendarValue = Date | null | [Date | null, Date | null];

const jenisPerkaraOptions = ["Cerai gugat", "Cerai talak", "Isbat nikah", "Waris"];
const keteranganOptions = ["perlu dibuat akte cerai", "sudah ada akte cerai", "proses banding"];

function DatePickerField({
                             label,
                             value,
                             onChange,
                         }: {
    label: string;
    value: Date | null;
    onChange: (val: Date) => void;
}) {
    const [open, setOpen] = useState(false);

    const formatted = value ? value.toLocaleDateString("sv-SE") : "";

    const handleCalendarChange = (val: CalendarValue) => {
        if (val && !Array.isArray(val)) {
            onChange(val);
            setOpen(false);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800">{label}</label>
            <div className="relative">
                <div
                    className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span>{formatted || "Pilih tanggal"}</span>
                    <CiCalendarDate className="text-xl text-gray-500" />
                </div>
                {open && (
                    <div className="absolute z-50 mt-1 rounded-md shadow-lg bg-white">
                        <Calendar onChange={handleCalendarChange} value={value} />
                    </div>
                )}
            </div>
        </div>
    );
}

function SelectField({
                         label,
                         options,
                         value,
                         onChange,
                     }: {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800">{label}</label>
            <div className="relative">
                <select
                    className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:outline-none"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <IoMdArrowDropdownCircle className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
            </div>
        </div>
    );
}

export default function MainForm() {
    const supabase = createClient();

    const [noPerkara, setNoPerkara] = useState("");
    const [jenisPerkara, setJenisPerkara] = useState(jenisPerkaraOptions[0]);
    const [keterangan, setKeterangan] = useState(keteranganOptions[0]);
    const [tglPutus, setTglPutus] = useState<Date | null>(new Date());
    const [tglPemberitahuan, setTglPemberitahuan] = useState<Date | null>(new Date());
    const [tglKekuatan, setTglKekuatan] = useState<Date | null>(new Date());
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let tglBht: string | null = null;
        if (tglPemberitahuan) {
            const bhtDate = new Date(tglPemberitahuan);
            bhtDate.setDate(bhtDate.getDate() + 14);
            tglBht = bhtDate.toISOString().split("T")[0]; // format YYYY-MM-DD
        }

        const { error } = await supabase.from("sidang_list").insert([
            {
                no_perkara: noPerkara,
                jenis_perkara: jenisPerkara,
                keterangan,
                tgl_putus: tglPutus?.toISOString().split("T")[0],
                tgl_pemberitahuan: tglPemberitahuan?.toISOString().split("T")[0],
                tgl_bht: tglBht
            },
        ]);

        if (error) {
            console.error("Gagal tambah data:", error.message);
            alert("Error: " + error.message);
        } else {
            router.push("/")
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-auto w-250 rounded-xl bg-[#dff4f4] p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* No Perkara */}
                    <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-800">No Perkara</label>
                        <input
                            type="text"
                            placeholder="No Perkara"
                            value={noPerkara}
                            onChange={(e) => setNoPerkara(e.target.value)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
                        />
                    </div>

                    {/* Jenis Perkara */}
                    <SelectField
                        label="Jenis Perkara"
                        options={jenisPerkaraOptions}
                        value={jenisPerkara}
                        onChange={setJenisPerkara}
                    />

                    {/* Keterangan */}
                    <SelectField
                        label="Keterangan"
                        options={keteranganOptions}
                        value={keterangan}
                        onChange={setKeterangan}
                    />

                    {/* Tgl Putus */}
                    <DatePickerField label="Tgl Putus" value={tglPutus} onChange={setTglPutus} />

                    {/* Tgl Pemberitahuan Putus */}
                    <DatePickerField label="Tgl Pemberitahuan Putus" value={tglPemberitahuan} onChange={setTglPemberitahuan} />


                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md border border-bluish px-4 py-2 text-sm font-medium text-bluish transition hover:bg-bluish hover:text-white"
                >
                    <span>Submit</span>
                    <IoMdAddCircle size={20} />
                </button>
            </div>
        </form>
    );
}

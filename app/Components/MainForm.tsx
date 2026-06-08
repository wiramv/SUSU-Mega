"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdArrowDropdownCircle, IoMdAddCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Calendar from "react-calendar";
import { createClient } from "@/utils/supabase/client";

import "react-calendar/dist/Calendar.css";

type CalendarValue = Date | null | [Date | null, Date | null];

export interface InitialFormProps {
    id?: string | number;
    no_perkara?: string;
    jenis_perkara?: string;
    keterangan?: string;
    tgl_putus?: string | null;
    tgl_pemberitahuan?: string | null;
}

const jenisPerkaraOptions = [
    "Cerai gugat", "Cerai talak", "Isbat nikah", "Waris", "Asal Usul Anak",
    "Cerai Gugat", "Cerai Talak", "Dispensasi Kawin", "Ekonomi Syariah",
    "Ganti Rugi terhadap Wali", "Gugatan Memperoleh Akta Perdamaian Atas Kesepakatan Perdamaian di Luar Pengadilan",
    "Hak - hak bekas istri/kewajiban bekas Suami", "Harta Bersama", "Hibah",
    "Isbat Rukyat Hilal", "Izin Kawin", "Izin Poligami", "Kelalaian Atas Kewajiban Suami / Istri",
    "Kewarisan", "Lain-Lain", "Mahar Terhutang", "Nafkah Anak Oleh Ibu karena Ayah tidak mampu",
    "Nafkah Anak Pasca Perceraian", "P3HP/Penetapan Ahli Waris", "Pembatalan Arbitrase Syariah",
    "Pembatalan Perkawinan", "Pencabutan Kekuasaan Orang Tua", "Pencabutan Kekuasaan Wali",
    "Pencegahan Perkawinan", "Pengangkatan Anak", "Pengesahan Anak", "Pengesahan Perkawinan/Istbat Nikah",
    "Penguasaan Anak", "Penolakan Kawin Campuran", "Penolakan Perkawinan oleh PPN",
    "Penunjukan orang lain sebagai Wali oleh Pengadilan", "Perbaikan Identitas Putusan dan Akta Cerai",
    "Perjanjian Perkawinan/Perjanjian Kawin", "Perwalian", "Shadaqoh", "Wakaf", "Wali Adhol",
    "Wasiat", "perlu dibuat akte cerai", "sudah ada akte cerai", "proses banding"
];

const keteranganOptions = [
    "perlu dibuat akte cerai", "Sudah dibuat akta cerai", "proses upaya hukum", "perlu dibuat phs ikrar", "tidak dibuat akte cerai"
];

function DatePickerField({
                             label,
                             value,
                             onChange,
                         }: {
    label: string;
    value: Date | null;
    onChange: (val: Date | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const formatted = value && !isNaN(value.getTime()) ? value.toLocaleDateString("id-ID") : "";

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
                        <Calendar onChange={handleCalendarChange} value={value || undefined} />
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

interface MainFormProps {
    initialData?: InitialFormProps;
}

export default function MainForm({ initialData }: MainFormProps) {
    const supabase = createClient();
    const router = useRouter();

    const isEditMode = !!initialData?.id;

    // Fungsi pembantu menangani string "null" dari URL dan validasi tanggal
    const parseDbDate = (dateStr?: string | null): Date | null => {
        if (!dateStr || dateStr === "null" || dateStr === "undefined") return null;
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    // State awal form
    const [noPerkara, setNoPerkara] = useState("");
    const [jenisPerkara, setJenisPerkara] = useState(jenisPerkaraOptions[0]);
    const [keterangan, setKeterangan] = useState(keteranganOptions[0]);
    const [tglPutus, setTglPutus] = useState<Date | null>(null);
    const [tglPemberitahuan, setTglPemberitahuan] = useState<Date | null>(null);

    // KUNCI PERBAIKAN: Sync data begitu initialData dari URL masuk/berubah
    useEffect(() => {
        if (initialData) {
            if (initialData.no_perkara) setNoPerkara(initialData.no_perkara);

            if (initialData.jenis_perkara) {
                const decodedJenis = decodeURIComponent(initialData.jenis_perkara);
                if (jenisPerkaraOptions.includes(decodedJenis)) setJenisPerkara(decodedJenis);
            }

            if (initialData.keterangan) {
                const decodedKet = decodeURIComponent(initialData.keterangan);
                if (keteranganOptions.includes(decodedKet)) setKeterangan(decodedKet);
            }

            setTglPutus(parseDbDate(initialData.tgl_putus));
            setTglPemberitahuan(parseDbDate(initialData.tgl_pemberitahuan));
        }
    }, [initialData]);

    const convertToDbDate = (date: Date | null): string | null => {
        if (!date || isNaN(date.getTime())) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let tglBht: string | null = null;
        if (tglPemberitahuan) {
            const bhtDate = new Date(tglPemberitahuan);
            bhtDate.setDate(bhtDate.getDate() + 15);
            tglBht = convertToDbDate(bhtDate);
        }

        const payload = {
            no_perkara: noPerkara,
            jenis_perkara: jenisPerkara,
            keterangan,
            tgl_putus: convertToDbDate(tglPutus),
            tgl_pemberitahuan: convertToDbDate(tglPemberitahuan),
            tgl_bht: tglBht
        };

        if (isEditMode) {
            const { error } = await supabase
                .from("sidang_list")
                .update(payload)
                .eq("id", initialData!.id);

            if (error) {
                console.error("Gagal mengupdate data:", error.message);
                alert("Error: " + error.message);
            } else {
                router.push("/");
            }
        } else {
            const { error } = await supabase
                .from("sidang_list")
                .insert([payload]);

            if (error) {
                console.error("Gagal tambah data:", error.message);
                alert("Error: " + error.message);
            } else {
                router.push("/");
            }
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
                    <span>{isEditMode ? "Update" : "Submit"}</span>
                    {isEditMode ? <MdEdit size={20} /> : <IoMdAddCircle size={20} />}
                </button>
            </div>
        </form>
    );
}
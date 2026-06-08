import Image from "next/image";
import thumbnail from "@/public/thumb.jpeg";
import MainForm, { InitialFormProps } from "@/app/Components/MainForm";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FormPage({ searchParams }: PageProps) {
    // 1. Tunggu dan ambil data langsung dari URL Bar (fitur Next.js Server Component)
    const resolvedParams = await searchParams;

    const id = resolvedParams.id as string | undefined;
    const no_perkara = resolvedParams.no_perkara as string | undefined;
    const jenis_perkara = resolvedParams.jenis_perkara as string | undefined;
    const keterangan = resolvedParams.keterangan as string | undefined;
    const tgl_putus = resolvedParams.tgl_putus as string | undefined;
    const tgl_pemberitahuan = resolvedParams.tgl_pemberitahuan as string | undefined;

    // 2. Bungkus ke dalam objek initialData
    const initialData: InitialFormProps = {
        id: id || undefined,
        no_perkara: no_perkara || "",
        jenis_perkara: jenis_perkara || undefined,
        keterangan: keterangan || undefined,
        tgl_putus: tgl_putus || null,
        tgl_pemberitahuan: tgl_pemberitahuan || null
    };

    return (
        <div className="grid grid-cols-12 h-screen">
            {/*Thumbnail*/}
            <div id="thumb" className="col-span-3 h-full bg-pink-50">
                <Image src={thumbnail} alt={"thumbnail"} className={'h-screen object-cover'} loading={'lazy'}/>
            </div>
            {/* Main*/}
            <div className={'col-span-9'}>
                <div className="text-main-color font-poppins flex flex-col gap-10 justify-center items-center py-3.75">
                    <div className="mt-9 flex items-center flex-col gap-3.75">
                        <h1 className="font-bold text-7xl">SUSU</h1>
                        <h6 className="font-semibold text-3xl">Sistem Urusan Sidang Umum</h6>
                        {id && (
                            <span className="text-sm bg-yellow-100 text-yellow-800 font-medium px-2.5 py-0.5 rounded border border-yellow-300">
                                Mode Edit ID: {id}
                            </span>
                        )}
                    </div>
                    {/* 3. Kirim data URL ke dalam MainForm */}
                    <MainForm initialData={initialData} />
                </div>
            </div>
        </div>
    );
}
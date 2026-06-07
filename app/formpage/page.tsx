import Image from "next/image";
import thumbnail from "@/public/thumb.jpeg";
import MainForm from "@/app/Components/MainForm";

export default function FormPage() {
    return (
        <div className="grid grid-cols-12 h-screen">
            {/*Thumbnail*/}
            <div id="thumb" className="col-span-3 h-full bg-pink-50">
                <Image src={thumbnail} alt={"thumbnail"} className={'h-screen object-cover'} loading={'lazy'}/>
            </div>
            {/*  Main*/}
            <div className={'col-span-9'}>
                <div className="text-main-color font-poppins flex flex-col gap-10 justify-center items-center py-3.75">
                    <div className="mt-9 flex items-center flex-col gap-3.75">
                        <h1 className="font-bold text-7xl">SUSU</h1>
                        <h6 className="font-semibold text-3xl">Sistem Urusan Sidang Umum</h6>
                    </div>
                    <MainForm/>
                </div>
            </div>
        </div>
    )
}
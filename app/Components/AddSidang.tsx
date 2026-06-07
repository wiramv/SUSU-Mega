import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";
export default function AddSidang() {
    return(
        <div className="mt-6 flex justify-end">
            <Link href={"/formpage"}
                type="button"
                className="
      flex items-center gap-2
      rounded-md
      border border-bluish
      px-4 py-2
      text-sm font-medium
      text-bluish
      transition
      hover:bg-bluish
      hover:text-white
    "
            >
                <span>Tambah Sidang</span>
                <IoMdAddCircle size={20} />
            </Link>
        </div>
    )
}
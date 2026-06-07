'use client'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type IndexPageProps = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
};

export default function IndexPage({ currentPage, totalItems, itemsPerPage }: IndexPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Hitung totalPage secara dinamis berdasarkan data real dari database
    const totalPage = Math.ceil(totalItems / itemsPerPage) || 1;
    const [pageArray, setPageArray] = useState<(number | string)[]>([]);

    useEffect(() => {
        let arr: (number | string)[] = [];

        if (totalPage <= 5) {
            arr = Array.from({ length: totalPage }, (_, i) => i + 1);
        } else {
            if (currentPage <= 3) {
                arr = [1, 2, 3, "...", totalPage];
            } else if (currentPage >= totalPage - 2) {
                arr = [1, "...", totalPage - 2, totalPage - 1, totalPage];
            } else {
                arr = [currentPage - 1, currentPage, "...", totalPage - 1, totalPage];
            }
        }

        setPageArray(arr);
    }, [currentPage, totalPage]);

    // Fungsi untuk memperbarui URL Query Param (?page=...)
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex gap-3 items-center">
            {currentPage > 1 && (
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-2 py-1 cursor-pointer"
                >
                    Prev
                </button>
            )}

            {pageArray.map((item, index) => (
                <button
                    key={`page-${index}`}
                    disabled={item === "..."}
                    onClick={() => typeof item === "number" && handlePageChange(item)}
                    className={`px-2 py-1 context-none ${typeof item === 'number' ? 'cursor-pointer' : ''} ${item === currentPage ? " text-bluish font-bold" : ""}`}
                >
                    {item}
                </button>
            ))}

            {currentPage < totalPage && (
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-2 py-1 cursor-pointer"
                >
                    Next
                </button>
            )}
        </div>
    );
}
'use client'
import { useState, useEffect } from "react";

export default function IndexPage() {
    const totalItem: number = 100;
    const itemsPerPage: number = 10;
    const totalPage: number = Math.ceil(totalItem / itemsPerPage);

    const [currentPage, setCurrentPage] = useState<number>(4);
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

    return (
        <div className="flex gap-3 items-center">
            {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className="px-2 py-1 ">
                    Prev
                </button>
            )}

            {pageArray.map((item, index) => (
                <button
                    key={`page-${index}`}
                    disabled={item === "..."}
                    onClick={() => typeof item === "number" && setCurrentPage(item)}
                    className={`px-2 py-1  ${item === currentPage ? " text-bluish font-bold" : ""}`}
                >
                    {item}
                </button>
            ))}

            {currentPage < totalPage && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className="px-2 py-1 ">
                    Next
                </button>
            )}
        </div>
    );
}

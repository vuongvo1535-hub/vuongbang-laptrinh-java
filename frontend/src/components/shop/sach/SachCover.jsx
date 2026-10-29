"use client";

import { useState, useEffect } from "react";
import { FiBook } from "react-icons/fi";
import { layDuongDanAnh } from "@/utils/format";

// Hien thi anh bia sach lay truc tiep tu backend
export default function BookCover({ anhBia, ten, className = "" }) {
    const [loi, setLoi] = useState(false);
    const duongDan = layDuongDanAnh(anhBia);

    useEffect(() => {
        setLoi(false);
    }, [anhBia]);

    if (!duongDan || loi) {
        return (
            <div
                className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 p-3 text-center select-none ${className}`}
            >
                <FiBook size={36} className="text-emerald-600 mb-1" />
                <span className="text-xs font-semibold line-clamp-2 px-1 text-emerald-950">
                    {ten || "Sách thư viện"}
                </span>
            </div>
        );
    }

    return (
        <img
            src={duongDan}
            alt={ten || "Ảnh bìa sách"}
            onError={() => {
                setLoi(true);
            }}
            className={`object-cover ${className}`}
        />
    );
}

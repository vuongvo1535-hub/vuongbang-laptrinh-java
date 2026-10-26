"use client";

import { useState } from "react";
import { FiBook } from "react-icons/fi";
import { layDuongDanAnh } from "@/utils/format";

// Hiển thị ảnh bìa sách thông minh và chống lỗi ảnh vỡ
export default function BookCover({ anhBia, ten, className = "" }) {
    const [loi, setLoi] = useState(false);
    const duongDan = layDuongDanAnh(anhBia);

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
                // Nếu đường dẫn tương đối lỗi, thử lấy qua backend localhost:8080
                if (!duongDan.startsWith("http") && anhBia) {
                    const tenFile = String(anhBia).split("/").pop();
                    const urlBackend = `http://localhost:8080/shop/images/sach/${tenFile}`;
                    if (duongDan !== urlBackend) {
                        // Thử 1 lần với backend URL
                        return;
                    }
                }
                setLoi(true);
            }}
            className={`object-cover ${className}`}
        />
    );
}

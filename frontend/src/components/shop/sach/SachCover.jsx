"use client";

import { useState } from "react";
import { FiBook } from "react-icons/fi";
import { layDuongDanAnh } from "@/utils/format";

// Hiển thị ảnh bìa; không có ảnh (hoặc ảnh lỗi) thì hiện khung mặc định
export default function BookCover({ anhBia, ten, className = "" }) {
  const [loi, setLoi] = useState(false);
  const duongDan = layDuongDanAnh(anhBia);

  if (!duongDan || loi) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-vang-kem text-cam-dam ${className}`}
      >
        <FiBook size={40} />
        <span className="mt-2 text-xs text-nau-dam/50">Chưa có ảnh bìa</span>
      </div>
    );
  }

  return (
    <img
      src={duongDan}
      alt={ten || "Ảnh bìa sách"}
      onError={() => setLoi(true)}
      className={`object-cover ${className}`}
    />
  );
}

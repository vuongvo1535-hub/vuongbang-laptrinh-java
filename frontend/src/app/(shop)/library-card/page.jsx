"use client";

import { useEffect, useState } from "react";
import LibraryCardQR from "@/components/LibraryCardQR";

export default function LibraryCardPage() {
  const [reader, setReader] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setReader(u);
    } catch {}
  }, []);

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thẻ Thư Viện Của Tôi</h1>
      <div className="flex flex-col items-center">
        <p className="mb-2 font-medium">{reader?.hoTen || reader?.tenDangNhap || "Độc giả"}</p>
        <LibraryCardQR readerId={String(reader?.docGiaId || reader?.taiKhoanId || reader?.id || "0")} />
      </div>
    </section>
  );
}

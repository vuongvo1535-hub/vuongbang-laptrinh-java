"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSachs } from "@/services/shop/sachServices";
import { getDanhMucSachs } from "@/services/shop/danhMucSachServices";

export default function Page() {
  const [danhMucs, setDanhMucs] = useState([]);
  const [sachs, setSachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function taiDuLieu() {
      try {
        const [dsDanhMuc, dsSach] = await Promise.all([getDanhMucSachs(), getSachs()]);
        if (!ignore) {
          setDanhMucs(dsDanhMuc || []);
          setSachs(dsSach || []);
        }
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
        if (!ignore) setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    taiDuLieu();
    return () => {
      ignore = true;
    };
  }, []);

  const soSachTheoDanhMuc = useMemo(() => {
    const dem = {};
    sachs.forEach((s) => {
      dem[s.danhMucId] = (dem[s.danhMucId] || 0) + 1;
    });
    return dem;
  }, [sachs]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-nau-dam">Danh mục sách</h1>
        <p className="mt-2 text-nau-dam/70">Chọn một danh mục để xem các sách thuộc danh mục đó</p>
      </div>

      {loading ? (
        <p className="text-center text-nau-dam/50">Đang tải danh mục...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : danhMucs.length === 0 ? (
        <p className="text-center text-nau-dam/60">Chưa có danh mục.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {danhMucs.map((dm) => (
            <Link
              key={dm.id}
              href={`/products?danhMuc=${dm.id}`}
              className="bg-white rounded-xl border border-cam-vang/30 hover:border-cam-vang hover:shadow-md transition p-5"
            >
              <h2 className="text-lg font-bold text-nau-dam">{dm.tenDanhMuc}</h2>
              {dm.moTa && <p className="mt-1 text-sm text-nau-dam/70">{dm.moTa}</p>}
              <p className="mt-3 text-sm font-semibold text-cam-dam">
                {soSachTheoDanhMuc[dm.id] || 0} sách →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

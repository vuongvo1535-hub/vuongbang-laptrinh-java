"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import BookCard from "@/components/shop/book/BookCard";
import { getSachs } from "@/services/shop/sachServices";
import { getDanhMucSachs } from "@/services/shop/danhMucSachServices";

export default function Page() {
  const [sachs, setSachs] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function taiDuLieu() {
      try {
        const [dsSach, dsDanhMuc] = await Promise.all([
          getSachs(),
          getDanhMucSachs(),
        ]);
        if (!ignore) {
          setSachs(dsSach || []);
          setDanhMucs(dsDanhMuc || []);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang chủ:", err);
        if (!ignore) setError("Không thể kết nối máy chủ. Vui lòng thử lại sau.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    taiDuLieu();
    return () => {
      ignore = true;
    };
  }, []);

  // Sách mới: id lớn nhất (thêm gần đây nhất)
  const sachMoi = useMemo(
    () => [...sachs].sort((a, b) => b.id - a.id).slice(0, 4),
    [sachs]
  );

  // Đếm số sách theo danh mục
  const soSachTheoDanhMuc = useMemo(() => {
    const dem = {};
    sachs.forEach((s) => {
      dem[s.danhMucId] = (dem[s.danhMucId] || 0) + 1;
    });
    return dem;
  }, [sachs]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-vang-kem border border-cam-vang/40 px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-black text-nau-dam leading-tight">
          Tra cứu sách <span className="text-cam-dam">dễ dàng</span>
        </h1>
        <p className="mt-3 max-w-xl text-nau-dam/75">
          Tìm sách theo tên, xem thông tin chi tiết và tình trạng sách còn trên kệ.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-cam-vang hover:bg-cam-dam text-nau-dam font-semibold px-5 py-3 rounded-lg transition"
          >
            Xem tất cả sách <FiArrowRight />
          </Link>
          {!loading && !error && (
            <span className="text-sm text-nau-dam/70">
              {sachs.length} đầu sách · {danhMucs.length} danh mục
            </span>
          )}
        </div>
      </section>

      {loading && <p className="text-center text-nau-dam/50">Đang tải...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {/* Sách mới */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-nau-dam">Sách mới</h2>
              <Link href="/products" className="text-sm font-semibold text-cam-dam hover:underline">
                Xem tất cả →
              </Link>
            </div>

            {sachMoi.length === 0 ? (
              <p className="text-sm text-nau-dam/50">Chưa có sách.</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {sachMoi.map((sach) => (
                  <BookCard key={sach.id} sach={sach} />
                ))}
              </div>
            )}
          </section>

          {/* Danh mục */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-nau-dam">Danh mục sách</h2>
              <Link href="/categories" className="text-sm font-semibold text-cam-dam hover:underline">
                Xem tất cả →
              </Link>
            </div>

            {danhMucs.length === 0 ? (
              <p className="text-sm text-nau-dam/50">Chưa có danh mục.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {danhMucs.map((dm) => (
                  <Link
                    key={dm.id}
                    href={`/products?danhMuc=${dm.id}`}
                    className="bg-white rounded-xl border border-cam-vang/30 hover:border-cam-vang hover:shadow-md transition p-4"
                  >
                    <p className="font-semibold text-nau-dam">{dm.tenDanhMuc}</p>
                    <p className="mt-1 text-sm text-nau-dam/60">
                      {soSachTheoDanhMuc[dm.id] || 0} sách
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

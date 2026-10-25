"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import BookList from "./SachList";
import Pagination from "@/components/common/Pagination";
import { getSachs } from "@/services/shop/sachServices";
import { getDanhMucSachs } from "@/services/shop/danhMucSachServices";

const SO_SACH_MOI_TRANG = 12;

// Danh sách và tra cứu sách: ?search=... (tên sách) và ?danhMuc=... (id danh mục)
export default function BookCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const tuKhoa = params.get("search") || "";
  const danhMucId = params.get("danhMuc") || "";

  const [o, setO] = useState(tuKhoa);
  const [sachs, setSachs] = useState([]);
  const [danhMucs, setDanhMucs] = useState([]);
  const [trang, setTrang] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setO(tuKhoa);
  }, [tuKhoa]);

  // Danh mục chỉ cần tải một lần
  useEffect(() => {
    getDanhMucSachs()
      .then((ds) => setDanhMucs(ds || []))
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  // Tải sách mỗi khi từ khóa đổi
  useEffect(() => {
    let ignore = false;
    async function taiSach() {
      setLoading(true);
      setError("");
      try {
        const ds = await getSachs(tuKhoa);
        if (!ignore) {
          setSachs(ds || []);
          setTrang(1);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách sách:", err);
        if (!ignore) setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    taiSach();
    return () => {
      ignore = true;
    };
  }, [tuKhoa]);

  const sachLoc = useMemo(
    () => (danhMucId ? sachs.filter((s) => String(s.danhMucId) === danhMucId) : sachs),
    [sachs, danhMucId]
  );

  const soTrang = Math.max(1, Math.ceil(sachLoc.length / SO_SACH_MOI_TRANG));
  const sachTrangHienTai = sachLoc.slice(
    (trang - 1) * SO_SACH_MOI_TRANG,
    trang * SO_SACH_MOI_TRANG
  );

  function capNhatUrl(tuKhoaMoi, danhMucMoi) {
    const q = new URLSearchParams();
    if (tuKhoaMoi) q.set("search", tuKhoaMoi);
    if (danhMucMoi) q.set("danhMuc", danhMucMoi);
    const chuoi = q.toString();
    router.push(chuoi ? `/products?${chuoi}` : "/products");
  }

  function xuLyTimKiem(e) {
    e.preventDefault();
    capNhatUrl(o.trim(), danhMucId);
  }

  function chuyenTrang(trangMoi) {
    if (trangMoi < 1 || trangMoi > soTrang) return;
    setTrang(trangMoi);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const nutDanhMuc = (chon) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition ${
      chon
        ? "bg-cam-vang border-cam-vang text-nau-dam"
        : "bg-white border-cam-vang/40 text-nau-dam hover:bg-vang-kem"
    }`;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-nau-dam">Sách trong thư viện</h1>
        <p className="mt-2 text-nau-dam/70">Tìm sách theo tên hoặc lọc theo danh mục</p>
      </div>

      {/* Tìm kiếm */}
      <form
        onSubmit={xuLyTimKiem}
        className="max-w-xl mx-auto flex items-center bg-white border border-cam-vang/50 rounded-lg p-1 focus-within:border-cam-dam transition"
      >
        <FiSearch className="mx-2 text-nau-dam/50 shrink-0" />
        <input
          type="text"
          value={o}
          onChange={(e) => setO(e.target.value)}
          placeholder="Nhập tên sách..."
          className="flex-1 min-w-0 bg-transparent outline-none text-sm text-nau-dam placeholder:text-nau-dam/40"
        />
        <button
          type="submit"
          className="shrink-0 bg-cam-vang hover:bg-cam-dam text-nau-dam font-semibold text-sm px-4 py-2 rounded-md transition"
        >
          Tìm
        </button>
      </form>

      {/* Lọc danh mục */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => capNhatUrl(tuKhoa, "")}
          className={nutDanhMuc(!danhMucId)}
        >
          Tất cả
        </button>
        {danhMucs.map((dm) => (
          <button
            key={dm.id}
            type="button"
            onClick={() => capNhatUrl(tuKhoa, String(dm.id))}
            className={nutDanhMuc(danhMucId === String(dm.id))}
          >
            {dm.tenDanhMuc}
          </button>
        ))}
      </div>

      {/* Kết quả */}
      <div className="mt-8">
        {loading ? (
          <p className="text-center text-nau-dam/50">Đang tải sách...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : sachLoc.length === 0 ? (
          <p className="text-center text-nau-dam/60">
            Không tìm thấy sách phù hợp{tuKhoa ? ` với "${tuKhoa}"` : ""}.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-nau-dam/60">{sachLoc.length} sách</p>
            <BookList sachs={sachTrangHienTai} />
            {soTrang > 1 && (
              <Pagination currentPage={trang} pageCount={soTrang} onPageChange={chuyenTrang} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

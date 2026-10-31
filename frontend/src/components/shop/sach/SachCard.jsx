import Link from "next/link";
import BookCover from "./SachCover";
import { trangThaiSach } from "@/utils/trangThai";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";

export default function BookCard({ sach }) {
  const tenSach = sach.tenSach || sach.ten_sach || "Tác phẩm";
  const maSach = sach.maSach || sach.ma_sach;
  const anhBia = sach.anhBia || sach.anh_bia || sach.duong_dan_anh || (maSach ? `${maSach}.jpg` : null);
  const namXuatBan = sach.namXuatBan || sach.nam_xuat_ban;
  const ngonNgu = sach.ngonNgu || sach.ngon_ngu;
  const soTrang = sach.soTrang || sach.so_trang;
  const trangThaiVal = sach.trangThai || sach.trang_thai;
  const trangThai = trangThaiSach(trangThaiVal);

  const conSach = trangThaiVal !== "HET_HANG" && trangThaiVal !== "DA_MUON_HET";

  return (
    <Link
      href={`/sach/${sach.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative"
    >
      {/* Vùng Bìa Sách */}
      <div className="overflow-hidden bg-slate-50 flex items-center justify-center relative aspect-[3/4]">
        <BookCover
          anhBia={anhBia}
          ten={tenSach}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Mã sách định danh */}
        {maSach && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white shadow-xs">
            {maSach}
          </span>
        )}

        {/* Lớp phủ hover với nút xem nhanh */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          <span className="w-full py-2 rounded-xl bg-white/95 backdrop-blur-md text-emerald-800 text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
            <FiBookOpen size={14} />
            <span>Chi tiết & Đọc thử</span>
            <FiArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Nội Dung Thông Tin Sách */}
      <div className="flex flex-col flex-1 p-4">
        {/* Tiêu đề sách */}
        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition leading-snug">
          {tenSach}
        </h3>

        {/* Năm & Ngôn ngữ */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>{namXuatBan || "2024"}</span>
          <span>•</span>
          <span>{ngonNgu || "Tiếng Việt"}</span>
          {soTrang ? (
            <>
              <span>•</span>
              <span>{soTrang} trang</span>
            </>
          ) : null}
        </div>

        {/* Trạng thái kho sách */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${trangThai.mau}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${conSach ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
            <span>{trangThai.label}</span>
          </span>

          <span className="text-[11px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition">
            Mượn ngay →
          </span>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import BookCover from "./SachCover";
import { trangThaiSach } from "@/utils/trangThai";

export default function BookCard({ sach }) {
  const tenSach = sach.tenSach || sach.ten_sach || "Sách";
  const maSach = sach.maSach || sach.ma_sach;
  const anhBia = sach.anhBia || sach.anh_bia || sach.duong_dan_anh || (maSach ? `${maSach}.jpg` : null);
  const namXuatBan = sach.namXuatBan || sach.nam_xuat_ban;
  const ngonNgu = sach.ngonNgu || sach.ngon_ngu;
  const trangThaiVal = sach.trangThai || sach.trang_thai;
  const trangThai = trangThaiSach(trangThaiVal);

  return (
    <Link
      href={`/sach/${sach.id}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition overflow-hidden"
    >
      <div className="overflow-hidden bg-gray-50 flex items-center justify-center">
        <BookCover
          anhBia={anhBia}
          ten={tenSach}
          className="w-full h-52 group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-emerald-700 transition">
          {tenSach}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {[namXuatBan, ngonNgu].filter(Boolean).join(" · ") || "Thư viện"}
        </p>

        <span
          className={`mt-3 self-start text-xs font-medium px-2 py-1 rounded-full ${trangThai.mau}`}
        >
          {trangThai.label}
        </span>
      </div>
    </Link>
  );
}

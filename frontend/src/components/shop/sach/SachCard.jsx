import Link from "next/link";
import BookCover from "./SachCover";
import { trangThaiSach } from "@/utils/trangThai";

export default function BookCard({ sach }) {
  const trangThai = trangThaiSach(sach.trangThai);

  return (
    <Link
      href={`/sach/${sach.id}`}
      className="group flex flex-col bg-white rounded-xl border border-cam-vang/30 shadow-sm hover:shadow-md hover:border-cam-vang transition overflow-hidden"
    >
      <div className="overflow-hidden">
        <BookCover
          anhBia={sach.anhBia}
          ten={sach.tenSach}
          className="w-full h-48 group-hover:scale-105 transition"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-nau-dam line-clamp-2 min-h-[3rem]">
          {sach.tenSach}
        </h3>

        <p className="mt-1 text-xs text-nau-dam/60">
          {[sach.namXuatBan, sach.ngonNgu].filter(Boolean).join(" · ")}
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

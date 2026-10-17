import Link from "next/link";
import BookCover from "./BookCover";
import { dinhDangTien } from "@/utils/format";
import { trangThaiSach } from "@/utils/trangThai";

// sach: dữ liệu từ GET /api/sach/{id}
// chiTiet: dữ liệu từ GET /api/sach/{id}/chiTiet (có thể null nếu không tải được)
export default function BookDetail({ sach, chiTiet }) {
  const trangThai = trangThaiSach(sach.trangThai);
  const tacGia = chiTiet?.tacGia?.map((tg) => tg.tenTacGia).join(", ");

  const thongTin = [
    ["Mã sách", sach.maSach],
    ["ISBN", sach.isbn],
    ["Nhà xuất bản", chiTiet?.tenNhaXuatBan],
    ["Năm xuất bản", sach.namXuatBan],
    ["Lần tái bản", sach.lanTaiBan],
    ["Ngôn ngữ", sach.ngonNgu],
    ["Số trang", sach.soTrang],
    ["Giá bìa", sach.giaTien != null ? dinhDangTien(sach.giaTien) : null],
  ].filter(([, giaTri]) => giaTri !== null && giaTri !== undefined && giaTri !== "");

  return (
    <div>
      <Link href="/products" className="text-sm text-nau-dam/60 hover:text-cam-dam transition">
        ← Quay lại danh sách sách
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        {/* Ảnh bìa */}
        <div className="rounded-xl overflow-hidden bg-white border border-cam-vang/30 shadow-sm self-start">
          <BookCover anhBia={sach.anhBia} ten={sach.tenSach} className="w-full h-96" />
        </div>

        {/* Thông tin */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {chiTiet?.tenDanhMuc && (
              <span className="text-xs font-semibold text-nau-dam bg-vang-kem px-3 py-1 rounded-full">
                {chiTiet.tenDanhMuc}
              </span>
            )}
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${trangThai.mau}`}>
              {trangThai.label}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-nau-dam">{sach.tenSach}</h1>

          {tacGia && <p className="mt-2 text-nau-dam/70">Tác giả: {tacGia}</p>}

          {/* Tình trạng trên kệ */}
          {chiTiet && (
            <div className="mt-5 rounded-lg bg-vang-kem border border-cam-vang/40 px-4 py-3">
              {chiTiet.tongSoBan === 0 ? (
                <p className="text-sm text-nau-dam/70">Chưa có bản sao nào trong thư viện.</p>
              ) : (
                <p className="text-sm text-nau-dam">
                  Còn <span className="font-bold text-cam-dam">{chiTiet.soBanSanSang}</span>
                  {" / "}
                  {chiTiet.tongSoBan} bản sẵn sàng trên kệ
                </p>
              )}
            </div>
          )}

          {/* Bảng thông tin */}
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {thongTin.map(([nhan, giaTri]) => (
              <div key={nhan} className="flex gap-2 border-b border-cam-vang/20 pb-2">
                <dt className="w-32 shrink-0 text-nau-dam/60">{nhan}</dt>
                <dd className="font-medium text-nau-dam break-words">{giaTri}</dd>
              </div>
            ))}
          </dl>

          {/* Mô tả */}
          {sach.moTa && (
            <div className="mt-6">
              <h2 className="font-semibold text-nau-dam mb-2">Giới thiệu</h2>
              <p className="text-nau-dam/80 leading-relaxed">{sach.moTa}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

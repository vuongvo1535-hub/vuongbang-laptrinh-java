"use client";

import { usePathname } from "next/navigation";
import { FiBell, FiMenu } from "react-icons/fi";

const tieuDe = [
    ["/admin/sanpham", "Quản lý Sách"],
    ["/admin/danhmuc", "Danh mục sách"],
    ["/admin/tacgia", "Quản lý Tác giả"],
    ["/admin/donhang", "Phiếu mượn - Trả sách"],
    ["/admin/nguoidung", "Độc giả thư viện"],
    ["/admin/tienphat", "Quản lý Tiền phạt"],
    ["/admin", "Tổng quan hệ thống"],
];

export default function AdminHeader() {
    const pathname = usePathname();

    const muc = tieuDe.find(([link]) => pathname.startsWith(link));
    const tenTrang = muc ? muc[1] : "Quản trị thư viện";

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-emerald-800 bg-emerald-900 pl-16 pr-4 text-white sm:pr-6 md:pl-64">
            <div className="flex items-center gap-3 pl-4">
                <FiMenu size={22} className="text-emerald-100" aria-hidden="true" />
                <h1 className="text-lg font-semibold">{tenTrang}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg p-2 text-emerald-100 hover:bg-emerald-800 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-300"
                    aria-label="Thông báo"
                >
                    <FiBell size={20} />
                </button>

                <div className="flex items-center gap-3 border-l border-emerald-700 pl-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold">
                        TT
                    </div>

                    <div className="hidden leading-tight sm:block">
                        <p className="text-sm font-medium">Thủ thư</p>
                        <p className="text-xs text-emerald-200">QuanLyThuVien</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

"use client";

import { usePathname } from "next/navigation";
import { FiBell, FiMenu } from "react-icons/fi";

// Tiêu đề trang theo đường dẫn (mục dài hơn đặt trước)
const tieuDe = [
    ["/admin/sanpham", "Sản phẩm"],
    ["/admin/danhmuc", "Danh mục"],
    ["/admin/thuonghieu", "Thương hiệu"],
    ["/admin/donhang", "Đơn hàng"],
    ["/admin/giohang", "Giỏ hàng"],
    ["/admin/nguoidung", "Người dùng"],
    ["/admin/menu", "Menu website"],
    ["/admin", "Tổng quan"],
];

export default function AdminHeader() {
    const pathname = usePathname();

    const muc = tieuDe.find(([link]) => pathname.startsWith(link));
    const tenTrang = muc ? muc[1] : "Quản trị";

    return (
        // Cố định ở trên cùng; sidebar (z-40) nằm đè lên phần bên trái
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-orange-800 bg-orange-900 pl-16 pr-4 text-white sm:pr-6 md:pl-64">
            <div className="flex items-center gap-3 pl-4">
                {/* Biểu tượng 3 gạch (chỉ để hiển thị) */}
                <FiMenu size={22} className="text-orange-100" aria-hidden="true" />

                <h1 className="text-lg font-semibold">{tenTrang}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg p-2 text-orange-100 hover:bg-orange-800 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-300"
                    aria-label="Thông báo"
                >
                    <FiBell size={20} />
                </button>

                <div className="flex items-center gap-3 border-l border-orange-700 pl-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-700 text-sm font-semibold">
                        QT
                    </div>

                    <div className="hidden leading-tight sm:block">
                        <p className="text-sm font-medium">Quản trị viên</p>
                        <p className="text-xs text-orange-200">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
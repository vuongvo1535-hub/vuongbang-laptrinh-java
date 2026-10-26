"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiBell, FiMenu, FiLogOut } from "react-icons/fi";

const tieuDe = [
    ["/admin/quetma", "Web Quét mã & Camera"],
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
    const router = useRouter();
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("admin_user");
            if (raw) {
                setAdminInfo(JSON.parse(raw));
            }
        } catch {
            setAdminInfo(null);
        }
    }, []);

    const dangXuat = () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
            localStorage.removeItem("admin_user");
            router.push("/admin/login");
        }
    };

    const muc = tieuDe.find(([link]) => pathname.startsWith(link));
    const tenTrang = muc ? muc[1] : "Quản trị thư viện";

    const tenHienThi = adminInfo?.hoTen || adminInfo?.tenDangNhap || "Thủ thư";
    const vaiTroHienThi = adminInfo?.vaiTro === "QUAN_TRI" ? "Quản trị viên" : "Thủ thư";

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-emerald-800 bg-emerald-900 pl-16 pr-4 text-white sm:pr-6 md:pl-64">
            <div className="flex items-center gap-3 pl-4">
                <FiMenu size={22} className="text-emerald-100" aria-hidden="true" />
                <h1 className="text-lg font-semibold">{tenTrang}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg p-2 text-emerald-100 hover:bg-emerald-800 hover:text-white"
                    aria-label="Thông báo"
                >
                    <FiBell size={20} />
                </button>

                <div className="flex items-center gap-3 border-l border-emerald-700 pl-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold uppercase">
                        {tenHienThi.substring(0, 2)}
                    </div>

                    <div className="hidden leading-tight sm:block">
                        <p className="text-sm font-medium">{tenHienThi}</p>
                        <p className="text-xs text-emerald-200">{vaiTroHienThi}</p>
                    </div>

                    <button
                        onClick={dangXuat}
                        title="Đăng xuất quản trị"
                        className="ml-2 flex items-center gap-1 text-xs bg-emerald-800 hover:bg-red-700 px-2.5 py-1.5 rounded-lg text-emerald-100 hover:text-white transition"
                    >
                        <FiLogOut size={14} />
                        <span className="hidden md:inline">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

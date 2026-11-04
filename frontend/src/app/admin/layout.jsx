"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminFooter from "@/components/admin/AdminFooter";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";

// Các trang chỉ dành riêng cho Quản trị viên (QUAN_TRI), Thủ thư không được phép truy cập
const TRANG_CHI_QUAN_TRI = [
    "/admin/danhmuc",
    "/admin/tacgia",
    "/admin/thuonghieu",
    "/admin/baiviet",
    "/admin/menu",
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [daKiemTra, setDaKiemTra] = useState(false);
    const [vaiTro, setVaiTro] = useState(null);

    const laTrangLogin = pathname === "/admin/login";

    useEffect(() => {
        if (laTrangLogin) {
            setDaKiemTra(true);
            return;
        }

        // Kiểm tra xem đã đăng nhập admin chưa
        const raw = localStorage.getItem("admin_user");
        if (!raw) {
            router.push("/admin/login");
            return;
        }

        try {
            const user = JSON.parse(raw);
            setVaiTro(user?.vaiTro || null);
        } catch {
            setVaiTro(null);
        }

        setDaKiemTra(true);
    }, [pathname, laTrangLogin, router]);

    // Nếu là trang đăng nhập admin, chỉ hiển thị trang đăng nhập không kèm header/sidebar
    if (laTrangLogin) {
        return <>{children}</>;
    }

    if (!daKiemTra) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-sm">
                Đang xác thực quyền truy cập hệ thống...
            </div>
        );
    }

    // Kiểm tra quyền: Thủ thư cố tình truy cập vào trang cấu hình quản trị viên
    const biChanQuyen =
        vaiTro === "THU_THU" &&
        TRANG_CHI_QUAN_TRI.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <AdminHeader />

            <div className="flex flex-1 min-h-[calc(100vh-120px)]">
                <AdminSidebar />

                <main className="flex-1 p-6 overflow-y-auto">
                    {biChanQuyen ? (
                        <div className="max-w-2xl mx-auto my-12 rounded-2xl bg-white p-8 text-center shadow-lg border border-amber-200">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
                                <FiAlertTriangle size={34} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Giới Hạn Quyền Truy Cập
                            </h2>
                            <div className="mt-3 text-sm text-gray-600 space-y-2 leading-relaxed">
                                <p>
                                    Bạn đang đăng nhập với vai trò{" "}
                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        Thủ thư (THU_THU)
                                    </span>
                                    .
                                </p>
                                <p>
                                    Trang quản lý cấu hình này chỉ dành riêng cho{" "}
                                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                        Quản trị viên (QUAN_TRI)
                                    </span>
                                    .
                                </p>
                                <p className="text-xs text-gray-400">
                                    Thủ thư được phân quyền thực hiện các nghiệp vụ: Quét mã vạch mượn trả, duyệt phiếu mượn, tra cứu kho sách, xử lý đặt trước và thu tiền phạt.
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/30"
                                >
                                    <FiHome size={16} />
                                    <span>Về Bảng Điều Khiển</span>
                                </Link>
                                <Link
                                    href="/admin/quetma"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                                >
                                    <span>📷</span>
                                    <span>Mở Quét Mã Barcode</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>

            <AdminFooter />
        </div>
    );
}

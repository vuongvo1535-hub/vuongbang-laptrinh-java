"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [daKiemTra, setDaKiemTra] = useState(false);

    const laTrangLogin = pathname === "/admin/login";

    useEffect(() => {
        if (laTrangLogin) {
            setDaKiemTra(true);
            return;
        }

        // Kiểm tra xem đã đăng nhập admin chưa
        const adminUser = localStorage.getItem("admin_user");
        if (!adminUser) {
            router.push("/admin/login");
        } else {
            setDaKiemTra(true);
        }
    }, [pathname, laTrangLogin, router]);

    // Nếu là trang đăng nhập admin, chỉ hiển thị trang đăng nhập không kèm header/sidebar
    if (laTrangLogin) {
        return <>{children}</>;
    }

    if (!daKiemTra) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-sm">
                Đang xác thực quyền quản trị...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <AdminHeader />

            <div className="flex flex-1 min-h-[calc(100vh-120px)]">
                <AdminSidebar />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            <AdminFooter />
        </div>
    );
}

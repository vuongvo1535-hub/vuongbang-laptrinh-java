"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBook,
    FiGrid,
    FiUserCheck,
    FiFileText,
    FiUsers,
    FiDollarSign,
    FiCamera,
    FiExternalLink,
} from "react-icons/fi";

// Menu Quản lý Thư viện
const menu = [
    { name: "Tổng quan", link: "/admin", icon: FiHome },
    { name: "Quét mã & Camera", link: "/admin/quetma", icon: FiCamera },
    { name: "Quản lý Sách", link: "/admin/sanpham", icon: FiBook },
    { name: "Danh mục sách", link: "/admin/danhmuc", icon: FiGrid },
    { name: "Tác giả", link: "/admin/tacgia", icon: FiUserCheck },
    { name: "Phiếu mượn - Trả", link: "/admin/donhang", icon: FiFileText },
    { name: "Độc giả", link: "/admin/nguoidung", icon: FiUsers },
    { name: "Tiền phạt", link: "/admin/tienphat", icon: FiDollarSign },
];

function dangMo(pathname, link) {
    if (link === "/admin") return pathname === "/admin";
    return pathname === link || pathname.startsWith(`${link}/`);
}

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="relative z-40 -mt-16 w-16 shrink-0 bg-emerald-900 text-white md:w-64"
            aria-label="Menu quản trị"
        >
            <div className="sticky top-0 flex h-screen max-h-full flex-col">
                <Link
                    href="/admin"
                    title="Thư Viện Số – Trang quản trị"
                    className="flex h-16 shrink-0 items-center justify-center gap-3 border-b border-emerald-800 px-3 focus-visible:outline-2 focus-visible:outline-emerald-300 md:justify-start md:px-5"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-xl font-bold">
                        📚
                    </span>

                    <span className="hidden leading-tight md:block">
                        <span className="block text-lg font-bold">Thư Viện Số</span>
                        <span className="block text-xs text-emerald-200">
                            Trang quản trị
                        </span>
                    </span>
                </Link>

                <nav className="flex-1 overflow-y-auto px-2 py-4 md:px-3">
                    <ul className="space-y-1">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const active = dangMo(pathname, item.link);

                            return (
                                <li key={item.link}>
                                    <Link
                                        href={item.link}
                                        title={item.name}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-emerald-300 justify-center md:justify-start ${
                                            active
                                                ? "bg-white font-semibold text-emerald-900"
                                                : "text-emerald-100 hover:bg-emerald-800"
                                        }`}
                                    >
                                        <Icon size={19} className="shrink-0" />
                                        <span className="hidden md:inline">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="shrink-0 p-3">
                    <div className="hidden rounded-xl bg-emerald-800 p-4 md:block">
                        <p className="font-semibold">Cổng Độc Giả</p>
                        <p className="mt-1 text-xs text-emerald-200">
                            Xem website như độc giả đang thấy.
                        </p>

                        <Link
                            href="/"
                            target="_blank"
                            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-300"
                        >
                            <FiExternalLink size={16} />
                            Xem thư viện
                        </Link>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        title="Xem thư viện"
                        className="flex items-center justify-center rounded-lg px-3 py-3 text-emerald-100 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-300 md:hidden"
                    >
                        <FiExternalLink size={19} />
                    </Link>
                </div>
            </div>
        </aside>
    );
}

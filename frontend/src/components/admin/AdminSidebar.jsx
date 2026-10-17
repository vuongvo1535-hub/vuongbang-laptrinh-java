"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBox,
    FiGrid,
    FiTag,
    FiClipboard,
    FiShoppingCart,
    FiUsers,
    FiList,
    FiExternalLink,
} from "react-icons/fi";

// Menu chung, không chia nhóm
const menu = [
    { name: "Tổng quan", link: "/admin", icon: FiHome },
    { name: "Sản phẩm", link: "/admin/sanpham", icon: FiBox },
    { name: "Danh mục", link: "/admin/danhmuc", icon: FiGrid },
    { name: "Thương hiệu", link: "/admin/thuonghieu", icon: FiTag },
    { name: "Đơn hàng", link: "/admin/donhang", icon: FiClipboard },
    { name: "Bài viết", link: "/admin/baiviet", icon: FiShoppingCart },
    { name: "Người dùng", link: "/admin/nguoidung", icon: FiUsers },
    { name: "Menu website", link: "/admin/menu", icon: FiList },
];

// /admin chỉ khớp chính xác, các mục khác khớp theo đoạn đường dẫn
function dangMo(pathname, link) {
    if (link === "/admin") return pathname === "/admin";
    return pathname === link || pathname.startsWith(`${link}/`);
}

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        // -mt-16: kéo sidebar lên phủ đầu header để logo nằm trên cùng cột menu.
        // Cột kéo dài hết khu nội dung, dừng trước footer.
        <aside
            className="relative z-40 -mt-16 w-16 shrink-0 bg-orange-900 text-white md:w-64"
            aria-label="Menu quản trị"
        >
            {/* Dính trên cùng khi cuộn, không cao hơn cột */}
            <div className="sticky top-0 flex h-screen max-h-full flex-col">
                {/* Logo + tên (cao 4rem, thẳng hàng với header) */}
                <Link
                    href="/admin"
                    title="Mây Cake – Trang quản trị"
                    className="flex h-16 shrink-0 items-center justify-center gap-3 border-b border-orange-800 px-3 focus-visible:outline-2 focus-visible:outline-orange-300 md:justify-start md:px-5"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-700 text-xl font-bold">
                        M
                    </span>

                    <span className="hidden leading-tight md:block">
                        <span className="block text-lg font-bold">Mây Cake</span>
                        <span className="block text-xs text-orange-200">
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
                                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-orange-300 justify-center md:justify-start ${
                                            active
                                                ? "bg-white font-semibold text-orange-900"
                                                : "text-orange-100 hover:bg-orange-800"
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

                {/* Thẻ ở cuối sidebar: dẫn sang cửa hàng (từ màn hình md) */}
                <div className="shrink-0 p-3">
                    <div
                        className="hidden rounded-xl bg-orange-800 p-4 md:block"
                    >
                        <p className="font-semibold">Cửa hàng Mây Cake</p>
                        <p className="mt-1 text-xs text-orange-200">
                            Xem website như khách hàng đang thấy.
                        </p>

                        <Link
                            href="/"
                            target="_blank"
                            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-orange-900 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-300"
                        >
                            <FiExternalLink size={16} />
                            Xem cửa hàng
                        </Link>
                    </div>

                    {/* Dạng icon trên màn hình nhỏ */}
                    <Link
                        href="/"
                        target="_blank"
                        title="Xem cửa hàng"
                        className="flex items-center justify-center rounded-lg px-3 py-3 text-orange-100 hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-orange-300 md:hidden"
                    >
                        <FiExternalLink size={19} />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
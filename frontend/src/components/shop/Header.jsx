"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiBookOpen, FiUser, FiLogOut, FiShoppingCart, FiSearch, FiDollarSign } from "react-icons/fi";
import useGioMuon from "@/hooks/useGioMuon";

export default function Header() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [moMenu, setMoMenu] = useState(false);
    const [user, setUser] = useState(null);
    const { soLuong } = useGioMuon();

    const taiThongTinUser = () => {
        try {
            const raw = localStorage.getItem("user");
            setUser(raw ? JSON.parse(raw) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        taiThongTinUser();
        window.addEventListener("user-auth-changed", taiThongTinUser);
        window.addEventListener("storage", taiThongTinUser);
        return () => {
            window.removeEventListener("user-auth-changed", taiThongTinUser);
            window.removeEventListener("storage", taiThongTinUser);
        };
    }, []);

    const dangXuat = () => {
        if (confirm("Bạn có muốn đăng xuất?")) {
            localStorage.removeItem("user");
            setUser(null);
            router.push("/");
        }
    };

    const timKiem = (e) => {
        e.preventDefault();
        router.push(q.trim() ? `/sach?q=${encodeURIComponent(q.trim())}` : "/sach");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-black text-emerald-700 tracking-wide whitespace-nowrap">
                    <span className="text-2xl">📚</span>
                    <span>Thư Viện Sách</span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-gray-700">
                    <Link href="/" className="hover:text-emerald-700 transition">Trang chủ</Link>
                    <Link href="/sach" className="hover:text-emerald-700 transition">Tra cứu sách</Link>
                    <Link href="/danhmuc" className="hover:text-emerald-700 transition">Danh mục</Link>
                    <Link href="/thethuvien" className="hover:text-emerald-700 transition">Thẻ thư viện</Link>
                    <Link href="/phieumuon" className="flex items-center gap-1 hover:text-emerald-700 transition">
                        <FiDollarSign className="text-emerald-600" />
                        <span>Phiếu mượn & Phạt</span>
                    </Link>
                </nav>

                {/* Ô tìm kiếm */}
                <form onSubmit={timKiem} className="hidden md:flex flex-1 max-w-xs relative">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm tên sách, tác giả..."
                        className="w-full border border-gray-300 rounded-lg pl-3 pr-9 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-emerald-600">
                        <FiSearch size={16} />
                    </button>
                </form>

                {/* Giỏ mượn & Auth */}
                <div className="flex items-center gap-3">
                    {/* Nút Giỏ mượn */}
                    <Link
                        href="/giomuon"
                        className="relative flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                    >
                        <FiShoppingCart size={18} />
                        <span className="hidden sm:inline">Giỏ mượn</span>
                        {soLuong > 0 && (
                            <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                                {soLuong}
                            </span>
                        )}
                    </Link>

                    {/* Khu vực Đăng nhập / Độc giả */}
                    {user ? (
                        <div className="flex items-center gap-2 border-l pl-3 border-gray-200">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                                    {(user.hoTen || user.tenDangNhap || "DG").substring(0, 2)}
                                </div>
                                <span className="hidden xl:inline max-w-[120px] truncate font-semibold text-emerald-900">
                                    {user.hoTen || user.tenDangNhap}
                                </span>
                            </div>
                            <button
                                onClick={dangXuat}
                                title="Đăng xuất"
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <FiLogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 border-l pl-3 border-gray-200 text-sm">
                            <Link
                                href="/login"
                                className="px-3 py-1.5 font-medium text-gray-700 hover:text-emerald-700 transition"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition text-xs shadow-sm"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    {/* Nút vào admin */}
                    <Link
                        href="/admin"
                        title="Vào bảng Quản trị thư viện"
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg hidden sm:inline-block font-medium"
                    >
                        Quản trị
                    </Link>

                    {/* Nút mở menu mobile */}
                    <button
                        onClick={() => setMoMenu(!moMenu)}
                        className="lg:hidden text-2xl text-gray-700 p-1"
                        aria-label="Mở menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {moMenu && (
                <div className="lg:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-3 bg-white text-sm">
                    <Link href="/" onClick={() => setMoMenu(false)} className="font-semibold text-gray-700">
                        Trang chủ
                    </Link>
                    <Link href="/sach" onClick={() => setMoMenu(false)} className="font-semibold text-gray-700">
                        Tra cứu sách
                    </Link>
                    <Link href="/danhmuc" onClick={() => setMoMenu(false)} className="font-semibold text-gray-700">
                        Danh mục
                    </Link>
                    <Link href="/thethuvien" onClick={() => setMoMenu(false)} className="font-semibold text-gray-700">
                        Thẻ thư viện điện tử
                    </Link>
                    <Link href="/phieumuon" onClick={() => setMoMenu(false)} className="font-semibold text-emerald-700">
                        Phiếu mượn & Quét QR nộp phạt
                    </Link>
                    <Link href="/giomuon" onClick={() => setMoMenu(false)} className="font-semibold text-emerald-700">
                        Giỏ mượn sách ({soLuong})
                    </Link>
                    <Link href="/admin" onClick={() => setMoMenu(false)} className="font-semibold text-gray-500">
                        Trang Quản trị Admin
                    </Link>
                </div>
            )}
        </header>
    );
}

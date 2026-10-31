"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
    FiBookOpen, FiUser, FiLogOut, FiShoppingCart, 
    FiSearch, FiDollarSign, FiCamera, FiCreditCard, 
    FiShield, FiMenu, FiX, FiLayers, FiCompass, FiHeart 
} from "react-icons/fi";
import useGioMuon from "@/hooks/useGioMuon";
import BarcodeScannerModal from "./BarcodeScannerModal";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [q, setQ] = useState("");
    const [moMenu, setMoMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [moQuetMa, setMoQuetMa] = useState(false);
    const [maQuetBanDau, setMaQuetBanDau] = useState("");
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
        if (confirm("Bạn có muốn đăng xuất khỏi tài khoản độc giả?")) {
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("user-auth-changed"));
            setUser(null);
            router.push("/");
        }
    };

    const timKiem = (e) => {
        e.preventDefault();
        const str = q.trim();
        if (!str) return;

        // Nếu người dùng nhập hoặc quét mã thẻ / mã sách
        if (str.toUpperCase().startsWith("THE-") || str.toUpperCase().startsWith("THE") || str.toUpperCase().startsWith("DG") || str.toUpperCase().startsWith("BS-")) {
            setMaQuetBanDau(str);
            setMoQuetMa(true);
            return;
        }

        router.push(`/sach?q=${encodeURIComponent(str)}`);
    };

    const navItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Tra cứu sách", href: "/sach" },
        { label: "Danh mục", href: "/danhmuc" },
        { label: "Tủ sách", href: "/tusach", icon: <FiHeart className="text-rose-500" /> },
        { label: "Thẻ thư viện QR", href: "/thethuvien", icon: <FiCreditCard className="text-emerald-500" /> },
        { label: "Phiếu mượn & Phạt", href: "/phieumuon", icon: <FiDollarSign className="text-amber-500" /> },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
            <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3 lg:gap-6">
                
                {/* Logo Thương Hiệu Thư Viện */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition duration-200">
                        <FiBookOpen size={20} className="stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-slate-800 leading-none group-hover:text-emerald-600 transition">
                            THƯ VIỆN SỐ
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            Digital Library
                        </span>
                    </div>
                </Link>

                {/* Thanh Điều Hướng Menu Chính (Desktop) */}
                <nav className="hidden xl:flex items-center gap-1 text-[13px] font-semibold text-slate-600">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition duration-150 ${
                                    active
                                        ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs"
                                        : "hover:text-emerald-700 hover:bg-slate-100/70"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Ô Tìm Kiếm Nhanh & Nút Quét QR */}
                <form onSubmit={timKiem} className="hidden md:flex flex-1 max-w-xs relative items-center">
                    <div className="relative w-full">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm sách, tác giả, mã thẻ..."
                            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-20 py-2 text-xs focus:outline-none focus:ring-3 focus:ring-emerald-500/15 transition-all text-slate-800 placeholder-slate-400"
                        />
                        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMaQuetBanDau(q.trim());
                                    setMoQuetMa(true);
                                }}
                                title="Quét Barcode / QR bằng Camera"
                                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-white transition"
                            >
                                <FiCamera size={15} />
                            </button>
                            <button
                                type="submit"
                                title="Tìm kiếm"
                                className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs"
                            >
                                Tìm
                            </button>
                        </div>
                    </div>
                </form>

                {/* Các Nút Hành Động Bên Phải */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Trung tâm Thông báo Quả chuông */}
                    <NotificationDropdown user={user} />

                    {/* Nút Giỏ Mượn */}
                    <Link
                        href="/giomuon"
                        className="relative flex items-center gap-2 bg-slate-100/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold transition border border-transparent hover:border-emerald-200"
                        title="Xem giỏ sách đang chọn mượn"
                    >
                        <FiShoppingCart size={17} className="text-emerald-600" />
                        <span className="hidden sm:inline">Giỏ mượn</span>
                        {soLuong > 0 ? (
                            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                                {soLuong}
                            </span>
                        ) : null}
                    </Link>

                    {/* Tài Khoản Độc Giả */}
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                                    {(user.hoTen || user.tenDangNhap || "DG").substring(0, 2)}
                                </div>
                                <div className="hidden lg:flex flex-col text-left">
                                    <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate leading-tight">
                                        {user.hoTen || user.tenDangNhap}
                                    </span>
                                    <span className="text-[10px] text-emerald-600 font-medium">
                                        Độc giả
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={dangXuat}
                                title="Đăng xuất tài khoản"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                                <FiLogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs">
                            <Link
                                href="/login"
                                className="px-3 py-2 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm shadow-emerald-600/20"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    {/* Lối Tắt Vào Quản Trị Thư Viện */}
                    <Link
                        href="/admin"
                        title="Vào Trang Quản Trị Hệ Thống"
                        className="hidden sm:flex items-center gap-1 text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-2 rounded-xl transition shadow-xs"
                    >
                        <FiShield size={13} className="text-emerald-400" />
                        <span>Quản trị</span>
                    </Link>

                    {/* Nút Hamburger Mở Menu Mobile */}
                    <button
                        onClick={() => setMoMenu(!moMenu)}
                        className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                        aria-label="Mở menu"
                    >
                        {moMenu ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Menu Trượt Trên Thiết Bị Di Động */}
            {moMenu && (
                <div className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2 text-sm shadow-lg animate-fadeIn">
                    <form onSubmit={timKiem} className="relative mb-3">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm sách hoặc mã thẻ..."
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </form>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMoMenu(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-slate-700 transition"
                        >
                            {item.icon || <FiCompass className="text-slate-400" />}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setMoMenu(false);
                            setMoQuetMa(true);
                        }}
                        className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                    >
                        <FiCamera size={16} />
                        <span>Quét Barcode / QR Thư viện bằng Camera</span>
                    </button>
                    <Link
                        href="/admin"
                        onClick={() => setMoMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 transition"
                    >
                        <FiShield size={16} className="text-emerald-600" />
                        <span>Trang Quản Trị Hệ Thống Admin</span>
                    </Link>
                </div>
            )}

            {/* Modal Quét Mã Vạch & QR Thư Viện */}
            <BarcodeScannerModal
                mo={moQuetMa}
                dong={() => {
                    setMoQuetMa(false);
                    setMaQuetBanDau("");
                }}
                maBanDau={maQuetBanDau}
            />
        </header>
    );
}

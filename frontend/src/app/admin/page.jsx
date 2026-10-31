"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiBook,
    FiGrid,
    FiFileText,
    FiUsers,
    FiDollarSign,
    FiCheckCircle,
    FiTrendingUp,
    FiAward,
    FiBarChart2,
} from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function AdminPage() {
    const [thongKe, setThongKe] = useState({
        tongSach: 0,
        tongDanhMuc: 0,
        tongBanSao: 0,
        banSaoSanSang: 0,
        banSaoDangMuon: 0,
        tongDocGia: 0,
        tongPhieuMuon: 0,
        phieuDangMuon: 0,
        phieuDaTra: 0,
        soKhoanPhatChuaThu: 0,
        tongTienPhatChuaThu: 0,
    });
    const [topSach, setTopSach] = useState([]);
    const [xuHuong, setXuHuong] = useState([]);
    const [theoDanhMuc, setTheoDanhMuc] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    useEffect(() => {
        async function taiDuLieu() {
            setDangTai(true);
            try {
                const [resTongQuan, resTop, resXuHuong, resDm] = await Promise.all([
                    fetch(`${API_CONFIG.BASE_URL}/thongKe/tongQuan`),
                    fetch(`${API_CONFIG.BASE_URL}/thongKe/topSach`),
                    fetch(`${API_CONFIG.BASE_URL}/thongKe/xuHuongMuon`),
                    fetch(`${API_CONFIG.BASE_URL}/thongKe/theoDanhMuc`),
                ]);

                if (resTongQuan.ok) setThongKe(await resTongQuan.json());
                if (resTop.ok) setTopSach(await resTop.json());
                if (resXuHuong.ok) setXuHuong(await resXuHuong.json());
                if (resDm.ok) setTheoDanhMuc(await resDm.json());
            } catch (err) {
                console.error("Lỗi tải thống kê:", err);
            } finally {
                setDangTai(false);
            }
        }
        taiDuLieu();
    }, []);

    const dinhDangTien = (tien) => Number(tien || 0).toLocaleString("vi-VN") + " ₫";

    const theThongKe = [
        {
            name: "Tổng đầu sách",
            value: dangTai ? "..." : thongKe.tongSach,
            link: "/admin/sanpham",
            icon: FiBook,
            color: "bg-emerald-100 text-emerald-800",
        },
        {
            name: "Thể loại sách",
            value: dangTai ? "..." : thongKe.tongDanhMuc,
            link: "/admin/danhmuc",
            icon: FiGrid,
            color: "bg-blue-100 text-blue-800",
        },
        {
            name: "Phiếu đang mượn",
            value: dangTai ? "..." : `${thongKe.phieuDangMuon} / ${thongKe.tongPhieuMuon}`,
            link: "/admin/donhang",
            icon: FiFileText,
            color: "bg-amber-100 text-amber-800",
        },
        {
            name: "Độc giả thư viện",
            value: dangTai ? "..." : thongKe.tongDocGia,
            link: "/admin/nguoidung",
            icon: FiUsers,
            color: "bg-purple-100 text-purple-800",
        },
    ];

    // Tính max lượt mượn để căn chỉnh biểu đồ cột
    const maxLuotMuon = Math.max(...xuHuong.map((x) => x.soLuong || 0), 5);
    const maxTopLuot = Math.max(...topSach.map((s) => s.soLuotMuon || 0), 1);

    return (
        <div className="space-y-7 pb-10">
            {/* Tiêu đề & Shortcut */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span>Chào mừng trở lại, Quản trị viên</span> 👋
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Bảng điều khiển và số liệu thống kê thư viện trực quan thời gian thực.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/quetma"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <span>📷</span>
                        <span>Quét Mã Vạch</span>
                    </Link>
                    <Link
                        href="/admin/donhang"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                    >
                        <span>📋</span>
                        <span>Quản lý Phiếu mượn</span>
                    </Link>
                </div>
            </div>

            {/* 4 Thẻ thống kê */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {theThongKe.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.link}
                            href={item.link}
                            className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {item.name}
                                    </p>
                                    <p className="mt-2 text-3xl font-black text-gray-800">
                                        {item.value}
                                    </p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <p className="mt-4 text-xs font-semibold text-emerald-700">
                                Xem chi tiết →
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* ============================================================== */}
            {/* PHẦN BIỂU ĐỒ: XU HƯỚNG MƯỢN SÁCH & TOP SÁCH MƯỢN NHIỀU NHẤT */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* BIỂU ĐỒ CỘT: XU HƯỚNG MƯỢN SÁCH (6 CỘT) */}
                <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <FiTrendingUp className="text-blue-600" />
                                    <span>Xu hướng mượn sách qua các tháng</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">Số lượt mượn sách theo 6 tháng gần nhất</p>
                            </div>
                            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                                Cập nhật tự động
                            </span>
                        </div>

                        {/* VÙNG VẼ BIỂU ĐỒ CỘT (CSS BAR CHART HIỆN ĐẠI) */}
                        <div className="h-56 flex items-end justify-between gap-3 pt-8 pb-3 px-2 border-b border-gray-100">
                            {xuHuong.map((col, idx) => {
                                const heightPercent = Math.max(12, Math.round(((col.soLuong || 0) / maxLuotMuon) * 100));
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                        <div className="text-[11px] font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-blue-50 px-1.5 py-0.5 rounded shadow-sm">
                                            {col.soLuong || 0} lượt
                                        </div>
                                        <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl overflow-hidden flex items-end h-full">
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:from-blue-700 group-hover:to-indigo-500 shadow-sm"
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-2 font-medium truncate max-w-full text-center">
                                            {col.thang}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                            Số lượt tạo phiếu mượn
                        </span>
                        <span className="font-semibold text-gray-700">
                            Tổng: {thongKe.tongPhieuMuon} lượt
                        </span>
                    </div>
                </div>

                {/* BIỂU ĐỒ & BẢNG XẾP HẠNG: TOP SÁCH MƯỢN NHIỀU NHẤT */}
                <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <FiAward className="text-amber-500" />
                                    <span>Top sách được mượn nhiều nhất</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">Xếp hạng đầu sách độc giả yêu thích</p>
                            </div>
                            <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                                Top hot
                            </span>
                        </div>

                        {topSach.length === 0 ? (
                            <div className="py-12 text-center text-xs text-gray-400">
                                Chưa có dữ liệu mượn sách.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topSach.slice(0, 5).map((s, idx) => {
                                    const percent = Math.max(10, Math.round(((s.soLuotMuon || 0) / maxTopLuot) * 100));
                                    const huyChuong = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;

                                    return (
                                        <div key={s.id} className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-emerald-50/50 transition">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                                    <span className="font-bold text-sm shrink-0 w-6 text-center">{huyChuong}</span>
                                                    <span className="font-bold text-gray-800 truncate" title={s.tenSach}>
                                                        {s.tenSach}
                                                    </span>
                                                </div>
                                                <span className="font-extrabold text-emerald-700 shrink-0 bg-white px-2 py-0.5 rounded-md border text-[11px]">
                                                    {s.soLuotMuon || 0} lượt
                                                </span>
                                            </div>

                                            {/* Thanh Progress */}
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-right">
                        <Link href="/admin/sanpham" className="text-xs font-semibold text-emerald-700 hover:underline">
                            Xem tất cả sách trong kho →
                        </Link>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* KHỐI TÌNH TRẠNG KHO SÁCH VÀ TIỀN PHẠT */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Tình trạng sách vật lý trên kệ */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="mb-5 flex justify-between items-center">
                        <div>
                            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <FiBarChart2 className="text-emerald-600" />
                                <span>Tình trạng bản sao sách vật lý</span>
                            </h2>
                            <p className="text-xs text-gray-400">
                                Tổng cộng {thongKe.tongBanSao} cuốn sách vật lý đang lưu hành trong hệ thống
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                                <FiCheckCircle />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Sách sẵn sàng trên kệ</p>
                                <p className="text-2xl font-black text-emerald-800">{thongKe.banSaoSanSang} cuốn</p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                                <FiBook />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Sách đang cho mượn</p>
                                <p className="text-2xl font-black text-amber-800">{thongKe.banSaoDangMuon} cuốn</p>
                            </div>
                        </div>
                    </div>

                    {/* Phân bố theo thể loại */}
                    {theoDanhMuc.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-700 mb-2">Phân bố số lượng theo danh mục:</p>
                            <div className="flex flex-wrap gap-2">
                                {theoDanhMuc.map((dm) => (
                                    <span key={dm.id} className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 rounded-lg text-gray-700 font-medium">
                                        {dm.tenDanhMuc}: <b className="text-emerald-700">{dm.soLuong}</b>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tiền phạt chưa thu */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FiDollarSign className="text-red-500" size={20} />
                            <h2 className="text-base font-bold text-gray-800">Tiền phạt & Phí trễ hạn</h2>
                        </div>
                        <p className="text-xs text-gray-400">Tình trạng nợ phạt của độc giả</p>

                        <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100">
                            <p className="text-xs text-red-600 font-medium">Tổng tiền phạt chưa thu</p>
                            <p className="text-2xl font-black text-red-700 mt-1">
                                {dinhDangTien(thongKe.tongTienPhatChuaThu)}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                Số trường hợp nợ phạt: <b>{thongKe.soKhoanPhatChuaThu} độc giả</b>
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/tienphat"
                        className="mt-5 block w-full text-center py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                    >
                        Quản lý và thu tiền phạt →
                    </Link>
                </div>
            </div>
        </div>
    );
}

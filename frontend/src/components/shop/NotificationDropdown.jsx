"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    FiBell, FiCheck, FiCheckCircle, FiClock, 
    FiBookmark, FiRefreshCw, FiDollarSign, FiInfo,
    FiArrowRight, FiX 
} from "react-icons/fi";
import API_CONFIG from "@/config/api";

const ICON_THEO_LOAI = {
    DAT_TRUOC: { icon: <FiBookmark size={14} />, mau: "bg-emerald-100 text-emerald-700" },
    HAN_TRA: { icon: <FiClock size={14} />, mau: "bg-rose-100 text-rose-700" },
    GIA_HAN: { icon: <FiRefreshCw size={14} />, mau: "bg-blue-100 text-blue-700" },
    TIEN_PHAT: { icon: <FiDollarSign size={14} />, mau: "bg-amber-100 text-amber-700" },
    HE_THONG: { icon: <FiInfo size={14} />, mau: "bg-purple-100 text-purple-700" },
};

function tinhThoiGian(dateString) {
    if (!dateString) return "Gần đây";
    const d = new Date(dateString);
    const diffPhut = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
    if (diffPhut < 1) return "Vừa xong";
    if (diffPhut < 60) return `${diffPhut} phút trước`;
    const diffGio = Math.floor(diffPhut / 60);
    if (diffGio < 24) return `${diffGio} giờ trước`;
    const diffNgay = Math.floor(diffGio / 24);
    if (diffNgay === 1) return "Hôm qua";
    if (diffNgay < 7) return `${diffNgay} ngày trước`;
    return d.toLocaleDateString("vi-VN");
}

export default function NotificationDropdown({ user }) {
    const router = useRouter();
    const [moDropdown, setMoDropdown] = useState(false);
    const [danhSach, setDanhSach] = useState([]);
    const [soLuongChuaDoc, setSoLuongChuaDoc] = useState(0);
    const [dangTai, setDangTai] = useState(false);
    const menuRef = useRef(null);

    const docGiaId = user?.docGiaId || user?.taiKhoanId || user?.id;

    const taiThongBao = async () => {
        if (!docGiaId) return;
        setDangTai(true);
        try {
            const [resDS, resDem] = await Promise.all([
                fetch(`${API_CONFIG.BASE_URL}/thongBao/docGia/${docGiaId}`).then(r => r.ok ? r.json() : []),
                fetch(`${API_CONFIG.BASE_URL}/thongBao/chuaDoc/${docGiaId}`).then(r => r.ok ? r.json() : { soLuongChuaDoc: 0 })
            ]);
            setDanhSach(Array.isArray(resDS) ? resDS : []);
            setSoLuongChuaDoc(resDem.soLuongChuaDoc || 0);
        } catch (err) {
            console.error("Lỗi nạp thông báo:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiThongBao();
        // Kiểm tra thông báo định kỳ mỗi 60 giây
        const interval = setInterval(taiThongBao, 60000);
        return () => clearInterval(interval);
    }, [docGiaId]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMoDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Đánh dấu 1 tin là đã đọc
    const docThongBao = async (item) => {
        if (!item.daDoc) {
            try {
                await fetch(`${API_CONFIG.BASE_URL}/thongBao/${item.id}/daDoc`, { method: "PUT" });
                setDanhSach(prev => prev.map(x => x.id === item.id ? { ...x, daDoc: true } : x));
                setSoLuongChuaDoc(prev => Math.max(0, prev - 1));
            } catch (err) {}
        }

        if (item.lienKet) {
            setMoDropdown(false);
            router.push(item.lienKet);
        }
    };

    // Đọc tất cả
    const docTatCa = async () => {
        if (!docGiaId || soLuongChuaDoc === 0) return;
        try {
            await fetch(`${API_CONFIG.BASE_URL}/thongBao/docGia/${docGiaId}/docTatCa`, { method: "PUT" });
            setDanhSach(prev => prev.map(x => ({ ...x, daDoc: true })));
            setSoLuongChuaDoc(0);
        } catch (err) {
            console.error("Lỗi đánh dấu đọc tất cả:", err);
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            {/* Nút Quả Chuông trên Header */}
            <button
                onClick={() => setMoDropdown(!moDropdown)}
                className={`relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition ${
                    moDropdown ? "bg-slate-100 text-emerald-700" : ""
                }`}
                title="Thông báo của bạn"
                aria-label="Thông báo"
            >
                <FiBell size={18} />
                {soLuongChuaDoc > 0 && (
                    <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                        {soLuongChuaDoc > 9 ? "9+" : soLuongChuaDoc}
                    </span>
                )}
            </button>

            {/* Menu Dropdown Thông Báo */}
            {moDropdown && (
                <div className="absolute right-0 mt-2 w-[90vw] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn select-none">
                    {/* Header Dropdown */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">🔔 Thông báo</span>
                            {soLuongChuaDoc > 0 && (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                                    {soLuongChuaDoc} mới
                                </span>
                            )}
                        </div>

                        {soLuongChuaDoc > 0 && (
                            <button
                                onClick={docTatCa}
                                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            >
                                <FiCheck size={12} />
                                <span>Đọc tất cả</span>
                            </button>
                        )}
                    </div>

                    {/* Danh Sách Thông Báo */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 text-xs">
                        {dangTai && danhSach.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent mb-2"></div>
                                <p className="text-[11px]">Đang tải thông báo...</p>
                            </div>
                        ) : danhSach.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <p className="text-2xl mb-1">📭</p>
                                <p className="font-medium text-slate-600 text-xs">Chưa có thông báo nào</p>
                                <p className="text-[11px] mt-0.5">Các thông tin hạn trả và sách đặt trước sẽ hiện tại đây.</p>
                            </div>
                        ) : (
                            danhSach.map((item) => {
                                const loai = ICON_THEO_LOAI[item.loaiThongBao] || ICON_THEO_LOAI.HE_THONG;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => docThongBao(item)}
                                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start relative ${
                                            !item.daDoc ? "bg-emerald-50/30" : ""
                                        }`}
                                    >
                                        {/* Icon phân loại */}
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${loai.mau}`}>
                                            {loai.icon}
                                        </div>

                                        {/* Nội dung */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className={`text-xs leading-snug line-clamp-1 ${!item.daDoc ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                                                {item.tieuDe}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {item.noiDung}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium mt-1.5 inline-block">
                                                {tinhThoiGian(item.ngayTao)}
                                            </span>
                                        </div>

                                        {/* Chấm tròn báo tin chưa đọc */}
                                        {!item.daDoc && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-4 right-3 shrink-0"></span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Dropdown */}
                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                        <Link
                            href="/phieumuon"
                            onClick={() => setMoDropdown(false)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                        >
                            <span>Xem tất cả phiếu mượn & hoạt động</span>
                            <FiArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

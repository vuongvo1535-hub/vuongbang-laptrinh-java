"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCreditCard, FiCheckCircle, FiClock, FiUser, FiCalendar, FiRefreshCw } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function TheThuVienPage() {
    const [user, setUser] = useState(null);
    const [the, setThe] = useState(null);
    const [dangTai, setDangTai] = useState(true);

    const taiThongTinThe = async (docGiaId) => {
        setDangTai(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/theThuVien/docGia/${docGiaId}`);
            if (res.ok) {
                const data = await res.json();
                setThe(data);
            }
        } catch (err) {
            console.error("Lỗi tải thẻ thư viện:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                setUser(u);
                taiThongTinThe(u.docGiaId || u.taiKhoanId);
            } else {
                setDangTai(false);
            }
        } catch {
            setDangTai(false);
        }
    }, []);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🪪
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Thẻ Thư Viện Điện Tử</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Vui lòng đăng nhập tài khoản độc giả để xem thẻ thư viện có mã vạch và mã QR của bạn.
                </p>
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    const soThe = the?.soThe || `THE-${user.docGiaId || user.taiKhoanId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(soThe)}`;

    return (
        <div className="container mx-auto px-4 py-10 max-w-xl min-h-[75vh]">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-800">Thẻ Thư Viện Điện Tử</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Xuất trình mã QR hoặc mã vạch này tại quầy để thủ thư quét mã mượn - trả sách
                </p>
            </div>

            {dangTai ? (
                <div className="text-center py-12 text-gray-400">Đang tải thẻ thư viện...</div>
            ) : (
                <div className="bg-gradient-to-br from-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Họa tiết nền */}
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-emerald-200 font-bold">
                                THƯ VIỆN SÁCH ĐIỆN TỬ
                            </span>
                            <h2 className="text-xl font-bold mt-1">THẺ ĐỘC GIẢ CHÍNH THỨC</h2>
                        </div>
                        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                            <FiCheckCircle /> {the?.trangThai === "CON_HAN" || !the?.trangThai ? "CÒN HẠN" : "HẾT HẠN"}
                        </span>
                    </div>

                    <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center gap-6">
                        {/* Mã QR thẻ để thủ thư quét */}
                        <div className="text-center shrink-0">
                            <img
                                src={qrUrl}
                                alt="Mã QR Thẻ Thư Viện"
                                className="w-32 h-32 mx-auto rounded-lg border p-1"
                            />
                            <span className="text-[10px] text-gray-400 font-mono mt-1 block">Quét QR tại quầy</span>
                        </div>

                        <div className="flex-1 space-y-2 text-sm w-full">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-semibold">Họ và tên</span>
                                <p className="font-bold text-gray-900 text-base">{user.hoTen || user.tenDangNhap}</p>
                            </div>

                            <div className="flex justify-between text-xs">
                                <div>
                                    <span className="text-gray-400 uppercase font-semibold">Số thẻ</span>
                                    <p className="font-mono font-bold text-emerald-800 text-sm">{soThe}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 uppercase font-semibold">Mã độc giả</span>
                                    <p className="font-mono font-bold text-gray-700">#{user.docGiaId || user.taiKhoanId}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                <span>Cấp: {the?.ngayCap || "Hôm nay"}</span>
                                <span>Hết hạn: <b className="text-emerald-700">{the?.ngayHetHan || "12 tháng"}</b></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center text-xs text-emerald-200">
                        <span>Hệ thống Quản lý Thư viện Số 2026</span>
                        <Link
                            href="/phieumuon"
                            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                        >
                            Xem sách đang mượn →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

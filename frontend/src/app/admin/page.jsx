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
    const [dangTai, setDangTai] = useState(true);

    useEffect(() => {
        async function layThongKe() {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/thongKe/tongQuan`);
                if (res.ok) {
                    const data = await res.json();
                    setThongKe(data);
                }
            } catch (err) {
                console.error("Lỗi tải thống kê:", err);
            } finally {
                setDangTai(false);
            }
        }
        layThongKe();
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

    return (
        <div>
            {/* Tiêu đề */}
            <div className="mb-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chào mừng trở lại, Quản trị viên 👋
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Hệ thống quản lý kho sách, bạn đọc, mượn trả và tiền phạt thư viện.
                    </p>
                </div>

                <Link
                    href="/admin/quetma"
                    className="inline-flex items-center gap-2 self-start bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                    <span>📷</span>
                    <span>Web Quét Mã Vạch & Camera</span>
                </Link>
            </div>

            {/* 4 Thẻ thống kê */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {theThongKe.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.link}
                            href={item.link}
                            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {item.name}
                                    </p>
                                    <p className="mt-2 text-3xl font-black text-gray-800">
                                        {item.value}
                                    </p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
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

            {/* Khối tình trạng kho và tiền phạt */}
            <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Tình trạng sách trên kệ */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="mb-5 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Tình trạng sách vật lý trong kho
                            </h2>
                            <p className="text-sm text-gray-500">
                                Tổng cộng {thongKe.tongBanSao} cuốn sách vật lý đang lưu hành
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                                <FiCheckCircle />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Sách sẵn sàng trên kệ</p>
                                <p className="text-2xl font-black text-emerald-800">{thongKe.banSaoSanSang} cuốn</p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xl">
                                <FiBook />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Sách đang được mượn</p>
                                <p className="text-2xl font-black text-amber-800">{thongKe.banSaoDangMuon} cuốn</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-600">Phiếu mượn đã hoàn thành trả:</span>
                        <span className="font-bold text-gray-800">{thongKe.phieuDaTra} phiếu</span>
                    </div>
                </div>

                {/* Tiền phạt chưa thu */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <FiDollarSign className="text-red-500" size={20} />
                        <h2 className="text-lg font-bold text-gray-800">Tiền phạt tồn đọng</h2>
                    </div>
                    <p className="text-sm text-gray-500">Các khoản trễ hạn và hư hỏng sách</p>

                    <div className="mt-5 rounded-lg bg-red-50 p-4 border border-red-100">
                        <p className="text-xs text-red-600 font-medium">Tổng tiền phạt chưa thu</p>
                        <p className="text-2xl font-black text-red-700 mt-1">
                            {dinhDangTien(thongKe.tongTienPhatChuaThu)}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            Số trường hợp nợ phạt: <b>{thongKe.soKhoanPhatChuaThu} độc giả</b>
                        </p>
                    </div>

                    <Link
                        href="/admin/tienphat"
                        className="mt-5 block w-full text-center py-2 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                    >
                        Quản lý và thu tiền phạt →
                    </Link>
                </div>
            </div>
        </div>
    );
}

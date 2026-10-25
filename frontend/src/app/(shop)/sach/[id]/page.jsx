"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SachService from "@/services/shop/sachServices";
import GioMuonService from "@/services/shop/gioMuonServices";
import useGioMuon from "@/hooks/useGioMuon";
import SachCard from "@/components/shop/sach/SachCard";
import { dinhDangTien } from "@/utils/format";
import { IMAGE_URL } from "@/config/api";

export default function ChiTietSachPage() {
    const { id } = useParams();

    const [sach, setSach] = useState(null);
    const [lienQuan, setLienQuan] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    const [thongBao, setThongBao] = useState(null);

    const { gio } = useGioMuon();

    useEffect(() => {
        if (!id) return;

        let dangHoatDong = true;

        async function taiDuLieu() {
            try {
                const s = await SachService.getSachTheoId(id);

                if (!dangHoatDong) return;

                setSach(s);

                if (s) {
                    const r = await SachService.getSach({
                        danhMucId: s.danhDanhMucId || s.danh_muc_id,
                    });

                    if (!dangHoatDong) return;

                    const dsLienQuan = Array.isArray(r) ? r : (r?.data || []);
                    setLienQuan(
                        dsLienQuan
                            .filter((x) => String(x.id) !== String(s.id))
                            .slice(0, 4)
                    );
                }
            } catch {
                if (dangHoatDong) {
                    setLoi("Không tải được thông tin sách. Vui lòng thử lại.");
                }
            } finally {
                if (dangHoatDong) {
                    setDangTai(false);
                }
            }
        }

        taiDuLieu();

        return () => {
            dangHoatDong = false;
        };
    }, [id]);

    if (dangTai) {
        return (
            <p className="text-center py-20 text-gray-500">
                Đang tải thông tin sách...
            </p>
        );
    }

    if (loi) {
        return (
            <p className="text-center py-20 text-red-600">
                {loi}
            </p>
        );
    }

    if (!sach) {
        return (
            <div className="text-center py-20">
                <p className="text-lg text-red-500">
                    Không tìm thấy sách!
                </p>

                <Link
                    href="/sach"
                    className="text-emerald-700 font-semibold hover:underline"
                >
                    ← Quay lại tra cứu
                </Link>
            </div>
        );
    }

    // Ảnh nằm trong backend/public/images/shop/sach/
    // Ví dụ: DEMO001.jpg
    const maSach = String(sach.ma_sach || "").trim();
    const gocAnh = IMAGE_URL.replace(/\/+$/, "");

    const duongDanAnh = maSach
        ? `${gocAnh}/images/shop/sach/${encodeURIComponent(maSach)}.jpg`
        : `${gocAnh}/images/shop/sach/mac-dinh.jpg`;

    const tacGia = Array.isArray(sach.tac_gia)
        ? sach.tac_gia.join(", ")
        : sach.tac_gia || "Chưa cập nhật";

    const conSach = Number(sach.so_ban_san_sang || 0) > 0;

    const daTrongGio = (gio || []).some(
        (x) => String(x.id) === String(sach.id)
    );

    const themVaoGio = () => {
        setThongBao(GioMuonService.them(sach));
    };

    const dong = [
        ["Mã sách", sach.ma_sach || "Chưa cập nhật"],
        ["Tác giả", tacGia],
        ["Thể loại", sach.ten_danh_muc || "Chưa cập nhật"],
        ["Nhà xuất bản", sach.ten_nha_xuat_ban || "Chưa cập nhật"],
        ["Năm xuất bản", sach.nam_xuat_ban || "Chưa cập nhật"],
        ["Ngôn ngữ", sach.ngon_ngu || "Chưa cập nhật"],
        ["Số trang", sach.so_trang || "Chưa cập nhật"],
        ["Giá bìa", dinhDangTien(sach.gia_tien || 0)],
        ["Vị trí kệ", sach.vi_tri_ke || "Chưa cập nhật"],
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Đường dẫn điều hướng */}
            <p className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:underline">
                    Trang chủ
                </Link>
                {" / "}
                <Link href="/sach" className="hover:underline">
                    Tra cứu sách
                </Link>
                {" / "}
                {sach.ten_sach}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Ảnh bìa từ backend/public/images/shop/sach */}
                <div className="h-72 md:h-96 rounded-2xl bg-gray-100 flex items-center justify-center p-4 shadow overflow-hidden">
                    <img
                        src={duongDanAnh}
                        alt={sach.ten_sach || "Ảnh bìa sách"}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                            const anh = e.currentTarget;
                            const anhMacDinh =
                                `${gocAnh}/images/shop/sach/mac-dinh.jpg`;

                            // Nếu ảnh sách lỗi, chuyển sang ảnh mặc định.
                            if (anh.src !== anhMacDinh) {
                                anh.onerror = null;
                                anh.src = anhMacDinh;
                            } else {
                                // Nếu ảnh mặc định cũng lỗi, ẩn ảnh bị hỏng.
                                anh.onerror = null;
                                anh.style.display = "none";
                            }
                        }}
                    />
                </div>

                {/* Thông tin sách */}
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold">
                        {sach.ten_sach}
                    </h1>

                    <p className="mt-1 text-gray-500">
                        {tacGia}
                    </p>

                    <div
                        className={`mt-4 inline-block px-4 py-2 rounded-lg font-semibold ${
                            conSach
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                        }`}
                    >
                        {conSach
                            ? `Còn ${sach.so_ban_san_sang}/${sach.tong_ban_sao ?? 0} bản sẵn sàng`
                            : "Tất cả bản sao đang được mượn"}
                    </div>

                    <p className="mt-4 text-gray-700">
                        {sach.mo_ta || "Chưa có mô tả cho sách này."}
                    </p>

                    <dl className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 bg-white rounded-xl border border-gray-100 p-5">
                        {dong.map(([k, v]) => (
                            <div
                                key={k}
                                className="flex justify-between gap-4 border-b border-gray-100 py-1 text-sm"
                            >
                                <dt className="text-gray-500">{k}</dt>
                                <dd className="font-semibold text-right">
                                    {v}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            disabled
                            title="Chức năng sẽ được bổ sung sau"
                            className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-bold opacity-50 cursor-not-allowed"
                        >
                            Đặt trước sách
                        </button>

                        <button
                            onClick={themVaoGio}
                            disabled={!conSach || daTrongGio}
                            className="px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {daTrongGio
                                ? "Đã trong giỏ mượn"
                                : "Thêm vào giỏ mượn"}
                        </button>
                    </div>

                    {thongBao && (
                        <p
                            className={`mt-3 text-sm ${
                                thongBao.ok
                                    ? "text-emerald-700"
                                    : "text-red-600"
                            }`}
                        >
                            {thongBao.thongBao}

                            {thongBao.ok && (
                                <>
                                    {" "}
                                    <Link
                                        href="/gio-muon"
                                        className="underline font-semibold"
                                    >
                                        Xem giỏ mượn
                                    </Link>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* Sách cùng thể loại */}
            {lienQuan.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">
                        Sách cùng thể loại
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {lienQuan.map((x) => (
                            <SachCard key={x.id} sach={x} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
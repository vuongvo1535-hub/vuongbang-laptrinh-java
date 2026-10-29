"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SachService from "@/services/shop/sachServices";
import GioMuonService from "@/services/shop/gioMuonServices";
import useGioMuon from "@/hooks/useGioMuon";
import SachCard from "@/components/shop/sach/SachCard";
import { dinhDangTien, layDuongDanAnh } from "@/utils/format";
import { FiBook, FiCheck, FiShoppingCart, FiMapPin, FiCalendar, FiGlobe, FiFileText, FiTag } from "react-icons/fi";

const ANH_TRONG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <rect width="300" height="420" fill="#f8fafc"/>
        <rect x="30" y="40" width="240" height="340" rx="12" fill="#e2e8f0"/>
        <text x="150" y="215" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#64748b" text-anchor="middle">📚 Chưa có ảnh bìa</text>
    </svg>`
)}`;

export default function ChiTietSachPage() {
    const { id } = useParams();

    const [sach, setSach] = useState(null);
    const [lienQuan, setLienQuan] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    const [thongBao, setThongBao] = useState(null);
    const [chiSoAnh, setChiSoAnh] = useState(0);

    const { gio } = useGioMuon();

    useEffect(() => {
        if (!id) return;
        let dangHoatDong = true;

        async function taiDuLieu() {
            try {
                const s = await SachService.getSachTheoId(id);
                if (!dangHoatDong) return;

                setSach(s);
                setChiSoAnh(0);

                if (s) {
                    const danhMucId = s.danh_muc_id ?? s.danhMucId;
                    if (danhMucId != null) {
                        const r = await SachService.getSach({ danhMucId });
                        if (!dangHoatDong) return;
                        const dsLienQuan = Array.isArray(r) ? r : (r?.data || []);
                        setLienQuan(
                            dsLienQuan
                                .filter((x) => String(x.id) !== String(s.id))
                                .slice(0, 4)
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết sách:", error);
                if (dangHoatDong) setLoi("Không tải được thông tin sách. Vui lòng thử lại.");
            } finally {
                if (dangHoatDong) setDangTai(false);
            }
        }

        taiDuLieu();
        return () => {
            dangHoatDong = false;
        };
    }, [id]);

    const dsAnh = useMemo(() => {
        const anhBia = String(sach?.anh_bia ?? sach?.anhBia ?? "").trim();
        const maSach = String(sach?.ma_sach ?? sach?.maSach ?? "").trim();
        const ds = [];

        if (anhBia) {
            const duongDan = layDuongDanAnh(anhBia);
            if (duongDan) ds.push(duongDan);
        }

        if (maSach) {
            const duongDanMa = layDuongDanAnh(`${maSach}.jpg`);
            if (duongDanMa && !ds.includes(duongDanMa)) {
                ds.push(duongDanMa);
            }
        }

        ds.push(ANH_TRONG);
        return [...new Set(ds)];
    }, [sach]);

    if (dangTai) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
                <p className="text-gray-500 text-sm">Đang tải thông tin chi tiết cuốn sách...</p>
            </div>
        );
    }

    if (loi || !sach) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-lg text-red-500 mb-4">{loi || "Không tìm thấy cuốn sách này!"}</p>
                <Link href="/sach" className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm">
                    ← Quay lại tra cứu sách
                </Link>
            </div>
        );
    }

    const duongDanAnh = dsAnh[Math.min(chiSoAnh, dsAnh.length - 1)] || ANH_TRONG;

    const tenSach = sach.tenSach || sach.ten_sach || "Sách thư viện";
    const maSach = sach.maSach || sach.ma_sach || (sach.id ? `DEMO00${sach.id}` : "-");
    const tacGia = Array.isArray(sach.tac_gia)
        ? sach.tac_gia.join(", ")
        : (sach.tacGia || sach.tac_gia || "Đang cập nhật");
    const tenDanhMuc = sach.tenDanhMuc || sach.ten_danh_muc || "Tổng hợp";
    const tenNhaXuatBan = sach.tenNhaXuatBan || sach.ten_nha_xuat_ban || "Nhà Xuất Bản Trẻ";
    const namXuatBan = sach.namXuatBan ?? sach.nam_xuat_ban ?? "2023";
    const ngonNgu = sach.ngonNgu || sach.ngon_ngu || "Tiếng Việt";
    const soTrang = sach.soTrang ?? sach.so_trang ?? 240;
    const giaTien = sach.giaTien ?? sach.gia_tien ?? 0;
    const viTriKe = sach.viTriKe || sach.vi_tri_ke || "Kệ A";
    const isbn = sach.isbn || "978-604-000000";
    const lanTaiBan = sach.lanTaiBan ?? sach.lan_tai_ban ?? 1;
    const moTa = sach.moTa || sach.mo_ta || "Tác phẩm giá trị được bảo quản và lưu hành phục vụ bạn đọc tại Thư viện.";

    const soBanSanSang = (sach.so_ban_san_sang !== undefined && Number(sach.so_ban_san_sang) > 0)
        ? Number(sach.so_ban_san_sang)
        : (sach.soBanSanSang !== undefined && Number(sach.soBanSanSang) > 0)
        ? Number(sach.soBanSanSang)
        : 4;
    const tongSoBan = (sach.tong_so_ban !== undefined && Number(sach.tong_so_ban) > 0)
        ? Number(sach.tong_so_ban)
        : (sach.tongSoBan !== undefined && Number(sach.tongSoBan) > 0)
        ? Number(sach.tongSoBan)
        : 5;
    const conSach = soBanSanSang > 0;

    const daTrongGio = (gio || []).some((x) => String(x.id) === String(sach.id));

    const themVaoGio = () => {
        setThongBao(GioMuonService.them({ ...sach, so_ban_san_sang: soBanSanSang }));
    };

    const dongThongTin = [
        { nhan: "Mã sách", giaTri: maSach, b: true, mau: "text-emerald-800 font-mono" },
        { nhan: "Tác giả", giaTri: tacGia, b: true },
        { nhan: "Thể loại", giaTri: tenDanhMuc },
        { nhan: "Số lượng trong kho", giaTri: `${tongSoBan} bản (${soBanSanSang} bản sẵn sàng)`, b: true, mau: conSach ? "text-emerald-700 font-bold" : "text-red-600 font-bold" },
        { nhan: "Tình trạng", giaTri: conSach ? "Còn sách sẵn sàng cho mượn" : "Tạm thời mượn hết", b: true, mau: conSach ? "text-green-700 font-semibold" : "text-red-600 font-semibold" },
        { nhan: "Nhà xuất bản", giaTri: tenNhaXuatBan },
        { nhan: "Năm xuất bản", giaTri: namXuatBan },
        { nhan: "Mã chuẩn ISBN", giaTri: isbn, mau: "font-mono text-gray-700" },
        { nhan: "Lần tái bản", giaTri: `Lần thứ ${lanTaiBan}` },
        { nhan: "Ngôn ngữ", giaTri: ngonNgu },
        { nhan: "Số trang", giaTri: `${soTrang} trang` },
        { nhan: "Giá trị sách", giaTri: dinhDangTien(giaTien), mau: "text-red-600 font-bold" },
        { nhan: "Vị trí lưu kho", giaTri: viTriKe, mau: "text-emerald-700 font-semibold" },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb */}
            <p className="text-xs text-gray-500 mb-6">
                <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
                {" / "}
                <Link href="/sach" className="hover:text-emerald-700">Tra cứu sách</Link>
                {" / "}
                <span className="text-gray-800 font-semibold truncate">{tenSach}</span>
            </p>

            {/* Chi tiết sách */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                {/* Cột Trái: Ảnh bìa */}
                <div className="md:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-xs aspect-[3/4] rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-3 shadow-md overflow-hidden relative">
                        <img
                            key={duongDanAnh}
                            src={duongDanAnh}
                            alt={tenSach}
                            className="w-full h-full object-contain rounded-xl"
                            onError={() => {
                                setChiSoAnh((i) => Math.min(i + 1, dsAnh.length - 1));
                            }}
                        />
                        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-white/90 font-mono font-bold text-gray-700 shadow-sm">
                            {maSach}
                        </span>
                    </div>

                    <div className="mt-4 w-full max-w-xs p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex justify-between items-center">
                        <span className="flex items-center gap-1 font-semibold">
                            <FiMapPin /> Vị trí: {viTriKe}
                        </span>
                        <span className="font-bold">
                            {conSach ? `Còn ${soBanSanSang}/${tongSoBan} cuốn sẵn sàng` : "Đã mượn hết"}
                        </span>
                    </div>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                {tenDanhMuc}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                conSach ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {conSach ? "Sẵn sàng mượn" : "Tạm hết"}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                            {tenSach}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Tác giả: <span className="font-semibold text-emerald-900">{tacGia}</span>
                        </p>

                        {/* Bảng chi tiết thuộc tính sách */}
                        <div className="mt-6 border rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                            {dongThongTin.map((item, idx) => (
                                <div key={idx} className="flex px-4 py-2.5 bg-white hover:bg-gray-50 transition">
                                    <span className="w-1/3 text-gray-500 font-medium">{item.nhan}:</span>
                                    <span className={`w-2/3 ${item.mau || (item.b ? "font-bold text-gray-800" : "text-gray-700")}`}>
                                        {item.giaTri}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Mô tả sách */}
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-2">Giới thiệu tóm tắt nội dung:</h3>
                            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {moTa}
                            </p>
                        </div>
                    </div>

                    {/* Nút mượn sách */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={themVaoGio}
                                disabled={!conSach || daTrongGio}
                                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 ${
                                    daTrongGio
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : !conSach
                                        ? "bg-red-50 text-red-500 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                }`}
                            >
                                <FiShoppingCart size={18} />
                                {daTrongGio ? "Đã có trong giỏ mượn" : "Thêm vào giỏ mượn sách"}
                            </button>

                            <Link
                                href="/giomuon"
                                className="px-5 py-3 rounded-xl border border-gray-300 hover:border-emerald-600 text-gray-700 font-bold text-sm transition"
                            >
                                Mở giỏ mượn sách
                            </Link>
                        </div>

                        {thongBao && (
                            <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                                thongBao.ok ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                <span>{thongBao.thongBao}</span>
                                {thongBao.ok && (
                                    <Link href="/giomuon" className="underline font-bold text-emerald-900 ml-2">
                                        Đến giỏ mượn ngay →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sách cùng thể loại liên quan */}
            {lienQuan.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <FiBook className="text-emerald-600" />
                        <span>Sách cùng thể loại {tenDanhMuc}</span>
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

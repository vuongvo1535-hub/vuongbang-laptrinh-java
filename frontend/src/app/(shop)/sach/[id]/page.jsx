"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SachService from "@/services/shop/sachServices";
import GioMuonService from "@/services/shop/gioMuonServices";
import useGioMuon from "@/hooks/useGioMuon";
import SachCard from "@/components/shop/sach/SachCard";
import { dinhDangTien } from "@/utils/format";
import { IMAGE_URL } from "@/config/api";

// Ảnh dự phòng cuối cùng (không cần file nào trên server)
const ANH_TRONG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <rect width="300" height="420" fill="#f3f4f6"/>
        <rect x="40" y="50" width="220" height="320" rx="10" fill="#e5e7eb"/>
        <text x="150" y="215" font-family="Arial, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle">Chưa có ảnh bìa</text>
    </svg>`
)}`;

// Lấy gốc URL của backend: bỏ dấu "/" ở cuối và đuôi "/api" nếu có
function layGocAnh() {
    return String(IMAGE_URL || "")
        .trim()
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "");
}

export default function ChiTietSachPage() {
    const { id } = useParams();

    const [sach, setSach] = useState(null);
    const [lienQuan, setLienQuan] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    const [thongBao, setThongBao] = useState(null);

    // Vị trí ảnh đang thử trong danh sách ảnh dự phòng
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
                        const r = await SachService.getSach({
                            danhMucId,
                        });

                        if (!dangHoatDong) return;

                        const dsLienQuan = Array.isArray(r)
                            ? r
                            : r?.data || [];

                        setLienQuan(
                            dsLienQuan
                                .filter(
                                    (x) => String(x.id) !== String(s.id)
                                )
                                .slice(0, 4)
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết sách:", error);

                if (dangHoatDong) {
                    setLoi(
                        "Không tải được thông tin sách. Vui lòng thử lại."
                    );
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

    // Danh sách ảnh sẽ thử lần lượt:
    // 1. Cột anh_bia trong DB (ví dụ DEMO001.jpg)
    // 2. Mã sách + .jpg (ví dụ DEMO001.jpg)
    // 3. mac-dinh.jpg trên backend
    // 4. Ảnh trống nhúng sẵn trong code
    const dsAnh = useMemo(() => {
        const anhBia = String(sach?.anh_bia ?? sach?.anhBia ?? "").trim();
        const maSach = String(sach?.ma_sach ?? sach?.maSach ?? "").trim();

        const ds = [];

        if (anhBia) {
            if (/^https?:\/\//i.test(anhBia)) {
                ds.push(anhBia);
            } else {
                const tenFile = encodeURIComponent(anhBia.replace(/^\/+/, ""));
                ds.push(`/shop/images/sach/${tenFile}`);
                ds.push(`/images/sach/${tenFile}`);
                ds.push(`http://localhost:8080/shop/images/sach/${tenFile}`);
                ds.push(`http://localhost:8080/images/sach/${tenFile}`);
            }
        }

        if (maSach) {
            const tenMa = encodeURIComponent(maSach);
            ds.push(`/shop/images/sach/${tenMa}.jpg`);
            ds.push(`http://localhost:8080/shop/images/sach/${tenMa}.jpg`);
        }

        ds.push(ANH_TRONG);

        // Bỏ các URL trùng nhau
        return [...new Set(ds)];
    }, [sach]);

    if (dangTai) {
        return (
            <p className="text-center py-20 text-gray-500">
                Đang tải thông tin sách...
            </p>
        );
    }

    if (loi) {
        return (
            <div className="text-center py-20">
                <p className="text-red-600">{loi}</p>

                <Link
                    href="/sach"
                    className="inline-block mt-4 text-emerald-700 font-semibold hover:underline"
                >
                    ← Quay lại tra cứu
                </Link>
            </div>
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
                    className="inline-block mt-4 text-emerald-700 font-semibold hover:underline"
                >
                    ← Quay lại tra cứu
                </Link>
            </div>
        );
    }

    const duongDanAnh =
        dsAnh[Math.min(chiSoAnh, dsAnh.length - 1)] || ANH_TRONG;

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
                {/* Ảnh bìa sách */}
                <div className="h-72 md:h-96 rounded-2xl bg-gray-100 flex items-center justify-center p-4 shadow overflow-hidden">
                    <img
                        key={duongDanAnh}
                        src={duongDanAnh}
                        alt={sach.ten_sach || "Ảnh bìa sách"}
                        className="w-full h-full object-contain rounded-lg"
                        onError={() => {
                            // Ảnh lỗi thì chuyển sang ảnh dự phòng kế tiếp
                            setChiSoAnh((i) =>
                                Math.min(i + 1, dsAnh.length - 1)
                            );
                        }}
                    />
                </div>

                {/* Thông tin sách */}
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold">{sach.ten_sach}</h1>

                    <p className="mt-1 text-gray-500">{tacGia}</p>

                    <div
                        className={`mt-4 inline-block px-4 py-2 rounded-lg font-semibold ${
                            conSach
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                        }`}
                    >
                        {conSach
                            ? `Còn ${sach.so_ban_san_sang}/${
                                  sach.tong_ban_sao ?? 0
                              } bản sẵn sàng`
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

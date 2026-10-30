"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDonHangs, capNhatTrangThaiDonHang } from "@/services/admin/donHangService";
import Pagination from "@/components/common/Pagination";
import API_CONFIG from "@/config/api";

// Hiển thị trạng thái phiếu mượn bằng màu sắc
function NhanTrangThai({ trangThai }) {
    const map = {
        DANG_MUON: { label: "Đang mượn", cls: "bg-amber-100 text-amber-700" },
        DA_TRA: { label: "Đã trả xong", cls: "bg-green-100 text-green-700" },
        DA_TRA_MOT_PHAN: { label: "Trả một phần", cls: "bg-blue-100 text-blue-700" },
        QUA_HAN: { label: "Quá hạn", cls: "bg-red-100 text-red-700" },
        DA_HUY: { label: "Đã hủy", cls: "bg-gray-100 text-gray-600" },
    };
    const tt = map[trangThai] || { label: trangThai || "?", cls: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tt.cls}`}>
            {tt.label}
        </span>
    );
}

export default function PhieuMuonAdminPage() {
    const [danhSach, setDanhSach] = useState([]);
    const [mapDocGia, setMapDocGia] = useState({});
    const [tuKhoa, setTuKhoa] = useState("");
    const [locTrangThai, setLocTrangThai] = useState("");
    const [trang, setTrang] = useState(1);
    const [tongTrang, setTongTrang] = useState(1);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    const router = useRouter();

    // Tải danh sách tên độc giả để map id -> họ tên
    useEffect(() => {
        async function taiDocGia() {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/docGia`);
                if (res.ok) {
                    const list = await res.json();
                    const m = {};
                    (Array.isArray(list) ? list : []).forEach((d) => {
                        m[d.id] = d.hoTen || d.maDocGia;
                    });
                    setMapDocGia(m);
                }
            } catch {}
        }
        taiDocGia();
    }, []);

    const taiDanhSach = async (trangHienTai = 1) => {
        setDangTai(true);
        setLoi("");
        try {
            const res = await getDonHangs(trangHienTai, tuKhoa);
            let ds = res.data || [];
            if (locTrangThai) {
                ds = ds.filter((x) => x.trangThai === locTrangThai || x.trang_thai === locTrangThai);
            }
            setDanhSach(ds);
            setTongTrang(res.last_page || 1);
        } catch (err) {
            setLoi("Không thể tải danh sách phiếu mượn: " + err.message);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDanhSach(trang);
    }, [trang, locTrangThai]);

    const handleCapNhatTrangThai = async (id, trangThaiMoi) => {
        if (!confirm(`Cập nhật trạng thái phiếu mượn #${id} thành "${trangThaiMoi}"?`)) return;
        try {
            await capNhatTrangThaiDonHang(id, trangThaiMoi);
            alert("Cập nhật thành công!");
            taiDanhSach(trang);
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const formatNgay = (ngay) => {
        if (!ngay) return "-";
        return new Date(ngay).toLocaleDateString("vi-VN");
    };

    return (
        <div className="p-6">
            {/* Tiêu đề */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Phiếu Mượn - Trả Sách</h1>
                    <p className="text-sm text-gray-500">Quản lý các phiếu mượn sách của độc giả</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push("/admin/quetma")}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        📷 Quét mã vạch / QR
                    </button>
                    <button
                        onClick={() => router.push("/admin/donhang/tao")}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                    >
                        + Tạo phiếu mượn mới
                    </button>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <form
                    onSubmit={(e) => { e.preventDefault(); setTrang(1); taiDanhSach(1); }}
                    className="flex flex-1"
                >
                    <input
                        type="text"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        placeholder="Tìm theo mã phiếu hoặc ID độc giả..."
                        className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="bg-emerald-600 text-white px-4 rounded-r-lg hover:bg-emerald-700 text-sm font-medium">
                        Tìm
                    </button>
                </form>

                <select
                    value={locTrangThai}
                    onChange={(e) => { setLocTrangThai(e.target.value); setTrang(1); }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="DANG_MUON">Đang mượn</option>
                    <option value="DA_TRA">Đã trả xong</option>
                    <option value="DA_TRA_MOT_PHAN">Trả một phần</option>
                    <option value="QUA_HAN">Quá hạn</option>
                    <option value="DA_HUY">Đã hủy</option>
                </select>
            </div>

            {/* Nội dung */}
            {dangTai ? (
                <div className="text-center py-12 text-gray-500">Đang tải danh sách phiếu mượn...</div>
            ) : loi ? (
                <div className="rounded-xl bg-red-50 p-6 text-red-600 border border-red-100">{loi}</div>
            ) : danhSach.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    Không có phiếu mượn nào.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                            <tr>
                                <th className="px-5 py-4">Mã phiếu</th>
                                <th className="px-5 py-4">Người mượn</th>
                                <th className="px-5 py-4">Ngày mượn</th>
                                <th className="px-5 py-4">Ghi chú</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {danhSach.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-4 font-semibold text-emerald-700">
                                        {row.maPhieu || row.ma_don_hang || `PM-${row.id}`}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-gray-900 text-sm">
                                            {row.tenDocGia || mapDocGia[row.docGiaId] || row.ten_nguoi_nhan || `Độc giả #${row.docGiaId}`}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Mã độc giả: #{row.docGiaId}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        {formatNgay(row.ngayMuon || row.ngay_tao)}
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                                        {row.ghiChu || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <NhanTrangThai trangThai={row.trangThai || row.trang_thai} />
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex justify-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => router.push(`/admin/donhang/${row.id}`)}
                                                className="rounded bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                                            >
                                                Xem chi tiết
                                            </button>
                                            {(row.trangThai === "DANG_MUON" || row.trang_thai === "DANG_MUON") && (
                                                <button
                                                    onClick={() => handleCapNhatTrangThai(row.id, "QUA_HAN")}
                                                    className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                                                >
                                                    Đánh dấu quá hạn
                                                </button>
                                            )}
                                            {(row.trangThai === "QUA_HAN" || row.trang_thai === "QUA_HAN") && (
                                                <button
                                                    onClick={() => handleCapNhatTrangThai(row.id, "DA_HUY")}
                                                    className="rounded bg-gray-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-600"
                                                >
                                                    Hủy phiếu
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Phân trang */}
            {tongTrang > 1 && (
                <div className="mt-5 flex justify-center">
                    <Pagination
                        currentPage={trang}
                        pageCount={tongTrang}
                        onPageChange={(p) => setTrang(p)}
                    />
                </div>
            )}
        </div>
    );
}

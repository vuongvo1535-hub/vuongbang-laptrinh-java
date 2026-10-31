"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBookmark, FiCheckCircle, FiClock, FiSearch, FiRefreshCw, FiBook, FiCheck, FiX } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function AdminDatTruocPage() {
    const [danhSach, setDanhSach] = useState([]);
    const [tuKhoa, setTuKhoa] = useState("");
    const [locTrangThai, setLocTrangThai] = useState("");
    const [dangTai, setDangTai] = useState(true);

    const taiDuLieu = async () => {
        setDangTai(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/datTruoc`);
            if (res.ok) {
                const data = await res.json();
                setDanhSach(Array.isArray(data) ? data : []);
            } else {
                setDanhSach([]);
            }
        } catch (err) {
            console.error("Lỗi tải đặt trước:", err);
            setDanhSach([]);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDuLieu();
    }, []);

    const doiTrangThai = async (id, trangThaiMoi) => {
        const tenTrangThai = trangThaiMoi === "DA_CO_SACH" ? "Đã có sách về" :
                             trangThaiMoi === "DA_NHAN" ? "Đã giao sách cho độc giả" : "Đã hủy";
        if (!confirm(`Cập nhật trạng thái yêu cầu #${id} thành "${tenTrangThai}"?`)) return;

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/datTruoc/${id}/trangThai?trangThai=${trangThaiMoi}`, {
                method: "PUT"
            });
            if (res.ok) {
                alert("Cập nhật trạng thái thành công!");
                taiDuLieu();
            } else {
                alert("Không thể cập nhật trạng thái.");
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    // Lọc danh sách theo từ khóa và trạng thái
    const danhSachLoc = danhSach.filter((item) => {
        const matchTrangThai = !locTrangThai || item.trangThai === locTrangThai;
        const kw = tuKhoa.toLowerCase();
        const matchTuKhoa = !kw ||
            (item.tenSach && item.tenSach.toLowerCase().includes(kw)) ||
            (item.tenDocGia && item.tenDocGia.toLowerCase().includes(kw)) ||
            String(item.id).includes(kw);
        return matchTrangThai && matchTuKhoa;
    });

    const demCho = danhSach.filter((x) => x.trangThai === "CHO_CO_SACH").length;
    const demCo = danhSach.filter((x) => x.trangThai === "DA_CO_SACH").length;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FiBookmark className="text-amber-500" />
                        <span>Hàng Đợi Đặt Trước Sách (Hold / Reservation)</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Quản lý độc giả đặt trước khi sách tạm hết bản sao trên kệ
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={taiDuLieu}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                        <FiRefreshCw size={14} /> Làm mới
                    </button>
                    <Link
                        href="/admin/donhang"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                        <span>📋</span> Phiếu mượn - trả
                    </Link>
                </div>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                        ⏳
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Đang trong hàng đợi chờ sách</p>
                        <p className="text-2xl font-black text-amber-700">{demCho} độc giả</p>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                        🎉
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Đã có sách về (Chờ độc giả nhận)</p>
                        <p className="text-2xl font-black text-emerald-700">{demCo} yêu cầu</p>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                        📚
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Tổng số lượt đặt trước</p>
                        <p className="text-2xl font-black text-gray-800">{danhSach.length} lượt</p>
                    </div>
                </div>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative flex items-center">
                    <FiSearch className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        placeholder="Tìm theo tên sách, tên độc giả hoặc mã yêu cầu..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <select
                    value={locTrangThai}
                    onChange={(e) => setLocTrangThai(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none bg-white text-gray-700"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="CHO_CO_SACH">⏳ Đang chờ sách</option>
                    <option value="DA_CO_SACH">🎉 Đã có sách về</option>
                    <option value="DA_NHAN">✓ Đã giao sách</option>
                    <option value="DA_HUY">Đã hủy</option>
                </select>
            </div>

            {/* Bảng danh sách đặt trước */}
            {dangTai ? (
                <div className="p-12 text-center text-gray-400 text-xs bg-white rounded-2xl border">Đang tải danh sách đặt trước...</div>
            ) : danhSachLoc.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-xs bg-white rounded-2xl border">
                    Không có yêu cầu đặt trước nào phù hợp với bộ lọc.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                            <tr>
                                <th className="px-5 py-3">Mã</th>
                                <th className="px-5 py-3">Cuốn sách đặt trước</th>
                                <th className="px-5 py-3">Độc giả</th>
                                <th className="px-5 py-3">Ngày đặt</th>
                                <th className="px-5 py-3">Trạng thái</th>
                                <th className="px-5 py-3">Ghi chú</th>
                                <th className="px-5 py-3 text-center">Thao tác thủ thư</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {danhSachLoc.map((row) => {
                                const daCo = row.trangThai === "DA_CO_SACH";
                                const dangCho = row.trangThai === "CHO_CO_SACH";
                                return (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono font-bold text-gray-500 text-xs">
                                            #{row.id}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-gray-900 text-sm">{row.tenSach || `Sách #${row.sachId}`}</p>
                                            <p className="text-[11px] text-emerald-700">Mã sách: #{row.sachId}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-gray-800 text-xs">{row.tenDocGia || `Độc giả #${row.docGiaId}`}</p>
                                            <p className="text-[11px] text-gray-400">Mã độc giả: #{row.docGiaId}</p>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-600">
                                            {row.ngayDat ? new Date(row.ngayDat).toLocaleString("vi-VN") : "-"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                                daCo ? "bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-300" :
                                                dangCho ? "bg-amber-100 text-amber-800" :
                                                row.trangThai === "DA_NHAN" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-600"
                                            }`}>
                                                {daCo ? "🎉 Đã có sách về" :
                                                 dangCho ? "⏳ Đang chờ sách" :
                                                 row.trangThai === "DA_NHAN" ? "✓ Đã nhận sách" : "Đã hủy"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 max-w-xs truncate">
                                            {row.ghiChu || "-"}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center gap-1.5 flex-wrap">
                                                {dangCho && (
                                                    <button
                                                        onClick={() => doiTrangThai(row.id, "DA_CO_SACH")}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                                                        title="Đánh dấu sách đã về và sẵn sàng giao cho độc giả"
                                                    >
                                                        ✓ Báo có sách
                                                    </button>
                                                )}
                                                {daCo && (
                                                    <button
                                                        onClick={() => doiTrangThai(row.id, "DA_NHAN")}
                                                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                                                        title="Độc giả đã đến quầy nhận sách"
                                                    >
                                                        📖 Đã giao sách
                                                    </button>
                                                )}
                                                {(dangCho || daCo) && (
                                                    <button
                                                        onClick={() => doiTrangThai(row.id, "DA_HUY")}
                                                        className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200"
                                                    >
                                                        ✕ Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

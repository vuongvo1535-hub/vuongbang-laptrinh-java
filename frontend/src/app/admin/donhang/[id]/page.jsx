"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API_CONFIG from "@/config/api";

function NhanTrangThai({ trangThai }) {
    const map = {
        DANG_MUON: { label: "Đang mượn", cls: "bg-amber-100 text-amber-700" },
        DA_TRA: { label: "Đã trả", cls: "bg-green-100 text-green-700" },
        MAT: { label: "Làm mất", cls: "bg-red-100 text-red-700" },
        HU_HONG: { label: "Hư hỏng", cls: "bg-orange-100 text-orange-700" },
    };
    const tt = map[trangThai] || { label: trangThai || "-", cls: "bg-gray-100 text-gray-600" };
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tt.cls}`}>
            {tt.label}
        </span>
    );
}

export default function ChiTietPhieuMuonPage() {
    const { id } = useParams();
    const router = useRouter();
    const [phieu, setPhieu] = useState(null);
    const [chiTiet, setChiTiet] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    // Form trả sách
    const [moFormTra, setMoFormTra] = useState(false);
    const [chonChiTietId, setChonChiTietId] = useState("");
    const [tinhTrangTra, setTinhTrangTra] = useState("TOT");
    const [ghiChuTra, setGhiChuTra] = useState("");

    useEffect(() => {
        async function tai() {
            try {
                const [r1, r2] = await Promise.all([
                    fetch(`${API_CONFIG.BASE_URL}/phieuMuon/${id}`),
                    fetch(`${API_CONFIG.BASE_URL}/phieuMuon/${id}/chiTiet`),
                ]);
                if (!r1.ok) throw new Error("Không tìm thấy phiếu mượn");
                setPhieu(await r1.json());
                if (r2.ok) setChiTiet(await r2.json());
            } catch (err) {
                setLoi(err.message);
            } finally {
                setDangTai(false);
            }
        }
        tai();
    }, [id]);

    const handleTraSach = async (e) => {
        e.preventDefault();
        if (!chonChiTietId) { alert("Vui lòng chọn cuốn sách cần trả"); return; }
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/tra`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chiTietPhieuMuonId: Number(chonChiTietId),
                    tinhTrangLucTra: tinhTrangTra,
                    ghiChu: ghiChuTra,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Trả sách thất bại");
            alert(`Trả sách thành công! ${tinhTrangTra !== "TOT" ? "Đã tạo phiếu phạt tự động." : ""}`);
            setMoFormTra(false);
            // Tải lại chi tiết
            const r2 = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/${id}/chiTiet`);
            if (r2.ok) setChiTiet(await r2.json());
            const r1 = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/${id}`);
            if (r1.ok) setPhieu(await r1.json());
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const formatNgay = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "-";
    const formatNgayGio = (d) => d ? new Date(d).toLocaleString("vi-VN") : "-";

    if (dangTai) return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
    if (loi) return <div className="p-6 text-red-600">{loi}</div>;
    if (!phieu) return <div className="p-6 text-gray-500">Không tìm thấy phiếu mượn.</div>;

    const danhSachDangMuon = chiTiet.filter((x) => x.trangThai === "DANG_MUON");

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-500 hover:text-emerald-600"
                >
                    ← Quay lại
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    Chi tiết phiếu mượn: <span className="text-emerald-700">{phieu.maPhieu || `PM-${phieu.id}`}</span>
                </h1>
            </div>

            {/* Thông tin phiếu mượn */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-700 mb-4 text-lg">Thông tin phiếu</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400">Mã phiếu</p>
                        <p className="font-bold text-emerald-700">{phieu.maPhieu || "-"}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Độc giả</p>
                        <p className="font-semibold">#{phieu.docGiaId}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Ngày mượn</p>
                        <p className="font-semibold">{formatNgayGio(phieu.ngayMuon)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Trạng thái</p>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            phieu.trangThai === "DA_TRA" ? "bg-green-100 text-green-700" :
                            phieu.trangThai === "DANG_MUON" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                            {phieu.trangThai}
                        </span>
                    </div>
                </div>
                {phieu.ghiChu && <p className="mt-3 text-sm text-gray-500">Ghi chú: {phieu.ghiChu}</p>}
            </div>

            {/* Danh sách sách trong phiếu */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-700 text-lg">
                        Danh sách sách ({chiTiet.length} cuốn)
                    </h2>
                    {danhSachDangMuon.length > 0 && (
                        <button
                            onClick={() => setMoFormTra(true)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            📚 Ghi nhận trả sách
                        </button>
                    )}
                </div>

                {chiTiet.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">Chưa có chi tiết sách nào.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Tên sách</th>
                                    <th className="px-4 py-3">Mã vạch</th>
                                    <th className="px-4 py-3">Ngày hẹn trả</th>
                                    <th className="px-4 py-3">Ngày trả thực tế</th>
                                    <th className="px-4 py-3">Tình trạng</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {chiTiet.map((ct) => {
                                    const quaHan = ct.trangThai === "DANG_MUON" && new Date(ct.ngayHenTra) < new Date();
                                    return (
                                        <tr key={ct.id} className={`hover:bg-gray-50 ${quaHan ? "bg-red-50" : ""}`}>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {ct.tenSach || `Sách #${ct.banSaoSachId}`}
                                                {quaHan && <span className="ml-2 text-xs text-red-600 font-bold">⚠ Quá hạn!</span>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{ct.maVach || "-"}</td>
                                            <td className="px-4 py-3 text-gray-600">{formatNgay(ct.ngayHenTra)}</td>
                                            <td className="px-4 py-3 text-gray-600">{formatNgayGio(ct.ngayTraThucTe) || "Chưa trả"}</td>
                                            <td className="px-4 py-3 text-gray-600">{ct.tinhTrangLucTra || ct.tinhTrangLucMuon || "-"}</td>
                                            <td className="px-4 py-3">
                                                <NhanTrangThai trangThai={ct.trangThai} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Trả Sách */}
            {moFormTra && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Ghi nhận trả sách</h3>
                        <form onSubmit={handleTraSach} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Chọn cuốn sách cần trả *</label>
                                <select
                                    value={chonChiTietId}
                                    onChange={(e) => setChonChiTietId(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">-- Chọn cuốn sách --</option>
                                    {danhSachDangMuon.map((ct) => (
                                        <option key={ct.id} value={ct.id}>
                                            {ct.tenSach || `Bản sao #${ct.banSaoSachId}`} (Mã vạch: {ct.maVach || "?"})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Tình trạng sách lúc trả *</label>
                                <select
                                    value={tinhTrangTra}
                                    onChange={(e) => setTinhTrangTra(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="TOT">Tốt – Không hư hỏng</option>
                                    <option value="CU">Cũ – Còn dùng được</option>
                                    <option value="HU_HONG">Hư hỏng – Tạo phiếu phạt 50.000đ</option>
                                    <option value="MAT">Làm mất – Tạo phiếu phạt 100.000đ</option>
                                </select>
                                {(tinhTrangTra === "HU_HONG" || tinhTrangTra === "MAT") && (
                                    <p className="mt-1 text-xs text-red-500">
                                        ⚠ Hệ thống sẽ tự động tạo phiếu phạt khi xác nhận.
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Ghi chú</label>
                                <input
                                    type="text"
                                    value={ghiChuTra}
                                    onChange={(e) => setGhiChuTra(e.target.value)}
                                    placeholder="Ghi chú thêm về tình trạng..."
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setMoFormTra(false)}
                                    className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
                                >
                                    Xác nhận trả sách
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

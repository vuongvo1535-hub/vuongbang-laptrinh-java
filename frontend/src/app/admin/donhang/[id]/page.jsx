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
    const [soTienPhat, setSoTienPhat] = useState(50000);
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
            const body = {
                chiTietPhieuMuonId: Number(chonChiTietId),
                tinhTrangLucTra: tinhTrangTra,
                ghiChu: ghiChuTra,
            };
            if (tinhTrangTra === "HU_HONG" || tinhTrangTra === "MAT") {
                body.soTienPhat = Number(soTienPhat) >= 0 ? Number(soTienPhat) : 0;
            }

            const res = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/tra`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Trả sách thất bại");
            alert(`Trả sách thành công! ${tinhTrangTra === "HU_HONG" ? `Đã tạo phiếu phạt làm hư sách: ${Number(soTienPhat || 0).toLocaleString("vi-VN")} ₫.` : tinhTrangTra === "MAT" ? `Đã tạo phiếu phạt làm mất sách: ${Number(soTienPhat || 0).toLocaleString("vi-VN")} ₫.` : ""}`);
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
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTinhTrangTra(val);
                                        if (val === "HU_HONG") setSoTienPhat(50000);
                                        else if (val === "MAT") setSoTienPhat(100000);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="TOT">Tốt – Không hư hỏng</option>
                                    <option value="CU">Cũ – Còn dùng được</option>
                                    <option value="HU_HONG">Hư hỏng sách (Tùy chỉnh số tiền phạt)</option>
                                    <option value="MAT">Làm mất sách (Tùy chỉnh số tiền phạt)</option>
                                </select>
                            </div>

                            {/* Ô TỰ CHỈNH SỐ TIỀN PHẠT KHI HƯ HỎNG HOẶC MẤT SÁCH */}
                            {(tinhTrangTra === "HU_HONG" || tinhTrangTra === "MAT") && (
                                <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-orange-950 font-bold text-xs uppercase tracking-wide">
                                            {tinhTrangTra === "HU_HONG" ? "🔧 Tiền phạt làm hư sách (VNĐ) *" : "❌ Tiền bồi thường mất sách (VNĐ) *"}
                                        </label>
                                        <span className="text-[11px] text-orange-700 italic">Thủ thư tự chỉnh</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            step="5000"
                                            value={soTienPhat}
                                            onChange={(e) => setSoTienPhat(e.target.value)}
                                            required
                                            className="w-full rounded-lg border border-orange-300 bg-white px-3 py-2 font-bold text-red-600 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                                            placeholder="Nhập số tiền phạt..."
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">VNĐ</span>
                                    </div>

                                    {/* Các nút chọn mức phạt nhanh */}
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="text-[11px] text-gray-500">Mức gợi ý:</span>
                                        {[20000, 30000, 50000, 70000, 100000, 150000, 200000].map((muc) => (
                                            <button
                                                key={muc}
                                                type="button"
                                                onClick={() => setSoTienPhat(muc)}
                                                className={`text-[11px] px-2 py-0.5 rounded border transition ${
                                                    Number(soTienPhat) === muc
                                                        ? "bg-orange-600 text-white border-orange-600 font-bold"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
                                                }`}
                                            >
                                                {muc.toLocaleString("vi-VN")}đ
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-[11px] text-orange-800">
                                        ⚠ Sẽ tạo phiếu phạt <b>{Number(soTienPhat || 0).toLocaleString("vi-VN")} ₫</b> vào tài khoản độc giả để thanh toán tiền mặt hoặc quét MoMo.
                                    </p>
                                </div>
                            )}
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

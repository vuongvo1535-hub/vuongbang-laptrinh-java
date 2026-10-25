"use client";

import { useEffect, useState } from "react";
import API_CONFIG from "@/config/api";
import { useRouter } from "next/navigation";

export default function TaoPhieuMuonPage() {
    const router = useRouter();
    const [docGiaId, setDocGiaId] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const [soNgayMuon, setSoNgayMuon] = useState(14);

    // Danh sách bản sao sách
    const [dsSach, setDsSach] = useState([]);
    const [timSach, setTimSach] = useState("");
    const [ketQuaTim, setKetQuaTim] = useState([]);
    const [banSaoChon, setBanSaoChon] = useState([]); // [{id, maVach, tenSach}]
    const [dangTimSach, setDangTimSach] = useState(false);

    const [dangTao, setDangTao] = useState(false);
    const [loi, setLoi] = useState("");
    const [theThuVien, setTheThuVien] = useState(null);

    // Kiểm tra thẻ thư viện của độc giả
    const kiemTraThe = async () => {
        if (!docGiaId) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/theThuVien/docGia/${docGiaId}`);
            if (res.ok) {
                const data = await res.json();
                setTheThuVien(data);
            } else {
                setTheThuVien(null);
            }
        } catch {
            setTheThuVien(null);
        }
    };

    // Tìm kiếm bản sao sách đang sẵn sàng
    const timKiemBanSao = async (e) => {
        e.preventDefault();
        if (!timSach.trim()) return;
        setDangTimSach(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/sach?tuKhoa=${encodeURIComponent(timSach)}`);
            if (res.ok) {
                const dsSachKQ = await res.json();
                const sachArr = Array.isArray(dsSachKQ) ? dsSachKQ : [];
                // Với mỗi sách, lấy bản sao sẵn sàng
                const ketQua = [];
                for (const sach of sachArr.slice(0, 5)) {
                    const r = await fetch(`${API_CONFIG.BASE_URL}/banSaoSach?sachId=${sach.id}`);
                    if (r.ok) {
                        const banSao = await r.json();
                        const sanSang = banSao.filter((b) => b.trangThai === "SAN_SANG");
                        if (sanSang.length > 0) {
                            ketQua.push({ sach, banSao: sanSang });
                        }
                    }
                }
                setKetQuaTim(ketQua);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDangTimSach(false);
        }
    };

    const themVaoGio = (banSao, tenSach) => {
        if (banSaoChon.length >= 5) {
            alert("Tối đa 5 cuốn sách mỗi phiếu mượn");
            return;
        }
        if (banSaoChon.find((x) => x.id === banSao.id)) {
            alert("Cuốn sách này đã được chọn rồi");
            return;
        }
        setBanSaoChon([...banSaoChon, { id: banSao.id, maVach: banSao.maVach, tenSach }]);
    };

    const xoaKhoiGio = (id) => {
        setBanSaoChon(banSaoChon.filter((x) => x.id !== id));
    };

    const handleTaoPhieu = async (e) => {
        e.preventDefault();
        if (!docGiaId) { setLoi("Vui lòng nhập ID độc giả"); return; }
        if (banSaoChon.length === 0) { setLoi("Vui lòng chọn ít nhất 1 cuốn sách"); return; }
        setDangTao(true);
        setLoi("");
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/muon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docGiaId: Number(docGiaId),
                    ghiChu,
                    soNgayMuon: Number(soNgayMuon),
                    banSaoSachIds: banSaoChon.map((x) => x.id),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Tạo phiếu mượn thất bại");
            alert(`Tạo phiếu mượn thành công! Mã phiếu: ${data.maPhieu}`);
            router.push("/admin/donhang");
        } catch (err) {
            setLoi("Lỗi: " + err.message);
        } finally {
            setDangTao(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">
                    ← Quay lại
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Tạo phiếu mượn sách mới</h1>
            </div>

            <form onSubmit={handleTaoPhieu} className="space-y-6">
                {/* Thông tin độc giả */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-700 mb-4">1. Thông tin độc giả</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">ID Độc giả *</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={docGiaId}
                                    onChange={(e) => setDocGiaId(e.target.value)}
                                    required
                                    placeholder="Nhập ID độc giả..."
                                    className="flex-1 rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={kiemTraThe}
                                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200 border border-gray-300"
                                >
                                    Kiểm tra thẻ
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Số ngày mượn</label>
                            <input
                                type="number"
                                value={soNgayMuon}
                                onChange={(e) => setSoNgayMuon(e.target.value)}
                                min="1" max="30"
                                className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {theThuVien && (
                        <div className={`mt-3 p-3 rounded-lg text-sm ${theThuVien.trangThai === "CON_HAN" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            <b>Thẻ thư viện:</b> {theThuVien.soThe} – Hạn đến: {new Date(theThuVien.ngayHetHan).toLocaleDateString("vi-VN")}
                            {" "}({theThuVien.trangThai === "CON_HAN" ? "✅ Còn hạn" : "❌ Hết hạn / Bị khóa"})
                        </div>
                    )}

                    <div className="mt-3">
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Ghi chú</label>
                        <input
                            type="text"
                            value={ghiChu}
                            onChange={(e) => setGhiChu(e.target.value)}
                            placeholder="Ghi chú thêm cho phiếu mượn..."
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none"
                        />
                    </div>
                </div>

                {/* Chọn sách */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-700 mb-4">2. Chọn sách cần mượn (tối đa 5 cuốn)</h2>

                    <form onSubmit={timKiemBanSao} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={timSach}
                            onChange={(e) => setTimSach(e.target.value)}
                            placeholder="Tìm tên sách để chọn bản sao..."
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            type="submit"
                            disabled={dangTimSach}
                            className="bg-emerald-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {dangTimSach ? "Đang tìm..." : "Tìm sách"}
                        </button>
                    </form>

                    {/* Kết quả tìm kiếm */}
                    {ketQuaTim.length > 0 && (
                        <div className="mb-4 space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2">
                            {ketQuaTim.map(({ sach, banSao }) => (
                                <div key={sach.id} className="p-2 rounded-lg hover:bg-gray-50">
                                    <p className="font-medium text-sm text-gray-800">{sach.tenSach}</p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {banSao.slice(0, 3).map((bs) => (
                                            <button
                                                key={bs.id}
                                                type="button"
                                                onClick={() => themVaoGio(bs, sach.tenSach)}
                                                disabled={!!banSaoChon.find((x) => x.id === bs.id)}
                                                className="text-xs px-2 py-1 rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                + {bs.maVach} ({bs.viTriKe || "Kệ A"})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sách đã chọn */}
                    {banSaoChon.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">Sách đã chọn ({banSaoChon.length}/5):</p>
                            {banSaoChon.map((bs, i) => (
                                <div key={bs.id} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2 text-sm border border-emerald-100">
                                    <span className="font-medium text-emerald-800">{i + 1}. {bs.tenSach}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 font-mono">{bs.maVach}</span>
                                        <button
                                            type="button"
                                            onClick={() => xoaKhoiGio(bs.id)}
                                            className="text-red-500 hover:text-red-700 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">Chưa chọn cuốn sách nào. Hãy tìm kiếm và chọn bên trên.</p>
                    )}
                </div>

                {loi && <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{loi}</p>}

                <button
                    type="submit"
                    disabled={dangTao || banSaoChon.length === 0}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {dangTao ? "Đang tạo phiếu mượn..." : `✅ Tạo phiếu mượn (${banSaoChon.length} cuốn sách)`}
                </button>
            </form>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_CONFIG from "@/config/api";

export default function ThemSachPage() {
    const router = useRouter();
    const [danhMuc, setDanhMuc] = useState([]);
    const [nhaXuatBan, setNhaXuatBan] = useState([]);
    const [dangLuu, setDangLuu] = useState(false);
    const [loi, setLoi] = useState("");
    const [urlAnh, setUrlAnh] = useState("");
    const [dangUpload, setDangUpload] = useState(false);

    const [form, setForm] = useState({
        maSach: "",
        tenSach: "",
        danhMucId: "",
        nhaXuatBanId: "",
        isbn: "",
        namXuatBan: new Date().getFullYear(),
        ngonNgu: "Tiếng Việt",
        moTa: "",
        giaTien: 0,
        soTrang: 200,
        anhBia: "",
        trangThai: "DANG_LUU_HANH",
    });

    useEffect(() => {
        async function taiDuLieu() {
            const [r1, r2] = await Promise.all([
                fetch(`${API_CONFIG.BASE_URL}/danhMuc`),
                fetch(`${API_CONFIG.BASE_URL}/nhaXuatBan`),
            ]);
            if (r1.ok) setDanhMuc(await r1.json());
            if (r2.ok) setNhaXuatBan(await r2.json());
        }
        taiDuLieu();
    }, []);

    const handleUploadAnh = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDangUpload(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
                method: "POST",
                body: fd,
            });
            if (res.ok) {
                const data = await res.json();
                const fullUrl = `http://localhost:8080${data.url}`;
                setUrlAnh(fullUrl);
                setForm({ ...form, anhBia: fullUrl });
            } else {
                alert("Tải ảnh thất bại, vui lòng thử lại");
            }
        } catch (err) {
            alert("Lỗi upload: " + err.message);
        } finally {
            setDangUpload(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.tenSach.trim()) { setLoi("Vui lòng nhập tên sách"); return; }
        if (!form.danhMucId) { setLoi("Vui lòng chọn danh mục sách"); return; }
        setDangLuu(true);
        setLoi("");
        try {
            const payload = {
                ...form,
                maSach: form.maSach.trim() || ("MS" + Date.now().toString().slice(-6)),
                danhMucId: Number(form.danhMucId),
                nhaXuatBanId: form.nhaXuatBanId ? Number(form.nhaXuatBanId) : null,
                namXuatBan: Number(form.namXuatBan),
                giaTien: Number(form.giaTien),
                soTrang: Number(form.soTrang),
                lanTaiBan: 1,
            };
            const res = await fetch(`${API_CONFIG.BASE_URL}/sach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Thêm sách thất bại");
            alert("Thêm sách thành công!");
            router.push("/admin/sanpham");
        } catch (err) {
            setLoi("Lỗi: " + err.message);
        } finally {
            setDangLuu(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-emerald-600">← Quay lại</button>
                <h1 className="text-2xl font-bold text-gray-800">Thêm sách mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-4 text-sm">
                {/* Ảnh bìa */}
                <div className="flex items-start gap-4">
                    <div className="w-24 h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                        {urlAnh ? (
                            <img src={urlAnh} alt="Ảnh bìa" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl">📚</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">Ảnh bìa sách</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadAnh}
                            className="block text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-medium hover:file:bg-emerald-100"
                        />
                        {dangUpload && <p className="text-xs text-emerald-600 mt-1">Đang tải ảnh lên...</p>}
                        <p className="text-xs text-gray-400 mt-1">Hoặc nhập URL ảnh trực tiếp:</p>
                        <input
                            type="text"
                            value={form.anhBia}
                            onChange={(e) => { setForm({ ...form, anhBia: e.target.value }); setUrlAnh(e.target.value); }}
                            placeholder="https://..."
                            className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tên sách *</label>
                        <input
                            type="text"
                            required
                            value={form.tenSach}
                            onChange={(e) => setForm({ ...form, tenSach: e.target.value })}
                            placeholder="Nhập tên đầy đủ của sách"
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Mã sách</label>
                        <input
                            type="text"
                            value={form.maSach}
                            onChange={(e) => setForm({ ...form, maSach: e.target.value })}
                            placeholder="Tự động tạo nếu để trống"
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Danh mục sách *</label>
                        <select
                            required
                            value={form.danhMucId}
                            onChange={(e) => setForm({ ...form, danhMucId: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {danhMuc.map((dm) => (
                                <option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nhà xuất bản</label>
                        <select
                            value={form.nhaXuatBanId}
                            onChange={(e) => setForm({ ...form, nhaXuatBanId: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        >
                            <option value="">-- Chọn NXB --</option>
                            {nhaXuatBan.map((nxb) => (
                                <option key={nxb.id} value={nxb.id}>{nxb.tenNhaXuatBan}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">ISBN</label>
                        <input
                            type="text"
                            value={form.isbn}
                            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                            placeholder="978-xxx-xxx-xxx-x"
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Năm xuất bản</label>
                        <input
                            type="number"
                            value={form.namXuatBan}
                            onChange={(e) => setForm({ ...form, namXuatBan: e.target.value })}
                            min="1900" max="2030"
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Số trang</label>
                        <input
                            type="number"
                            value={form.soTrang}
                            onChange={(e) => setForm({ ...form, soTrang: e.target.value })}
                            min="1"
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngôn ngữ</label>
                        <input
                            type="text"
                            value={form.ngonNgu}
                            onChange={(e) => setForm({ ...form, ngonNgu: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Mô tả / Tóm tắt nội dung</label>
                    <textarea
                        rows="3"
                        value={form.moTa}
                        onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                        placeholder="Mô tả ngắn về nội dung cuốn sách..."
                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                    />
                </div>

                {loi && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{loi}</p>}

                <div className="flex justify-end gap-3 pt-3 border-t">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={dangLuu}
                        className="rounded-lg bg-emerald-600 px-6 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {dangLuu ? "Đang lưu..." : "Lưu sách mới"}
                    </button>
                </div>
            </form>
        </div>
    );
}

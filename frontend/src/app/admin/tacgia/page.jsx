"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSearch, FiRefreshCw } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function TacGiaAdminPage() {
    const [dsTacGia, setDsTacGia] = useState([]);
    const [tuKhoa, setTuKhoa] = useState("");
    const [dangTai, setDangTai] = useState(true);
    const [moModal, setMoModal] = useState(false);
    const [form, setForm] = useState({
        tenTacGia: "",
        ngaySinh: "",
        quocTich: "Việt Nam",
        tieuSu: "",
    });

    const taiDanhSach = async () => {
        setDangTai(true);
        try {
            const url = tuKhoa.trim()
                ? `${API_CONFIG.BASE_URL}/tacGia?tuKhoa=${encodeURIComponent(tuKhoa.trim())}`
                : `${API_CONFIG.BASE_URL}/tacGia`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDsTacGia(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Lỗi tải tác giả:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDanhSach();
    }, []);

    const handleSubmitThem = async (e) => {
        e.preventDefault();
        if (!form.tenTacGia.trim()) {
            alert("Vui lòng nhập tên tác giả");
            return;
        }

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tacGia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                alert("Thêm tác giả thành công!");
                setMoModal(false);
                setForm({ tenTacGia: "", ngaySinh: "", quocTich: "Việt Nam", tieuSu: "" });
                taiDanhSach();
            } else {
                alert("Thêm tác giả thất bại");
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const handleXoa = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa tác giả này?")) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tacGia/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("Đã xóa tác giả thành công!");
                taiDanhSach();
            } else {
                alert("Không thể xóa tác giả (đang liên kết với sách)");
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Tác giả sách</h1>
                    <p className="text-sm text-gray-500">Danh sách các tác giả có sách lưu hành trong thư viện</p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); taiDanhSach(); }} className="flex">
                        <input
                            type="text"
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                            placeholder="Tìm tên tác giả..."
                            className="rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        />
                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-lg hover:bg-gray-200">
                            <FiSearch size={16} />
                        </button>
                    </form>

                    <button
                        onClick={() => setMoModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <FiPlus size={16} /> Thêm tác giả
                    </button>
                </div>
            </div>

            {dangTai ? (
                <div className="text-center py-12 text-gray-500">Đang tải danh sách tác giả...</div>
            ) : dsTacGia.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    Không tìm thấy tác giả nào.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Tên tác giả</th>
                                <th className="px-6 py-4">Quốc tịch</th>
                                <th className="px-6 py-4">Ngày sinh</th>
                                <th className="px-6 py-4">Tiểu sử</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dsTacGia.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-semibold text-gray-800">#{row.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{row.tenTacGia}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.quocTich || "Việt Nam"}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.ngaySinh || "-"}</td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{row.tieuSu || "Chưa có tiểu sử"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleXoa(row.id)}
                                            className="rounded p-2 text-red-600 hover:bg-red-50 transition"
                                            title="Xóa tác giả"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Thêm Tác Giả */}
            {moModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Thêm tác giả mới</h3>
                        <form onSubmit={handleSubmitThem} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Tên tác giả *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.tenTacGia}
                                    onChange={(e) => setForm({ ...form, tenTacGia: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Ví dụ: Nguyễn Nhật Ánh"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Quốc tịch</label>
                                    <input
                                        type="text"
                                        value={form.quocTich}
                                        onChange={(e) => setForm({ ...form, quocTich: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={form.ngaySinh}
                                        onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Tiểu sử tóm tắt</label>
                                <textarea
                                    rows="3"
                                    value={form.tieuSu}
                                    onChange={(e) => setForm({ ...form, tieuSu: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Thông tin ngắn về tác giả..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setMoModal(false)}
                                    className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
                                >
                                    Lưu tác giả
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

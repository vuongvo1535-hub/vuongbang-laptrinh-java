"use client";

import { useEffect, useState } from "react";
import {
    getDanhMucs,
    createDanhMuc,
    updateDanhMuc,
    deleteDanhMuc,
} from "@/services/admin/danhMucService";

export default function DanhMucAdminPage() {
    const [danhMucs, setDanhMucs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    // Modal thêm / sửa
    const [hienModal, setHienModal] = useState(false);
    const [dangSua, setDangSua] = useState(null); // null = thêm mới, object = sửa
    const [form, setForm] = useState({ tenDanhMuc: "", moTa: "" });
    const [luuDang, setLuuDang] = useState(false);

    // Lấy danh sách
    useEffect(() => {
        const tai = async () => {
            try {
                setLoading(true);
                const res = await getDanhMucs(1, 100);
                setDanhMucs(res.data || []);
            } catch (err) {
                console.error(err);
                alert("Không thể tải danh sách danh mục!");
            } finally {
                setLoading(false);
            }
        };
        tai();
    }, [refreshFlag]);

    // Mở modal thêm mới
    const moModalThem = () => {
        setDangSua(null);
        setForm({ tenDanhMuc: "", moTa: "" });
        setHienModal(true);
    };

    // Mở modal sửa
    const moModalSua = (item) => {
        setDangSua(item);
        setForm({
            tenDanhMuc: item.ten_danh_muc || item.tenDanhMuc || "",
            moTa: item.mo_ta || item.moTa || "",
        });
        setHienModal(true);
    };

    // Đóng modal
    const dongModal = () => {
        setHienModal(false);
        setDangSua(null);
        setForm({ tenDanhMuc: "", moTa: "" });
    };

    // Lưu (thêm hoặc sửa)
    const luuDanhMuc = async () => {
        if (!form.tenDanhMuc.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            setLuuDang(true);
            if (dangSua) {
                await updateDanhMuc(dangSua.id, form);
                alert("Cập nhật danh mục thành công!");
            } else {
                await createDanhMuc(form);
                alert("Thêm danh mục thành công!");
            }
            dongModal();
            setRefreshFlag((f) => f + 1);
        } catch (err) {
            console.error(err);
            alert(err.message || "Lưu danh mục thất bại!");
        } finally {
            setLuuDang(false);
        }
    };

    // Xóa danh mục
    const xoaDanhMuc = async (id, ten) => {
        if (!confirm(`Xóa danh mục "${ten}"? Thao tác này không thể hoàn tác!`)) return;

        try {
            await deleteDanhMuc(id);
            alert("Đã xóa danh mục!");
            setRefreshFlag((f) => f + 1);
        } catch (err) {
            console.error(err);
            alert(err.message || "Xóa danh mục thất bại! Có thể danh mục này đang có sách.");
        }
    };

    return (
        <div className="p-6">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục sách</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Thêm, sửa, xóa các danh mục phân loại sách.
                    </p>
                </div>
                <button
                    onClick={moModalThem}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium"
                >
                    + Thêm danh mục
                </button>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center text-gray-400">Đang tải dữ liệu...</div>
                ) : danhMucs.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-5 py-3 text-left">STT</th>
                                <th className="px-5 py-3 text-left">Tên danh mục</th>
                                <th className="px-5 py-3 text-left">Mô tả</th>
                                <th className="px-5 py-3 text-left">Số sách</th>
                                <th className="px-5 py-3 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {danhMucs.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                                    <td className="px-5 py-4 font-medium text-gray-800">
                                        {item.ten_danh_muc || item.tenDanhMuc || "—"}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {item.mo_ta || item.moTa || (
                                            <span className="text-gray-400 italic">Chưa có mô tả</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {item.soLuongSach ?? item.so_luong_sach ?? 0} sách
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => moModalSua(item)}
                                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    xoaDanhMuc(
                                                        item.id,
                                                        item.ten_danh_muc || item.tenDanhMuc
                                                    )
                                                }
                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal thêm/sửa danh mục */}
            {hienModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={dongModal}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-xl shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header modal */}
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {dangSua ? "Sửa danh mục" : "Thêm danh mục mới"}
                            </h2>
                            <button
                                onClick={dongModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Nội dung form */}
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.tenDanhMuc}
                                    onChange={(e) =>
                                        setForm({ ...form, tenDanhMuc: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    placeholder="VD: Văn học, Kỹ thuật..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={form.moTa}
                                    onChange={(e) =>
                                        setForm({ ...form, moTa: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                                    placeholder="Mô tả ngắn về danh mục này..."
                                />
                            </div>
                        </div>

                        {/* Footer modal */}
                        <div className="flex justify-end gap-3 border-t px-6 py-4">
                            <button
                                onClick={dongModal}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={luuDanhMuc}
                                disabled={luuDang}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-60"
                            >
                                {luuDang ? "Đang lưu..." : dangSua ? "Cập nhật" : "Thêm mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSanPhams, deleteSanPham } from "@/services/admin/sanPhamService";
import Pagination from "@/components/common/Pagination";
import API_CONFIG from "@/config/api";

const PAGE_SIZE = 10;

export default function SanPhamAdminPage() {
    const router = useRouter();
    const [danhSach, setDanhSach] = useState([]);
    const [tuKhoa, setTuKhoa] = useState("");
    const [trang, setTrang] = useState(1);
    const [tongTrang, setTongTrang] = useState(1);
    const [dangTai, setDangTai] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    useEffect(() => {
        async function tai() {
            setDangTai(true);
            try {
                const res = await getSanPhams(trang, PAGE_SIZE);
                setDanhSach(res.data || []);
                setTongTrang(res.last_page || 1);
            } catch (err) {
                console.error("Lỗi tải sách:", err);
            } finally {
                setDangTai(false);
            }
        }
        tai();
    }, [trang, refreshFlag]);

    const handleXoa = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sách này?")) return;
        try {
            await deleteSanPham(id);
            alert("Đã xóa sách thành công!");
            if (danhSach.length === 1 && trang > 1) {
                setTrang(trang - 1);
            } else {
                setRefreshFlag((f) => f + 1);
            }
        } catch (err) {
            alert(err.message || "Xóa thất bại!");
        }
    };

    const dinhDangGia = (gia) => Number(gia || 0).toLocaleString("vi-VN") + " ₫";

    const locTheoTuKhoa = danhSach.filter((row) =>
        !tuKhoa.trim() ||
        (row.ten_san_pham || row.tenSach || "").toLowerCase().includes(tuKhoa.toLowerCase()) ||
        (row.ma_san_pham || row.maSach || "").toLowerCase().includes(tuKhoa.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Sách thư viện</h1>
                    <p className="text-sm text-gray-500">Danh sách các đầu sách đang lưu hành</p>
                </div>
                <Link
                    href="/admin/sanpham/tao"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    + Thêm sách mới
                </Link>
            </div>

            {/* Tìm kiếm */}
            <div className="mb-5">
                <input
                    type="text"
                    value={tuKhoa}
                    onChange={(e) => setTuKhoa(e.target.value)}
                    placeholder="Lọc theo tên sách hoặc mã sách..."
                    className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            {dangTai ? (
                <div className="text-center py-12 text-gray-500">Đang tải danh sách sách...</div>
            ) : locTheoTuKhoa.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    Không tìm thấy sách nào.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                            <tr>
                                <th className="px-5 py-4">Ảnh bìa</th>
                                <th className="px-5 py-4">Tên sách</th>
                                <th className="px-5 py-4">Mã sách</th>
                                <th className="px-5 py-4">Danh mục</th>
                                <th className="px-5 py-4">Năm XB</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {locTheoTuKhoa.map((row) => {
                                const tenSach = row.ten_san_pham || row.tenSach || "";
                                const maSach = row.ma_san_pham || row.maSach || "";
                                const anhBia = row.hinh_anh_dai_dien || row.anhBia;
                                const trangThaiOK = row.trangThai === "DANG_LUU_HANH" || row.trang_thai === 1;
                                return (
                                    <tr key={row.id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4">
                                            {anhBia ? (
                                                <img
                                                    src={anhBia.startsWith("http") ? anhBia : `${API_CONFIG.IMAGE_URL}${anhBia}`}
                                                    alt={tenSach}
                                                    className="w-10 h-14 object-cover rounded shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">📚</div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900 max-w-xs">
                                            <p className="line-clamp-2">{tenSach}</p>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">{maSach}</td>
                                        <td className="px-5 py-4 text-gray-500">
                                            {row.danhMucId ? `Danh mục #${row.danhMucId}` : "-"}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{row.namXuatBan || "-"}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${trangThaiOK ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {trangThaiOK ? "Lưu hành" : "Ngừng"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link href={`/admin/sanpham/${row.id}`}>
                                                    <button className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600">
                                                        Sửa
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleXoa(row.id)}
                                                    className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {tongTrang > 1 && (
                <div className="mt-5 flex justify-center">
                    <Pagination currentPage={trang} pageCount={tongTrang} onPageChange={(p) => setTrang(p)} />
                </div>
            )}
        </div>
    );
}

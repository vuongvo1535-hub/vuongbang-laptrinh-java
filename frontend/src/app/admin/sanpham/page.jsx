"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSanPhams, deleteSanPham } from "@/services/admin/sanPhamService";
import { getDanhMucs } from "@/services/admin/danhMucService";
import Pagination from "@/components/common/Pagination";
import API_CONFIG from "@/config/api";
import { layDuongDanAnh } from "@/utils/format";

const PAGE_SIZE = 10;

export default function SanPhamAdminPage() {
    const router = useRouter();
    const [danhSach, setDanhSach] = useState([]);
    const [tuKhoa, setTuKhoa] = useState("");
    const [trang, setTrang] = useState(1);
    const [tongTrang, setTongTrang] = useState(1);
    const [dangTai, setDangTai] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [vaiTro, setVaiTro] = useState(null);
    const [danhMucLoc, setDanhMucLoc] = useState(null);
    const [mapDanhMuc, setMapDanhMuc] = useState({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem("admin_user");
            if (raw) {
                const u = JSON.parse(raw);
                setVaiTro(u.vaiTro);
            }
        } catch {}

        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const dm = params.get("danh_muc");
            if (dm) setDanhMucLoc(dm);
        }
    }, []);

    useEffect(() => {
        getDanhMucs(1, 100)
            .then((res) => {
                const map = {};
                (res?.data || []).forEach((dm) => {
                    map[String(dm.id)] = dm.tenDanhMuc || dm.ten_danh_muc;
                });
                setMapDanhMuc(map);
            })
            .catch(() => {});
    }, []);

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
        if (vaiTro !== "QUAN_TRI") {
            alert("Chỉ Quản trị viên mới có quyền xóa sách khỏi hệ thống!");
            return;
        }
        if (!confirm("Bạn có chắc muốn xóa sách này? Thao tác này sẽ xóa vĩnh viễn sách và ảnh hưởng các bản sao!")) return;
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

    const locTheoTuKhoa = danhSach.filter((row) => {
        const rowDmId = String(row.danhMucId || row.danh_muc_id || "");
        const matchDm = !danhMucLoc || rowDmId === String(danhMucLoc);
        const matchTuKhoa = !tuKhoa.trim() ||
            (row.ten_san_pham || row.tenSach || "").toLowerCase().includes(tuKhoa.toLowerCase()) ||
            (row.ma_san_pham || row.maSach || "").toLowerCase().includes(tuKhoa.toLowerCase());
        return matchDm && matchTuKhoa;
    });

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sách thư viện</h1>
                        {vaiTro === "QUAN_TRI" ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                🛡️ Quyền Admin
                            </span>
                        ) : (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                📖 Nghiệp vụ Thủ thư
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {vaiTro === "QUAN_TRI"
                            ? "Toàn quyền quản lý, thêm mới, sửa và xóa đầu sách khỏi cơ sở dữ liệu."
                            : "Tra cứu, kiểm tra bản sao, cập nhật thông tin sách đang lưu hành."}
                    </p>
                </div>
                <Link
                    href="/admin/sanpham/tao"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
                >
                    + Thêm sách mới
                </Link>
            </div>

            {/* Banner hiển thị khi đang lọc theo danh mục */}
            {danhMucLoc && (
                <div className="flex items-center gap-3 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-sm w-fit">
                    <span>
                        Đang xem sách thuộc danh mục: <strong className="text-emerald-800">{mapDanhMuc[String(danhMucLoc)] || `#${danhMucLoc}`}</strong>
                    </span>
                    <button
                        onClick={() => {
                            setDanhMucLoc(null);
                            router.replace("/admin/sanpham");
                        }}
                        className="text-xs bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-bold px-2.5 py-1 rounded-lg transition"
                    >
                        ✕ Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* Tìm kiếm */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    value={tuKhoa}
                    onChange={(e) => setTuKhoa(e.target.value)}
                    placeholder="Lọc theo tên sách hoặc mã sách..."
                    className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {danhMucLoc && (
                    <span className="text-xs text-gray-500">
                        (Đã tìm thấy {locTheoTuKhoa.length} sách trong danh mục này)
                    </span>
                )}
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
                                                    src={layDuongDanAnh(anhBia)}
                                                    alt={tenSach}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `http://localhost:8080/shop/images/sach/${anhBia}`;
                                                    }}
                                                    className="w-10 h-14 object-cover rounded shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-semibold">📚</div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900 max-w-xs">
                                            <p className="line-clamp-2">{tenSach}</p>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">{maSach}</td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {row.danhMucId ? (
                                                <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                                                    {mapDanhMuc[String(row.danhMucId)] || `Danh mục #${row.danhMucId}`}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Chưa phân loại</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{row.namXuatBan || "-"}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${trangThaiOK ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {trangThaiOK ? "Lưu hành" : "Ngừng"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Link href={`/admin/sanpham/${row.id}`}>
                                                    <button className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition">
                                                        Sửa
                                                    </button>
                                                </Link>
                                                {/* Phân quyền: Chỉ Quản trị viên mới có nút Xóa sách */}
                                                {vaiTro === "QUAN_TRI" ? (
                                                    <button
                                                        onClick={() => handleXoa(row.id)}
                                                        className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                                                        title="Xóa sách (Chỉ Admin)"
                                                    >
                                                        Xóa
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400 italic px-1">
                                                        (Khóa xóa)
                                                    </span>
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

            {tongTrang > 1 && (
                <div className="mt-5 flex justify-center">
                    <Pagination currentPage={trang} pageCount={tongTrang} onPageChange={(p) => setTrang(p)} />
                </div>
            )}
        </div>
    );
}

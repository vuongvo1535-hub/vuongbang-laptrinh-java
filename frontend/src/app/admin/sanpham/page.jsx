"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/Table/AdminTable";
import Pagination from "@/components/common/Pagination";
import { getSanPhams, deleteSanPham } from "@/services/admin/sanPhamService";

const PAGE_SIZE = 10;
const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/";

// Hinh la link day du (http...) thi dung luon, nguoc lai ghep voi IMAGE_BASE_URL
const layAnh = (path) =>
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

const dinhDangGia = (gia) => Number(gia || 0).toLocaleString("vi-VN") + " ₫";

export default function SanPhamAdminPage() {
    const [sanPhams, setSanPhams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    const handleDelete = async (id) => {
        if (!confirm("Chuyển sản phẩm này vào thùng rác?")) return;

        try {
            await deleteSanPham(id);
            alert("Đã chuyển sản phẩm vào thùng rác");

            // Trang hien tai chi con 1 dong thi lui ve trang truoc
            if (sanPhams.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setRefreshFlag((f) => f + 1);
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Chuyển vào thùng rác thất bại!");
        }
    };

    const columns = [
        { key: "id", label: "ID" },

        {
            key: "hinh_anh_dai_dien",
            label: "Ảnh",
            render: (row) =>
                row.hinh_anh_dai_dien ? (
                    <img
                        src={layAnh(row.hinh_anh_dai_dien)}
                        alt={row.ten_san_pham}
                        className="w-12 h-12 object-cover rounded-md"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">Không có ảnh</span>
                ),
        },

        { key: "ten_san_pham", label: "Sản phẩm" },

        { key: "duong_dan", label: "Đường dẫn" },

        {
            key: "danh_muc",
            label: "Danh mục",
            render: (row) => row.danh_muc?.ten_danh_muc || "-",
        },

        {
            key: "thuong_hieu",
            label: "Thương hiệu",
            render: (row) => row.thuong_hieu?.ten_thuong_hieu || "-",
        },

        {
            key: "gia",
            label: "Giá",
            render: (row) => (
                <div>
                    <div>{dinhDangGia(row.gia)}</div>
                    {row.gia_khuyen_mai && (
                        <div className="text-xs text-red-600">
                            KM: {dinhDangGia(row.gia_khuyen_mai)}
                        </div>
                    )}
                </div>
            ),
        },

        {
            key: "so_luong_ton",
            label: "Tồn kho",
            render: (row) => row.so_luong_ton ?? 0,
        },

        {
            key: "trang_thai",
            label: "Trạng thái",
            render: (row) =>
                Number(row.trang_thai) === 1 ? (
                    <span className="text-green-600 font-semibold">Hiển thị</span>
                ) : (
                    <span className="text-red-600 font-semibold">Ẩn</span>
                ),
        },

        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <div className="flex gap-2 justify-center">
                    <Link href={`/admin/sanpham/${row.id}`}>
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                            Sửa
                        </button>
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchSanPhams = async () => {
            try {
                setLoading(true);

                const res = await getSanPhams(currentPage, PAGE_SIZE);

                setSanPhams(res.data || []);
                // API tra ve paginator cua Laravel: last_page nam o ngoai cung
                setPageCount(res.last_page || res.meta?.last_page || 1);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSanPhams();
    }, [currentPage, refreshFlag]);

    if (loading) {
        return (
            <div className="text-center py-10">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Quản lý sản phẩm
                </h1>

                <div className="flex gap-3">
                    <Link href="/admin/sanpham/trash">
                        <button className="bg-gray-600 text-white px-5 py-2 rounded-lg">
                            🗑 Thùng rác
                        </button>
                    </Link>

                    <Link href="/admin/sanpham/create">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                            + Thêm sản phẩm
                        </button>
                    </Link>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={sanPhams}
            />

            {pageCount > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
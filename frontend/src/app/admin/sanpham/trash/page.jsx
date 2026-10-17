"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/Table/AdminTable";
import Pagination from "@/components/common/Pagination";
import {
    getSanPhamThungRac,
    khoiPhucSanPham,
    xoaVinhVienSanPham,
} from "@/services/admin/sanPhamService";

const PAGE_SIZE = 10;
const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/";

// Hinh la link day du (http...) thi dung luon, nguoc lai ghep voi IMAGE_BASE_URL
const layAnh = (path) =>
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

const dinhDangGia = (gia) => Number(gia || 0).toLocaleString("vi-VN") + " ₫";

const dinhDangNgay = (value) =>
    value ? new Date(value).toLocaleString("vi-VN") : "-";

export default function SanPhamThungRacPage() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    // Sau khi khoi phuc / xoa: neu trang hien tai het du lieu thi lui ve trang truoc
    const taiLaiSauKhiDoi = () => {
        if (items.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setRefreshFlag((f) => f + 1);
        }
    };

    const handleRestore = async (id) => {
        if (!confirm("Khôi phục sản phẩm này?")) return;

        try {
            const res = await khoiPhucSanPham(id);
            alert(res.message || "Khôi phục thành công");
            taiLaiSauKhiDoi();
        } catch (err) {
            console.error(err);
            alert(err.message || "Khôi phục thất bại!");
        }
    };

    const handleForceDelete = async (id) => {
        if (
            !confirm(
                "XÓA VĨNH VIỄN sản phẩm này?\nHành động này không thể hoàn tác."
            )
        )
            return;

        try {
            const res = await xoaVinhVienSanPham(id);
            alert(res.message || "Xóa vĩnh viễn thành công");
            taiLaiSauKhiDoi();
        } catch (err) {
            console.error(err);
            alert(err.message || "Xóa vĩnh viễn thất bại!");
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
            render: (row) => dinhDangGia(row.gia),
        },

        {
            key: "deleted_at",
            label: "Ngày xóa",
            render: (row) => dinhDangNgay(row.deleted_at),
        },

        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => handleRestore(row.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                        Khôi phục
                    </button>
                    <button
                        onClick={() => handleForceDelete(row.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        Xóa vĩnh viễn
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchThungRac = async () => {
            try {
                setLoading(true);

                const res = await getSanPhamThungRac(currentPage, PAGE_SIZE);

                setItems(res.data || []);
                setPageCount(res.meta?.last_page || res.last_page || 1);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchThungRac();
    }, [currentPage, refreshFlag]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Thùng rác sản phẩm
                </h1>

                <Link href="/admin/sanpham">
                    <button className="bg-gray-600 text-white px-5 py-2 rounded-lg">
                        ← Quay lại danh sách
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    Đang tải dữ liệu...
                </div>
            ) : (
                <AdminTable columns={columns} data={items} />
            )}

            {!loading && pageCount > 1 && (
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
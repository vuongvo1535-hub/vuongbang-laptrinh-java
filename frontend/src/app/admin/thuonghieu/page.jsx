"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/Table/AdminTable";
import Pagination from "@/components/common/Pagination";
import { getThuongHieus, deleteThuongHieu } from "@/services/admin/thuongHieuService";

const PAGE_SIZE = 10;
const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/";


const layAnh = (path) =>
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function ThuongHieuAdminPage() {
    const [thuongHieus, setThuongHieus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    const handleDelete = async (id) => {
        if (!confirm("Chuyển thương hiệu này vào thùng rác?")) return;

        try {
            await deleteThuongHieu(id);
            alert("Đã chuyển thương hiệu vào thùng rác");

            // Trang hien tai chi con 1 dong thi lui ve trang truoc
            if (thuongHieus.length === 1 && currentPage > 1) {
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
            key: "logo",
            label: "Logo",
            render: (row) =>
                row.logo ? (
                    <img
                        src={layAnh(row.logo)}
                        alt={row.ten_thuong_hieu}
                        className="w-12 h-12 object-cover rounded-md"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">Không có ảnh</span>
                ),
        },

        { key: "ten_thuong_hieu", label: "Tên thương hiệu" },

        { key: "duong_dan", label: "Đường dẫn" },

        {
            key: "mo_ta",
            label: "Mô tả",
            render: (row) => row.mo_ta || "-",
        },

        {
            key: "so_luong_san_pham",
            label: "Số sản phẩm",
            render: (row) => row.so_luong_san_pham ?? 0,
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
                    <Link href={`/admin/thuonghieu/${row.id}`}>
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
        const fetchThuongHieus = async () => {
            try {
                setLoading(true);

                const res = await getThuongHieus(currentPage, PAGE_SIZE);

                setThuongHieus(res.data || []);
                setPageCount(res.meta?.last_page || 1);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchThuongHieus();
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
                    Quản lý thương hiệu
                </h1>

                <div className="flex gap-3">
                    <Link href="/admin/thuonghieu/trash">
                        <button className="bg-gray-600 text-white px-5 py-2 rounded-lg">
                            🗑 Thùng rác
                        </button>
                    </Link>

                    <Link href="/admin/thuonghieu/create">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                            + Thêm thương hiệu
                        </button>
                    </Link>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={thuongHieus}
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
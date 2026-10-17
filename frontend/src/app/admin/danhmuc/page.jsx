"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/Table/AdminTable";
import Pagination from "@/components/common/Pagination";
import { getDanhMucs, deleteDanhMuc } from "@/services/admin/danhMucService";

const PAGE_SIZE = 10;
const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/";

// Hinh la link day du (http...) thi dung luon, nguoc lai ghep voi IMAGE_BASE_URL
const layAnh = (path) =>
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function DanhMucAdminPage() {
    const [danhMucs, setDanhMucs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(0);

    const handleDelete = async (id) => {
        if (!confirm("Chuyển danh mục này vào thùng rác?")) return;

        try {
            await deleteDanhMuc(id);
            alert("Đã chuyển danh mục vào thùng rác");

            // Trang hien tai chi con 1 dong thi lui ve trang truoc
            if (danhMucs.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                setRefreshFlag((f) => f + 1);
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Chuyển vào thùng rác thất bại!");
        }
    };

    const isRoot = (row) => !row.danh_muc_cha_id;

    const columns = [
        { key: "id", label: "ID" },

        {
            key: "hinh_anh",
            label: "Ảnh",
            render: (row) =>
                row.hinh_anh ? (
                    <img
                        src={layAnh(row.hinh_anh)}
                        alt={row.ten_danh_muc}
                        className="w-12 h-12 object-cover rounded-md"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">Không có ảnh</span>
                ),
        },

        { key: "ten_danh_muc", label: "Tên danh mục" },

        { key: "duong_dan", label: "Đường dẫn" },

        {
            key: "danh_muc_cha",
            label: "Loại / Danh mục cha",
            render: (row) =>
                isRoot(row) ? (
                    <span className="text-gray-500">Danh mục gốc</span>
                ) : (
                    <span className="text-gray-700">
                        Con của:{" "}
                        <span className="font-medium">
                            {row.danh_muc_cha?.ten_danh_muc || "-"}
                        </span>
                    </span>
                ),
        },

        {
            key: "thu_tu",
            label: "Thứ tự",
            render: (row) => row.thu_tu ?? 0,
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
                    <Link href={`/admin/danhmuc/${row.id}`}>
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
        const fetchDanhMucs = async () => {
            try {
                setLoading(true);

                const res = await getDanhMucs(currentPage, PAGE_SIZE);

                setDanhMucs(res.data || []);
                setPageCount(res.meta?.last_page || 1);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDanhMucs();
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
                    Quản lý danh mục
                </h1>

                <div className="flex gap-3">
                    <Link href="/admin/danhmuc/trash">
                        <button className="bg-gray-600 text-white px-5 py-2 rounded-lg">
                            🗑 Thùng rác
                        </button>
                    </Link>

                    <Link href="/admin/danhmuc/create">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                            + Thêm danh mục
                        </button>
                    </Link>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={danhMucs}
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
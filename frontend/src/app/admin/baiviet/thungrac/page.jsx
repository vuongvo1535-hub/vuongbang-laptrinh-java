"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getThungRacBaiViet,
    khoiPhucBaiViet,
    xoaVinhVienBaiViet,
} from "@/services/admin/baiVietService";

// Trang quản lý bài viết đã xóa mềm.
export default function ThungRacBaiVietPage() {
    const [baiViets, setBaiViets] = useState([]);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [soTrang, setSoTrang] = useState(1);
    const [dangTai, setDangTai] = useState(false);
    const [loi, setLoi] = useState("");

    // Lấy dữ liệu thùng rác theo trang.
    async function taiThungRac(trang = 1) {
        setDangTai(true);
        setLoi("");

        try {
            const data = await getThungRacBaiViet(trang);

            setBaiViets(data.data || []);
            setTrangHienTai(data.current_page || 1);
            setSoTrang(data.last_page || 1);
        } catch (error) {
            setLoi(error.message);
        } finally {
            setDangTai(false);
        }
    }

    // Tải thùng rác khi mở trang.
    // Tải danh sách thùng rác khi mở trang.
    useEffect(() => {
        let daHuy = false;

        async function taiDuLieuBanDau() {
            try {
                // Gọi API lấy các bài viết đã xóa mềm.
                const data = await getThungRacBaiViet(1);

                // Chỉ cập nhật dữ liệu nếu trang vẫn còn hoạt động.
                if (!daHuy) {
                    setBaiViets(data.data || []);
                    setTrangHienTai(data.current_page || 1);
                    setSoTrang(data.last_page || 1);
                }
            } catch (error) {
                if (!daHuy) {
                    setLoi(error.message);
                }
            }
        }

        taiDuLieuBanDau();

        // Hủy cập nhật state khi component bị gỡ.
        return () => {
            daHuy = true;
        };
    }, []);

    // Khôi phục bài viết đã xóa mềm.
    async function xuLyKhoiPhuc(id) {
        if (!window.confirm("Bạn muốn khôi phục bài viết này?")) {
            return;
        }

        try {
            await khoiPhucBaiViet(id);
            alert("Khôi phục bài viết thành công.");

            // Tải lại trang hiện tại.
            taiThungRac(trangHienTai);
        } catch (error) {
            alert(error.message);
        }
    }

    // Xóa bài viết vĩnh viễn khỏi database.
    async function xuLyXoaVinhVien(id) {
        if (
            !window.confirm(
                "Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục. Tiếp tục?"
            )
        ) {
            return;
        }

        try {
            await xoaVinhVienBaiViet(id);
            alert("Đã xóa vĩnh viễn bài viết.");

            // Tải lại thùng rác sau khi xóa.
            taiThungRac(trangHienTai);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="p-6">
            {/* Tiêu đề và nút quay lại. */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">
                    Thùng rác bài viết
                </h1>

                <Link
                    href="/admin/baiviet"
                    className="rounded border px-4 py-2"
                >
                    Quay lại danh sách
                </Link>
            </div>

            <p className="mb-4 text-gray-600">
                Bài viết trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn.
            </p>

            {dangTai && <p>Đang tải dữ liệu...</p>}
            {loi && <p className="mb-3 text-red-600">{loi}</p>}

            {/* Bảng bài viết đã xóa mềm. */}
            <div className="overflow-x-auto rounded border">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-3">ID</th>
                            <th className="border p-3">Tiêu đề</th>
                            <th className="border p-3">Ngày xóa</th>
                            <th className="border p-3">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!dangTai && baiViets.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border p-4 text-center"
                                >
                                    Thùng rác đang trống.
                                </td>
                            </tr>
                        )}

                        {baiViets.map((baiViet) => (
                            <tr key={baiViet.id}>
                                <td className="border p-3">
                                    {baiViet.id}
                                </td>

                                <td className="border p-3">
                                    {baiViet.tieu_de}
                                </td>

                                <td className="border p-3">
                                    {baiViet.deleted_at
                                        ? new Date(
                                            baiViet.deleted_at
                                        ).toLocaleString("vi-VN")
                                        : ""}
                                </td>

                                <td className="border p-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                xuLyKhoiPhuc(baiViet.id)
                                            }
                                            className="rounded bg-green-600 px-3 py-1 text-white"
                                        >
                                            Khôi phục
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                xuLyXoaVinhVien(baiViet.id)
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-white"
                                        >
                                            Xóa vĩnh viễn
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang thùng rác. */}
            <div className="mt-4 flex items-center justify-center gap-4">
                <button
                    type="button"
                    disabled={trangHienTai <= 1 || dangTai}
                    onClick={() => taiThungRac(trangHienTai - 1)}
                    className="rounded border px-4 py-2 disabled:opacity-40"
                >
                    Trang trước
                </button>

                <span>
                    Trang {trangHienTai} / {soTrang}
                </span>

                <button
                    type="button"
                    disabled={trangHienTai >= soTrang || dangTai}
                    onClick={() => taiThungRac(trangHienTai + 1)}
                    className="rounded border px-4 py-2 disabled:opacity-40"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}
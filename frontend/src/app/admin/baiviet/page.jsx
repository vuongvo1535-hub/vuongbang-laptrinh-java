
"use client";

// Import hook React để quản lý dữ liệu và gọi API.
import { useEffect, useState } from "react";

// Import Link để chuyển trang trong Next.js.
import Link from "next/link";

// Import bảng quản trị dùng chung.
import AdminTable from "@/components/admin/Table/AdminTable";

// Import phân trang dùng chung.
import Pagination from "@/components/common/Pagination";

// Import các hàm gọi API bài viết.
import {
    getBaiViets,
    xoaBaiViet,
} from "@/services/admin/baiVietService";

export default function BaiVietPage() {
    // Danh sách bài viết lấy từ Laravel.
    const [baiViets, setBaiViets] = useState([]);

    // Từ khóa tìm kiếm bài viết.
    const [tuKhoa, setTuKhoa] = useState("");

    // Trang hiện tại và tổng số trang.
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [soTrang, setSoTrang] = useState(1);

    // Trạng thái tải dữ liệu và thông báo lỗi.
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    // Hàm lấy danh sách bài viết theo trang và từ khóa.
    async function taiDanhSach(trang = 1, tuKhoaTim = tuKhoa) {
        setDangTai(true);
        setLoi("");

        try {
            // Gọi API lấy dữ liệu bài viết.
            const ketQua = await getBaiViets(trang, tuKhoaTim);

            // Cập nhật danh sách và thông tin phân trang.
            setBaiViets(ketQua.data || []);
            setTrangHienTai(ketQua.current_page || 1);
            setSoTrang(ketQua.last_page || 1);
        } catch (error) {
            // Hiển thị lỗi nếu API thất bại.
            setLoi(error.message || "Không tải được danh sách bài viết.");
        } finally {
            // Kết thúc trạng thái tải dữ liệu.
            setDangTai(false);
        }
    }

    // Tải dữ liệu lần đầu khi mở trang.
    useEffect(() => {
        let daHuy = false;

        async function taiDuLieuBanDau() {
            try {
                const ketQua = await getBaiViets(1, "");

                // Chỉ cập nhật nếu trang chưa bị đóng.
                if (!daHuy) {
                    setBaiViets(ketQua.data || []);
                    setTrangHienTai(ketQua.current_page || 1);
                    setSoTrang(ketQua.last_page || 1);
                }
            } catch (error) {
                // Lưu thông báo lỗi khi không tải được dữ liệu.
                if (!daHuy) {
                    setLoi(
                        error.message || "Không tải được danh sách bài viết."
                    );
                }
            } finally {
                // Đánh dấu đã tải xong nếu trang vẫn hoạt động.
                if (!daHuy) {
                    setDangTai(false);
                }
            }
        }

        taiDuLieuBanDau();

        // Tránh cập nhật state khi component đã bị gỡ.
        return () => {
            daHuy = true;
        };
    }, []);

    // Xử lý tìm kiếm và đưa kết quả về trang đầu tiên.
    function xuLyTimKiem(event) {
        event.preventDefault();
        taiDanhSach(1, tuKhoa);
    }

    // Chuyển bài viết vào thùng rác.
    async function xuLyXoa(id) {
        const dongY = window.confirm(
            "Bạn có chắc muốn chuyển bài viết này vào thùng rác?"
        );

        // Dừng nếu người dùng chọn Hủy.
        if (!dongY) return;

        try {
            // Gọi API xóa mềm bài viết.
            await xoaBaiViet(id);

            window.alert("Đã chuyển bài viết vào thùng rác.");

            // Tải lại danh sách sau khi xóa.
            const trangTaiLai =
                baiViets.length === 1 && trangHienTai > 1
                    ? trangHienTai - 1
                    : trangHienTai;

            await taiDanhSach(trangTaiLai, tuKhoa);
        } catch (error) {
            // Thông báo nếu xóa thất bại.
            window.alert(error.message || "Không thể xóa bài viết.");
        }
    }

    // Cấu hình các cột cho AdminTable.
    const columns = [
        {
            key: "id",
            label: "ID",
        },
        {
            key: "tieu_de",
            label: "Tiêu đề",
        },
        {
            key: "chu_de",
            label: "Chủ đề",

            // Lấy tên chủ đề từ quan hệ chuDe.
            render: (baiViet) =>
                baiViet.chu_de?.ten_chu_de || "Chưa có",
        },
        {
            key: "luot_xem",
            label: "Lượt xem",

            // Hiển thị 0 nếu chưa có lượt xem.
            render: (baiViet) => baiViet.luot_xem ?? 0,
        },
        {
            key: "trang_thai",
            label: "Trạng thái",

            // Hiển thị trạng thái bằng chữ.
            render: (baiViet) =>
                Number(baiViet.trang_thai) === 1
                    ? "Đang hiển thị"
                    : "Ẩn",
        },
        // Cột thao tác: xem chi tiết, sửa và xóa bài viết
        {
            key: "thao_tac",
            label: "Thao tác",
            render: (baiViet) => (
                <div className="flex gap-3">
                    {/* Mở trang xem chi tiết bài viết */}
                    <Link
                        href={`/admin/baiviet/${baiViet.id}`}
                        className="text-blue-600 hover:underline"
                    >
                        Xem
                    </Link>

                    {/* Mở trang sửa bài viết */}
                    <Link
                        href={`/admin/baiviet/edit/${baiViet.id}`}
                        className="text-green-600 hover:underline"
                    >
                        Sửa
                    </Link>

                    {/* Xóa bài viết vào thùng rác */}
                    <button
                        onClick={() => xuLyXoa(baiViet.id)}
                        className="text-red-600 hover:underline"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Tiêu đề và các nút chức năng. */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">
                    Quản lý bài viết
                </h1>

                <div className="flex flex-wrap gap-2">
                    {/* Mở trang thêm bài viết. */}
                    <Link
                        href="/admin/baiviet/create"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Thêm bài viết
                    </Link>

                    {/* Mở trang thùng rác. */}
                    <Link
                        href="/admin/baiviet/thungrac"
                        className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                    >
                        Thùng rác
                    </Link>
                </div>
            </div>

            {/* Form tìm kiếm bài viết. */}
            <form
                onSubmit={xuLyTimKiem}
                className="mb-4 flex flex-wrap gap-2"
            >
                <input
                    type="text"
                    value={tuKhoa}
                    onChange={(event) => setTuKhoa(event.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full max-w-md rounded border px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={dangTai}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Tìm kiếm
                </button>
            </form>

            {/* Hiển thị thông báo lỗi API. */}
            {loi && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                    {loi}
                </div>
            )}

            {/* Hiển thị trạng thái tải vì AdminTable chưa nhận props loading. */}
            {dangTai && (
                <p className="mb-3 text-gray-500">
                    Đang tải danh sách bài viết...
                </p>
            )}

            {/* Bảng bài viết dùng component AdminTable hiện có. */}
            {!dangTai && (
                <AdminTable
                    columns={columns}
                    data={baiViets}
                />
            )}

            {/* Phân trang dùng component Pagination hiện có. */}
            {!loi && !dangTai && soTrang > 1 && (
                <Pagination
                    currentPage={trangHienTai}
                    pageCount={soTrang}
                    onPageChange={(trangMoi) =>
                        taiDanhSach(trangMoi, tuKhoa)
                    }
                />
            )}
        </div>
    );
}
/* eslint-disable @next/next/no-img-element */

"use client";

// Import thư viện và cấu hình đã có trong dự án
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import API_CONFIG from "@/config/api";
import { getBaiViet } from "@/services/admin/baiVietService";

// Chuẩn hóa ngày giờ theo định dạng Việt Nam
function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa cập nhật";

    const giaTriNgay = new Date(ngay);

    if (Number.isNaN(giaTriNgay.getTime())) {
        return "Không xác định";
    }

    return giaTriNgay.toLocaleString("vi-VN");
}

// Tạo đường dẫn ảnh từ cấu hình API hiện có
function layDuongDanAnh(duongDan) {
    if (!duongDan) return "";

    // Nếu database đã lưu URL đầy đủ thì sử dụng trực tiếp
    if (/^https?:\/\//i.test(duongDan)) {
        return duongDan;
    }

    // Lấy địa chỉ máy chủ từ API_CONFIG, loại bỏ /api ở cuối
    const mayChu = API_CONFIG.BASE_URL.replace(/\/api\/?$/, "");

    // Ghép đường dẫn ảnh trong thư mục storage của Laravel
    return `${mayChu}/storage/${duongDan.replace(/^\/+/, "")}`;
}

// Trang xem chi tiết bài viết
export default function ChiTietBaiVietPage() {
    // Lấy ID bài viết trên URL, ví dụ /admin/baiviet/1
    const params = useParams();
    const id = params.id;

    // Lưu dữ liệu, trạng thái tải và lỗi
    const [baiViet, setBaiViet] = useState(null);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    // Tải chi tiết bài viết khi ID thay đổi
    useEffect(() => {
        let daHuy = false;

        async function taiChiTiet() {
            setDangTai(true);
            setLoi("");
            setBaiViet(null);

            try {
                // Gọi service đã có, không gọi API trực tiếp tại component
                const duLieu = await getBaiViet(id);

                if (!daHuy) {
                    setBaiViet(duLieu);
                }
            } catch (error) {
                if (!daHuy) {
                    setLoi(
                        error.message || "Không thể tải chi tiết bài viết."
                    );
                }
            } finally {
                if (!daHuy) {
                    setDangTai(false);
                }
            }
        }

        if (id) {
            taiChiTiet();
        }

        // Tránh cập nhật state khi component đã bị gỡ
        return () => {
            daHuy = true;
        };
    }, [id]);

    // Giao diện đang tải
    if (dangTai) {
        return (
            <div className="p-6">
                <p className="text-gray-600">
                    Đang tải chi tiết bài viết...
                </p>
            </div>
        );
    }

    // Giao diện báo lỗi
    if (loi || !baiViet) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-white p-6">
                    <h1 className="text-xl font-bold text-red-600">
                        Không thể tải bài viết
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {loi || "Không tìm thấy bài viết."}
                    </p>

                    <Link
                        href="/admin/baiviet"
                        className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    // Chuẩn hóa dữ liệu trước khi hiển thị
    const dangHienThi = Number(baiViet.trang_thai) === 1;
    const duongDanAnh = layDuongDanAnh(baiViet.hinh_anh_dai_dien);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Tiêu đề và nút thao tác */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chi tiết bài viết
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Mã bài viết: #{baiViet.id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Quay lại trang danh sách */}
                    <Link
                        href="/admin/baiviet"
                        className="rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        ← Danh sách
                    </Link>

                    {/* Mở trang chỉnh sửa bài viết */}
                    <Link
                        href={`/admin/baiviet/edit/${baiViet.id}`}
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        Sửa bài viết
                    </Link>
                </div>
            </div>

            {/* Các thẻ thống kê nhanh */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Mã bài viết</p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                        #{baiViet.id}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Lượt xem</p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                        {baiViet.luot_xem ?? 0}
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                            dangHienThi
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {dangHienThi ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                </div>

                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Chủ đề</p>
                    <p className="mt-2 font-semibold text-gray-800">
                        {baiViet.chu_de?.ten_chu_de || "Chưa có chủ đề"}
                    </p>
                </div>
            </div>

            {/* Bố cục thông tin chính và thông tin bổ sung */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
                {/* Cột nội dung bài viết */}
                <div className="space-y-6 xl:col-span-2">
                    <section className="rounded-lg border bg-white p-5 shadow-sm">
                        <h2 className="mb-5 border-b pb-3 text-lg font-bold text-gray-800">
                            Thông tin bài viết
                        </h2>

                        {/* Tiêu đề bài viết */}
                        <div className="mb-5">
                            <p className="text-sm text-gray-500">Tiêu đề</p>
                            <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                {baiViet.tieu_de || "Chưa có tiêu đề"}
                            </h3>
                        </div>

                        {/* Đường dẫn bài viết */}
                        <div className="mb-5">
                            <p className="text-sm text-gray-500">
                                Đường dẫn
                            </p>
                            <p className="mt-2 break-all rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                {baiViet.duong_dan || "Chưa có đường dẫn"}
                            </p>
                        </div>

                        {/* Mô tả ngắn */}
                        <div className="mb-5">
                            <p className="text-sm text-gray-500">Mô tả ngắn</p>
                            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                                {baiViet.mo_ta_ngan || "Chưa có mô tả ngắn"}
                            </p>
                        </div>

                        {/* Nội dung đầy đủ, giữ nguyên xuống dòng */}
                        <div>
                            <p className="mb-2 text-sm text-gray-500">
                                Nội dung bài viết
                            </p>

                            <div className="min-h-32 whitespace-pre-wrap wrap-break-word rounded-lg bg-gray-50 p-4 leading-8 text-gray-700">
                                {baiViet.noi_dung || "Chưa có nội dung"}
                            </div>
                        </div>
                    </section>

                    {/* Ngày đăng và ngày cập nhật */}
                    <section className="rounded-lg border bg-white p-5 shadow-sm">
                        <h2 className="mb-4 border-b pb-3 text-lg font-bold text-gray-800">
                            Thời gian
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Ngày đăng
                                </p>
                                <p className="mt-2 font-medium text-gray-800">
                                    {dinhDangNgay(baiViet.ngay_dang)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Ngày cập nhật
                                </p>
                                <p className="mt-2 font-medium text-gray-800">
                                    {dinhDangNgay(baiViet.ngay_cap_nhat)}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Cột ảnh và thông tin bổ sung */}
                <div className="space-y-6">
                    <section className="rounded-lg border bg-white p-5 shadow-sm">
                        <h2 className="mb-4 border-b pb-3 text-lg font-bold text-gray-800">
                            Ảnh đại diện
                        </h2>

                        {duongDanAnh ? (
                            <img
                                src={duongDanAnh}
                                alt={baiViet.tieu_de || "Ảnh bài viết"}
                                className="max-h-96 w-full rounded-lg border object-contain"
                            />
                        ) : (
                            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                Chưa có ảnh đại diện
                            </div>
                        )}

                        {/* Hiển thị đường dẫn để dễ kiểm tra khi ảnh lỗi */}
                        {baiViet.hinh_anh_dai_dien && (
                            <p className="mt-3 break-all text-xs text-gray-500">
                                Đường dẫn ảnh: {baiViet.hinh_anh_dai_dien}
                            </p>
                        )}
                    </section>

                    {/* Thông tin liên kết trong database */}
                    <section className="rounded-lg border bg-white p-5 shadow-sm">
                        <h2 className="mb-4 border-b pb-3 text-lg font-bold text-gray-800">
                            Thông tin bổ sung
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">ID bài viết</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {baiViet.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">ID chủ đề</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {baiViet.chu_de_id ?? "Chưa gắn chủ đề"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    ID quản trị viên
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {baiViet.quan_tri_vien_id ?? "Chưa xác định"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Trạng thái xóa</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {baiViet.deleted_at
                                        ? `Đã xóa: ${dinhDangNgay(baiViet.deleted_at)}`
                                        : "Chưa xóa"}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

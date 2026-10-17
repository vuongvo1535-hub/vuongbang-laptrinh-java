"use client";

// Import thư viện và các hàm cần thiết.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDonHangById } from "@/services/admin/donHangService";

// Định dạng tiền Việt Nam.
function dinhDangTien(tien) {
    const soTien = Number(tien ?? 0);

    if (!Number.isFinite(soTien)) {
        return "0 ₫";
    }

    return soTien.toLocaleString("vi-VN") + " ₫";
}

// Hiển thị tên trạng thái đơn hàng.
function dinhDangTrangThai(trangThai) {
    const danhSach = {
        cho_xac_nhan: "Chờ xác nhận",
        da_xac_nhan: "Đã xác nhận",
        dang_giao: "Đang giao",
        da_giao: "Đã giao",
        hoan_thanh: "Hoàn thành",
        da_huy: "Đã hủy",
        cho_thanh_toan: "Chờ thanh toán",
        da_thanh_toan: "Đã thanh toán",
    };

    return danhSach[trangThai] || trangThai || "Chưa xác định";
}

// Lấy giá trị đầu tiên có dữ liệu.
function layGiaTri(...cacGiaTri) {
    return cacGiaTri.find(
        (giaTri) =>
            giaTri !== null &&
            giaTri !== undefined &&
            giaTri !== ""
    );
}

// Định dạng ngày an toàn.
function dinhDangNgay(ngay) {
    if (!ngay || Number.isNaN(Date.parse(ngay))) {
        return "-";
    }

    return new Date(ngay).toLocaleString("vi-VN");
}

export default function ChiTietDonHangPage() {
    // Lấy ID đơn hàng từ URL.
    const { id } = useParams();

    // Điều hướng giữa các trang quản trị.
    const router = useRouter();

    // Lưu thông tin đơn hàng lấy từ API.
    const [donHang, setDonHang] = useState(null);

    // Quản lý trạng thái tải và lỗi.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tải thông tin đơn hàng khi ID thay đổi.
    useEffect(() => {
        let daHuy = false;

        async function taiChiTiet() {
            setLoading(true);
            setError("");

            try {
                // Gọi API lấy đơn hàng theo ID.
                const ketQua = await getDonHangById(id);

                // Hỗ trợ dữ liệu trả trực tiếp hoặc nằm trong data.
                const duLieu = ketQua?.data ?? ketQua;

                if (!daHuy) {
                    setDonHang(duLieu);
                }
            } catch (loi) {
                console.error("Lỗi lấy chi tiết đơn hàng:", loi);

                if (!daHuy) {
                    setError(
                        loi?.message ||
                        "Không thể tải chi tiết đơn hàng."
                    );
                }
            } finally {
                if (!daHuy) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            taiChiTiet();
        }

        return () => {
            daHuy = true;
        };
    }, [id]);

    // Hiển thị khi đang tải dữ liệu.
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Đang tải chi tiết đơn hàng...
            </div>
        );
    }

    // Hiển thị lỗi nếu không lấy được đơn hàng.
    if (error || !donHang) {
        return (
            <div className="space-y-4 p-6">
                <p className="text-red-600">
                    {error || "Không tìm thấy đơn hàng."}
                </p>

                <button
                    type="button"
                    onClick={() => router.push("/admin/donhang")}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    // Lấy danh sách sản phẩm từ các cấu trúc dữ liệu thường gặp.
    const chiTiet = Array.isArray(donHang.chi_tiet)
        ? donHang.chi_tiet
        : Array.isArray(donHang.chi_tiet_don_hang)
            ? donHang.chi_tiet_don_hang
            : Array.isArray(donHang.chiTiet)
                ? donHang.chiTiet
                : Array.isArray(donHang.san_pham)
                    ? donHang.san_pham
                    : [];

    // Lấy thông tin người nhận.
    const nguoiDung = donHang.nguoi_dung || donHang.nguoiDung || {};

    const tenNguoiNhan = layGiaTri(
        donHang.ten_nguoi_nhan,
        donHang.nguoi_nhan,
        donHang.ten_khach_hang,
        donHang.ho_ten_nguoi_nhan,
        nguoiDung.ho_ten,
        nguoiDung.ten_nguoi_dung,
        nguoiDung.name
    );

    const soDienThoai = layGiaTri(
        donHang.so_dien_thoai,
        donHang.sdt_nguoi_nhan,
        donHang.so_dien_thoai_nguoi_nhan,
        donHang.dien_thoai,
        donHang.sdt,
        nguoiDung.so_dien_thoai,
        nguoiDung.so_dien_thoai_nguoi_dung,
        nguoiDung.sdt
    );

    const diaChi = layGiaTri(
        donHang.dia_chi_giao_hang,
        donHang.dia_chi_nguoi_nhan,
        donHang.dia_chi,
        nguoiDung.dia_chi
    );

    const ngayDat = layGiaTri(
        donHang.ngay_tao,
        donHang.created_at,
        donHang.ngay_dat
    );

    // Lấy tổng tiền; nếu API chưa có tổng tiền thì tính từ chi tiết.
    const tongTienApi = layGiaTri(
        donHang.tong_tien,
        donHang.thanh_tien,
        donHang.tong_thanh_toan
    );

    const tongTien = tongTienApi !== undefined
        ? Number(tongTienApi) || 0
        : chiTiet.reduce((tong, item) => {
            const sanPham = item.san_pham || item.sanPham || {};

            const donGia = Number(
                layGiaTri(
                    item.don_gia,
                    item.gia,
                    item.gia_ban,
                    sanPham.gia_ban,
                    sanPham.gia,
                    0
                )
            ) || 0;

            const soLuong = Number(item.so_luong ?? 1) || 1;

            return tong + Number(
                item.thanh_tien ?? donGia * soLuong
            );
        }, 0);

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Tiêu đề trang và nút quay lại. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Chi tiết đơn hàng #{donHang.id}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Thông tin người nhận và sản phẩm trong đơn hàng.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => router.push("/admin/donhang")}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
                >
                    ← Quay lại
                </button>
            </div>

            {/* Hiển thị thông tin chung của đơn hàng. */}
            <div className="grid grid-cols-1 gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="mt-1 font-semibold">#{donHang.id}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="mt-1 font-semibold">
                        {dinhDangTrangThai(donHang.trang_thai)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Người nhận</p>
                    <p className="mt-1 font-medium">
                        {tenNguoiNhan || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="mt-1 font-medium">
                        {soDienThoai || "-"}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                        Địa chỉ nhận hàng
                    </p>
                    <p className="mt-1 font-medium">
                        {diaChi || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="mt-1 font-medium">
                        {dinhDangNgay(ngayDat)}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="mt-1 text-lg font-bold text-blue-600">
                        {dinhDangTien(tongTien)}
                    </p>
                </div>
            </div>

            {/* Bảng sản phẩm thuộc đơn hàng. */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b p-4">
                    <h2 className="font-semibold text-gray-800">
                        Sản phẩm trong đơn hàng
                    </h2>
                </div>

                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">
                                Sản phẩm
                            </th>

                            <th className="px-4 py-3 text-right text-sm">
                                Đơn giá
                            </th>

                            <th className="px-4 py-3 text-center text-sm">
                                Số lượng
                            </th>

                            <th className="px-4 py-3 text-right text-sm">
                                Thành tiền
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {chiTiet.length > 0 ? (
                            chiTiet.map((item, index) => {
                                // Thông tin sản phẩm có thể nằm trong quan hệ.
                                const sanPham =
                                    item.san_pham ||
                                    item.sanPham ||
                                    item.san_pham_thong_tin ||
                                    {};

                                // Lấy tên sản phẩm.
                                const tenSanPham = layGiaTri(
                                    item.ten_san_pham,
                                    item.ten_san_pham_tai_thoi_diem_dat,
                                    sanPham.ten_san_pham,
                                    sanPham.ten,
                                    sanPham.ten_sp,
                                    item.ten
                                ) || "Sản phẩm";

                                // Lấy đơn giá tại thời điểm đặt hàng.
                                const donGia = Number(
                                    layGiaTri(
                                        item.don_gia,
                                        item.gia_ban,
                                        item.gia,
                                        sanPham.gia_ban,
                                        sanPham.gia,
                                        0
                                    )
                                ) || 0;

                                // Lấy số lượng sản phẩm.
                                const soLuong = Number(
                                    item.so_luong ?? 1
                                ) || 1;

                                // Ưu tiên thành tiền đã lưu trong chi tiết.
                                const thanhTien = Number(
                                    layGiaTri(
                                        item.thanh_tien,
                                        item.tong_tien,
                                        donGia * soLuong
                                    )
                                ) || 0;

                                return (
                                    <tr
                                        key={item.id || index}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3 text-sm">
                                            {tenSanPham}
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm">
                                            {dinhDangTien(donGia)}
                                        </td>

                                        <td className="px-4 py-3 text-center text-sm">
                                            {soLuong}
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm font-medium">
                                            {dinhDangTien(thanhTien)}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    Đơn hàng chưa có dữ liệu sản phẩm chi tiết
                                    hoặc API chưa trả về danh sách sản phẩm.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
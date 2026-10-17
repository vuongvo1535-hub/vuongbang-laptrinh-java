
"use client";

import { useEffect, useState } from "react";
import {
    getNguoiDungs,
    getNguoiDung,
} from "@/services/admin/nguoiDungService";
import Pagination from "@/components/common/Pagination";

export default function NguoiDungPage() {
    // Danh sách người dùng.
    const [nguoiDungs, setNguoiDungs] = useState([]);

    // Từ khóa nhập và từ khóa dùng để tìm kiếm.
    const [tuKhoa, setTuKhoa] = useState("");
    const [tuKhoaTim, setTuKhoaTim] = useState("");

    // Thông tin phân trang.
    const [trang, setTrang] = useState(1);
    const [tongTrang, setTongTrang] = useState(1);

    // Trạng thái tải danh sách và lỗi.
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    // Thông tin chi tiết người dùng.
    const [nguoiDungChiTiet, setNguoiDungChiTiet] = useState(null);
    const [hienChiTiet, setHienChiTiet] = useState(false);
    const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

    // Tăng biến này để tải lại dữ liệu khi cần.
    const [lanTaiLai, setLanTaiLai] = useState(0);

    // Lấy danh sách người dùng theo trang và từ khóa.
    useEffect(() => {
        let huyYeuCau = false;

        const taiDanhSach = async () => {
            try {
                const ketQua = await getNguoiDungs(trang, tuKhoaTim);

                if (huyYeuCau) return;

                setNguoiDungs(ketQua.data || []);
                setTongTrang(
                    Math.max(1, Number(ketQua.meta?.last_page) || 1)
                );
                setLoi("");
            } catch (error) {
                if (!huyYeuCau) {
                    setLoi(
                        error.message ||
                        "Không thể tải danh sách người dùng."
                    );
                    setNguoiDungs([]);
                }
            } finally {
                if (!huyYeuCau) {
                    setDangTai(false);
                }
            }
        };

        taiDanhSach();

        return () => {
            huyYeuCau = true;
        };
    }, [trang, tuKhoaTim, lanTaiLai]);

    // Tìm kiếm người dùng.
    const timKiem = (e) => {
        e.preventDefault();

        const tuKhoaMoi = tuKhoa.trim();

        setDangTai(true);

        if (trang !== 1 && tuKhoaMoi !== tuKhoaTim) {
            setTrang(1);
            setTuKhoaTim(tuKhoaMoi);
        } else if (tuKhoaMoi !== tuKhoaTim) {
            setTuKhoaTim(tuKhoaMoi);
        } else {
            // Từ khóa không đổi thì vẫn cho phép tìm lại.
            setLanTaiLai((lanTruoc) => lanTruoc + 1);
        }
    };

    // Chuyển trang.
    const doiTrang = (trangMoi) => {
        if (trangMoi < 1 || trangMoi > tongTrang || trangMoi === trang) {
            return;
        }

        setDangTai(true);
        setTrang(trangMoi);
    };

    // Xem chi tiết người dùng.
    const xemChiTiet = async (id) => {
        setDangTaiChiTiet(true);
        setLoi("");

        try {
            const ketQua = await getNguoiDung(id);
            setNguoiDungChiTiet(ketQua.data || ketQua);
            setHienChiTiet(true);
        } catch (error) {
            setLoi(
                error.message ||
                "Không thể tải chi tiết người dùng."
            );
        } finally {
            setDangTaiChiTiet(false);
        }
    };

    // Đóng cửa sổ chi tiết.
    const dongChiTiet = () => {
        setHienChiTiet(false);
        setNguoiDungChiTiet(null);
    };

    // Hiển thị trạng thái người dùng.
    const hienThiTrangThai = (trangThai) => {
        const giaTri = String(trangThai ?? "")
            .trim()
            .toLowerCase();

        if (giaTri === "") {
            return (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    Chưa có dữ liệu
                </span>
            );
        }

        const dangHoatDong = [
            "1",
            "true",
            "hoat_dong",
            "hoạt động",
            "active",
        ].includes(giaTri);

        return (
            <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                    dangHoatDong
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                }`}
            >
                {dangHoatDong ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Tiêu đề trang. */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý người dùng
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Xem danh sách và thông tin chi tiết người dùng.
                </p>
            </div>

            {/* Form tìm kiếm. */}
            <form
                onSubmit={timKiem}
                className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow sm:flex-row"
            >
                <input
                    type="text"
                    value={tuKhoa}
                    onChange={(e) => setTuKhoa(e.target.value)}
                    placeholder="Tìm theo tên, email..."
                    className="min-w-0 flex-1 rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                />

                <button
                    type="submit"
                    disabled={dangTai}
                    className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Tìm kiếm
                </button>
            </form>

            {/* Thông báo lỗi. */}
            {loi && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    <p>{loi}</p>

                    <button
                        type="button"
                        onClick={() => {
                            setDangTai(true);
                            setLanTaiLai((lanTruoc) => lanTruoc + 1);
                        }}
                        className="mt-2 font-medium underline"
                    >
                        Thử tải lại
                    </button>
                </div>
            )}

            {/* Bảng danh sách người dùng. */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="font-semibold text-gray-800">
                        Danh sách người dùng
                    </h2>

                    <span className="text-sm text-gray-500">
                        Trang {trang} / {tongTrang}
                    </span>
                </div>

                {dangTai ? (
                    <div className="p-8 text-center text-gray-500">
                        Đang tải danh sách...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="whitespace-nowrap px-5 py-3">ID</th>
                                    <th className="whitespace-nowrap px-5 py-3">Họ tên</th>
                                    <th className="whitespace-nowrap px-5 py-3">Email</th>
                                    <th className="whitespace-nowrap px-5 py-3">Số điện thoại</th>
                                    <th className="whitespace-nowrap px-5 py-3">Trạng thái</th>
                                    <th className="whitespace-nowrap px-5 py-3 text-center">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {nguoiDungs.length > 0 ? (
                                    nguoiDungs.map((nguoiDung) => (
                                        <tr
                                            key={nguoiDung.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                {nguoiDung.id}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {nguoiDung.ho_ten ||
                                                    nguoiDung.ten_nguoi_dung ||
                                                    nguoiDung.name ||
                                                    "Chưa cập nhật"}
                                            </td>

                                            <td className="px-5 py-4">
                                                {nguoiDung.email || "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                {nguoiDung.so_dien_thoai ||
                                                    nguoiDung.phone ||
                                                    "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {hienThiTrangThai(
                                                    nguoiDung.trang_thai
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        xemChiTiet(nguoiDung.id)
                                                    }
                                                    disabled={dangTaiChiTiet}
                                                    className="rounded-md bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                                                >
                                                    {dangTaiChiTiet
                                                        ? "Đang tải..."
                                                        : "Chi tiết"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-8 text-center text-gray-500"
                                        >
                                            Không tìm thấy người dùng.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Phân trang dùng đúng props của Pagination.jsx. */}
                <div className="overflow-x-auto border-t px-5 py-4">
                    <Pagination
                        currentPage={trang}
                        pageCount={tongTrang}
                        onPageChange={doiTrang}
                    />
                </div>
            </div>

            {/* Cửa sổ xem chi tiết người dùng. */}
            {hienChiTiet && nguoiDungChiTiet && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={dongChiTiet}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Chi tiết người dùng
                            </h2>

                            <button
                                type="button"
                                onClick={dongChiTiet}
                                className="rounded-md px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                                aria-label="Đóng"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.id ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Họ tên</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.ho_ten ||
                                        nguoiDungChiTiet.ten_nguoi_dung ||
                                        nguoiDungChiTiet.name ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="mt-1 break-all font-medium">
                                    {nguoiDungChiTiet.email || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Số điện thoại
                                </p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.so_dien_thoai ||
                                        nguoiDungChiTiet.phone ||
                                        "—"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.dia_chi ||
                                        nguoiDungChiTiet.address ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.ngay_sinh ||
                                        nguoiDungChiTiet.birth_date ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Giới tính</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.gioi_tinh ||
                                        nguoiDungChiTiet.gender ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Trạng thái</p>
                                <div className="mt-2">
                                    {hienThiTrangThai(
                                        nguoiDungChiTiet.trang_thai
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Ngày tạo</p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.ngay_tao ||
                                        nguoiDungChiTiet.created_at ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Ngày cập nhật
                                </p>
                                <p className="mt-1 font-medium">
                                    {nguoiDungChiTiet.ngay_cap_nhat ||
                                        nguoiDungChiTiet.updated_at ||
                                        "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end border-t px-6 py-4">
                            <button
                                type="button"
                                onClick={dongChiTiet}
                                className="rounded-md bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

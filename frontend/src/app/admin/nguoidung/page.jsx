"use client";

import { useEffect, useState } from "react";
import {
    getNguoiDungs,
    getNguoiDung,
} from "@/services/admin/nguoiDungService";
import Pagination from "@/components/common/Pagination";

export default function NguoiDungPage() {
    // Danh sách người dùng
    const [nguoiDungs, setNguoiDungs] = useState([]);

    // Từ khóa tìm kiếm
    const [tuKhoa, setTuKhoa] = useState("");
    const [tuKhoaTim, setTuKhoaTim] = useState("");

    // Thông tin phân trang
    const [trang, setTrang] = useState(1);
    const [tongTrang, setTongTrang] = useState(1);

    // Trạng thái tải danh sách và lỗi
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    // Chi tiết người dùng
    const [nguoiDungChiTiet, setNguoiDungChiTiet] = useState(null);
    const [hienChiTiet, setHienChiTiet] = useState(false);
    const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

    const [lanTaiLai, setLanTaiLai] = useState(0);
    const [vaiTro, setVaiTro] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("admin_user");
            if (raw) {
                const u = JSON.parse(raw);
                setVaiTro(u.vaiTro);
            }
        } catch {}
    }, []);

    // Lấy danh sách người dùng theo trang và từ khóa
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

    // Tìm kiếm người dùng
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
            setLanTaiLai((lanTruoc) => lanTruoc + 1);
        }
    };

    // Chuyển trang
    const doiTrang = (trangMoi) => {
        if (trangMoi < 1 || trangMoi > tongTrang || trangMoi === trang) {
            return;
        }
        setDangTai(true);
        setTrang(trangMoi);
    };

    // Xem chi tiết người dùng
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

    // Đóng cửa sổ chi tiết
    const dongChiTiet = () => {
        setHienChiTiet(false);
        setNguoiDungChiTiet(null);
    };

    // Hiển thị trạng thái người dùng
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
            {/* Tiêu đề trang & Huy hiệu vai trò */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Quản lý độc giả thư viện
                        </h1>
                        {vaiTro === "QUAN_TRI" ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                🛡️ Quản trị viên
                            </span>
                        ) : (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                📖 Thủ thư (Tra cứu)
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        {vaiTro === "QUAN_TRI"
                            ? "Xem danh sách, kiểm tra tài khoản và quản lý thông tin độc giả toàn hệ thống."
                            : "Tra cứu độc giả, xem thông tin liên hệ và trạng thái thẻ thư viện phục vụ mượn trả."}
                    </p>
                </div>
            </div>

            {/* Form tìm kiếm */}
            <form
                onSubmit={timKiem}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm border border-gray-100 sm:flex-row"
            >
                <input
                    type="text"
                    value={tuKhoa}
                    onChange={(e) => setTuKhoa(e.target.value)}
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />

                <button
                    type="submit"
                    disabled={dangTai}
                    className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
                >
                    Tìm kiếm
                </button>
            </form>

            {/* Thông báo lỗi */}
            {loi && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
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

            {/* Bảng danh sách người dùng */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="font-semibold text-gray-800">
                        Danh sách độc giả
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
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
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
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-5 py-4 font-mono text-xs text-gray-500">
                                                #{nguoiDung.id}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-800">
                                                {nguoiDung.ho_ten ||
                                                    nguoiDung.ten_nguoi_dung ||
                                                    nguoiDung.name ||
                                                    "Chưa cập nhật"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {nguoiDung.email || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
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
                                                    className="rounded-lg bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition"
                                                >
                                                    {dangTaiChiTiet
                                                        ? "Đang tải..."
                                                        : "Xem hồ sơ"}
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
                                            Không tìm thấy độc giả nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Phân trang */}
                <div className="overflow-x-auto border-t px-5 py-4">
                    <Pagination
                        currentPage={trang}
                        pageCount={tongTrang}
                        onPageChange={doiTrang}
                    />
                </div>
            </div>

            {/* Cửa sổ xem chi tiết người dùng */}
            {hienChiTiet && nguoiDungChiTiet && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={dongChiTiet}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Hồ sơ độc giả #{nguoiDungChiTiet.id ?? "—"}
                                </h2>
                                <p className="text-xs text-gray-500">Thông tin tài khoản độc giả thư viện</p>
                            </div>

                            <button
                                type="button"
                                onClick={dongChiTiet}
                                className="rounded-lg p-1.5 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                aria-label="Đóng"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Mã độc giả</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    #{nguoiDungChiTiet.id ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Họ và tên</p>
                                <p className="mt-1 font-semibold text-emerald-800">
                                    {nguoiDungChiTiet.ho_ten ||
                                        nguoiDungChiTiet.ten_nguoi_dung ||
                                        nguoiDungChiTiet.name ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Email liên hệ</p>
                                <p className="mt-1 break-all font-medium text-gray-700">
                                    {nguoiDungChiTiet.email || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">
                                    Số điện thoại
                                </p>
                                <p className="mt-1 font-medium text-gray-700">
                                    {nguoiDungChiTiet.so_dien_thoai ||
                                        nguoiDungChiTiet.phone ||
                                        "—"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Địa chỉ</p>
                                <p className="mt-1 font-medium text-gray-700">
                                    {nguoiDungChiTiet.dia_chi ||
                                        nguoiDungChiTiet.address ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Ngày sinh</p>
                                <p className="mt-1 font-medium text-gray-700">
                                    {nguoiDungChiTiet.ngay_sinh ||
                                        nguoiDungChiTiet.birth_date ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Giới tính</p>
                                <p className="mt-1 font-medium text-gray-700">
                                    {nguoiDungChiTiet.gioi_tinh ||
                                        nguoiDungChiTiet.gender ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Trạng thái thẻ</p>
                                <div className="mt-1">
                                    {hienThiTrangThai(
                                        nguoiDungChiTiet.trang_thai
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Ngày tham gia</p>
                                <p className="mt-1 font-medium text-gray-700">
                                    {nguoiDungChiTiet.ngay_tao ||
                                        nguoiDungChiTiet.created_at ||
                                        "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end border-t px-6 py-4 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={dongChiTiet}
                                className="rounded-xl bg-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                            >
                                Đóng hồ sơ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

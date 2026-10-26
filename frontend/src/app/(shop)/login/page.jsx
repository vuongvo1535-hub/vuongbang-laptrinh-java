"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiLock, FiLogIn, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function LoginPage() {
    const router = useRouter();
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [dangXuLy, setDangXuLy] = useState(false);
    const [loi, setLoi] = useState("");
    const [thanhCong, setThanhCong] = useState("");

    const xuLyDangNhap = async (e) => {
        e.preventDefault();
        setLoi("");
        setThanhCong("");

        if (!tenDangNhap.trim() || !matKhau.trim()) {
            setLoi("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setDangXuLy(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenDangNhap: tenDangNhap.trim(),
                    matKhau: matKhau.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Tên đăng nhập hoặc mật khẩu không chính xác.");
            }

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem("user", JSON.stringify(data));
            window.dispatchEvent(new Event("user-auth-changed"));

            setThanhCong("Đăng nhập thành công! Đang chuyển hướng...");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err) {
            setLoi(err.message || "Không thể kết nối đến máy chủ.");
        } finally {
            setDangXuLy(false);
        }
    };

    // Chọn nhanh tài khoản mẫu để chấm điểm / kiểm thử nhanh
    const chonTaiKhoanMau = (user, pass) => {
        setTenDangNhap(user);
        setMatKhau(pass);
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-gray-50 py-10 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Tiêu đề */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                        📚
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Đăng nhập Độc giả</h1>
                    <p className="text-sm text-gray-500 mt-1">Hệ thống Thư viện Sách Điện tử</p>
                </div>

                {/* Thông báo lỗi / thành công */}
                {loi && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-200">
                        <FiAlertCircle className="shrink-0 text-base" />
                        <span>{loi}</span>
                    </div>
                )}
                {thanhCong && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2 border border-emerald-200">
                        <FiCheckCircle className="shrink-0 text-base" />
                        <span>{thanhCong}</span>
                    </div>
                )}

                {/* Form đăng nhập */}
                <form onSubmit={xuLyDangNhap} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={tenDangNhap}
                                onChange={(e) => setTenDangNhap(e.target.value)}
                                placeholder="Nhập tên đăng nhập (vd: docgia01)"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={dangXuLy}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <FiLogIn />
                        {dangXuLy ? "Đang xử lý..." : "Đăng nhập ngay"}
                    </button>
                </form>

                {/* Tài khoản mẫu tiện test nhanh */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Bấm để điền nhanh tài khoản mẫu trong SQL:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <button
                            type="button"
                            onClick={() => chonTaiKhoanMau("docgia01", "123456")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                        >
                            Độc giả 01 (docgia01)
                        </button>
                        <button
                            type="button"
                            onClick={() => chonTaiKhoanMau("docgia02", "123456")}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                        >
                            Độc giả 02 (docgia02)
                        </button>
                    </div>
                </div>

                {/* Điều hướng đăng ký */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản độc giả?{" "}
                    <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
                        Đăng ký thẻ mới
                    </Link>
                </div>
            </div>
        </div>
    );
}

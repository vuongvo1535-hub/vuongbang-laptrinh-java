"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiShield, FiLock, FiUser, FiLogIn, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function AdminLoginPage() {
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
            setLoi("Vui lòng điền đầy đủ tài khoản và mật khẩu quản trị.");
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
                throw new Error(data.message || data.error || "Tài khoản hoặc mật khẩu không đúng.");
            }

            // Kiểm tra phân quyền: Phải là QUAN_TRI hoặc THU_THU
            if (data.vaiTro !== "QUAN_TRI" && data.vaiTro !== "THU_THU") {
                throw new Error("Tài khoản của bạn là độc giả, không có quyền truy cập trang quản trị.");
            }

            // Lưu thông tin admin vào localStorage
            localStorage.setItem("admin_user", JSON.stringify(data));
            setThanhCong("Đăng nhập quản trị thành công! Đang chuyển hướng...");

            setTimeout(() => {
                router.push("/admin");
            }, 800);
        } catch (err) {
            setLoi(err.message || "Không thể kết nối đến máy chủ.");
        } finally {
            setDangXuLy(false);
        }
    };

    const chonMau = (user, pass) => {
        setTenDangNhap(user);
        setMatKhau(pass);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-700/20">
                {/* Logo & Tiêu đề */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
                        <FiShield size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Đăng Nhập Quản Trị</h1>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
                        Hệ Thống Thư Viện · Admin Portal
                    </p>
                </div>

                {/* Thông báo lỗi / thành công */}
                {loi && (
                    <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-200">
                        <FiAlertCircle className="shrink-0 text-base" />
                        <span>{loi}</span>
                    </div>
                )}
                {thanhCong && (
                    <div className="mb-5 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2 border border-emerald-200">
                        <FiCheckCircle className="shrink-0 text-base" />
                        <span>{thanhCong}</span>
                    </div>
                )}

                {/* Form login */}
                <form onSubmit={xuLyDangNhap} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                            Tài khoản Admin / Thủ thư
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={tenDangNhap}
                                onChange={(e) => setTenDangNhap(e.target.value)}
                                placeholder="Nhập tài khoản (vd: admin)"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={dangXuLy}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        <FiLogIn size={18} />
                        {dangXuLy ? "Đang xác thực..." : "Đăng nhập trang quản trị"}
                    </button>
                </form>

                {/* Tài khoản mẫu */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Tài khoản quản trị mẫu trong SQL:</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => chonMau("admin", "admin123")}
                            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 text-center transition"
                        >
                            Quản trị viên (admin)
                        </button>
                        <button
                            type="button"
                            onClick={() => chonMau("thuthu01", "123456")}
                            className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 text-center transition"
                        >
                            Thủ thư (thuthu01)
                        </button>
                    </div>
                </div>

                {/* Quay về trang bạn đọc */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    <Link href="/" className="hover:text-emerald-600 underline">
                        ← Về trang chủ Thư viện bạn đọc
                    </Link>
                </div>
            </div>
        </div>
    );
}

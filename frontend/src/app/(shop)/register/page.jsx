"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiUserPlus, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        tenDangNhap: "",
        matKhau: "",
        xacNhanMatKhau: "",
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
    });

    const [dangXuLy, setDangXuLy] = useState(false);
    const [loi, setLoi] = useState("");
    const [thanhCong, setThanhCong] = useState("");

    const thayDoi = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const xuLyDangKy = async (e) => {
        e.preventDefault();
        setLoi("");
        setThanhCong("");

        if (!form.tenDangNhap.trim() || !form.matKhau.trim() || !form.hoTen.trim()) {
            setLoi("Vui lòng nhập họ tên, tên đăng nhập và mật khẩu.");
            return;
        }

        if (form.matKhau.length < 6) {
            setLoi("Mật khẩu phải có tối thiểu 6 ký tự.");
            return;
        }

        if (form.matKhau !== form.xacNhanMatKhau) {
            setLoi("Mật khẩu xác nhận không khớp.");
            return;
        }

        setDangXuLy(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenDangNhap: form.tenDangNhap.trim(),
                    matKhau: form.matKhau.trim(),
                    hoTen: form.hoTen.trim(),
                    email: form.email.trim(),
                    soDienThoai: form.soDienThoai.trim(),
                    diaChi: form.diaChi.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Đăng ký không thành công.");
            }

            // Tự động đăng nhập người dùng sau khi đăng ký
            localStorage.setItem("user", JSON.stringify(data));
            window.dispatchEvent(new Event("user-auth-changed"));

            setThanhCong("Đăng ký tài khoản và cấp thẻ thư viện thành công! Đang chuyển hướng...");
            setTimeout(() => {
                router.push("/");
            }, 1200);
        } catch (err) {
            setLoi(err.message || "Không thể kết nối đến máy chủ.");
        } finally {
            setDangXuLy(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-10 px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {/* Tiêu đề */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                        📖
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Đăng ký Thẻ Độc Giả</h1>
                    <p className="text-sm text-gray-500 mt-1">Đăng ký tài khoản để mượn sách thư viện miễn phí</p>
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

                {/* Form đăng ký */}
                <form onSubmit={xuLyDangKy} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên độc giả <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                required
                                name="hoTen"
                                value={form.hoTen}
                                onChange={thayDoi}
                                placeholder="Ví dụ: Nguyễn Văn A"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                name="tenDangNhap"
                                value={form.tenDangNhap}
                                onChange={thayDoi}
                                placeholder="Tên viết liền không dấu"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="soDienThoai"
                                    value={form.soDienThoai}
                                    onChange={thayDoi}
                                    placeholder="0912xxxxxx"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    name="matKhau"
                                    value={form.matKhau}
                                    onChange={thayDoi}
                                    placeholder="Ít nhất 6 ký tự"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    name="xacNhanMatKhau"
                                    value={form.xacNhanMatKhau}
                                    onChange={thayDoi}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email liên hệ
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={thayDoi}
                                placeholder="email@example.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ
                        </label>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="diaChi"
                                value={form.diaChi}
                                onChange={thayDoi}
                                placeholder="Quận/Huyện, Tỉnh/TP"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={dangXuLy}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        <FiUserPlus />
                        {dangXuLy ? "Đang tạo tài khoản..." : "Đăng ký thành viên"}
                    </button>
                </form>

                {/* Điều hướng đăng nhập */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản độc giả?{" "}
                    <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
                        Đăng nhập tại đây
                    </Link>
                </div>
            </div>
        </div>
    );
}

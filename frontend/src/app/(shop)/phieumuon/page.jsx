"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiDollarSign, FiCheck, FiX, FiClock, FiBook, FiCreditCard, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { dinhDangTien } from "@/utils/format";

export default function PhieuMuonUserPage() {
    const [user, setUser] = useState(null);
    const [dsPhieu, setDsPhieu] = useState([]);
    const [dsPhat, setDsPhat] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    // Trạng thái modal quét QR
    const [qrData, setQrData] = useState(null);
    const [dangMoQr, setDangMoQr] = useState(false);
    const [dangXacNhan, setDangXacNhan] = useState(false);
    const [thongBao, setThongBao] = useState("");

    const taiDuLieu = async (docGiaId) => {
        setDangTai(true);
        try {
            // 1. Tải phiếu mượn của độc giả
            const resPhieu = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon?docGiaId=${docGiaId || ""}`);
            if (resPhieu.ok) {
                const dataPhieu = await resPhieu.json();
                setDsPhieu(Array.isArray(dataPhieu) ? dataPhieu : []);
            }

            // 2. Tải danh sách tiền phạt
            const resPhat = await fetch(`${API_CONFIG.BASE_URL}/tienPhat`);
            if (resPhat.ok) {
                const dataPhat = await resPhat.json();
                setDsPhat(Array.isArray(dataPhat) ? dataPhat : []);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUser(parsed);
                taiDuLieu(parsed.docGiaId || parsed.taiKhoanId);
            } else {
                setDangTai(false);
            }
        } catch {
            setDangTai(false);
        }
    }, []);

    // Mở mã QR thanh toán tiền phạt
    const moMaQRThanhToan = async (tienPhatId) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${tienPhatId}`);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Không thể tạo mã QR thanh toán.");
            }
            const data = await res.json();
            setQrData(data);
            setDangMoQr(true);
        } catch (err) {
            alert("Lỗi tạo QR: " + err.message);
        }
    };

    // Xác nhận đã thanh toán
    const xacNhanThanhToanMoMo = async (tienPhatId) => {
        setDangXacNhan(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${tienPhatId}/xacNhan`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                setThongBao("Xác nhận thanh toán thành công! Trạng thái khoản phạt đã được cập nhật.");
                setDangMoQr(false);
                if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
            } else {
                alert(data.message || "Xác nhận thanh toán thất bại.");
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        } finally {
            setDangXacNhan(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🔒
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Vui lòng đăng nhập</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Bạn cần đăng nhập bằng tài khoản độc giả để xem lịch sử phiếu mượn và thanh toán phí phạt qua QR.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link
                        href="/login"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm"
                    >
                        Đăng nhập ngay
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm"
                    >
                        Đăng ký thẻ mới
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[75vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Lịch sử Phiếu Mượn & Phạt</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Độc giả: <b className="text-emerald-700">{user.hoTen || user.tenDangNhap}</b> (Mã #{user.docGiaId || user.taiKhoanId})
                    </p>
                </div>
                <button
                    onClick={() => taiDuLieu(user.docGiaId || user.taiKhoanId)}
                    className="flex items-center gap-2 self-start px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                >
                    <FiRefreshCw size={14} /> Làm mới dữ liệu
                </button>
            </div>

            {thongBao && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center justify-between border border-emerald-200">
                    <div className="flex items-center gap-2">
                        <FiCheck className="shrink-0 text-lg text-emerald-600" />
                        <span>{thongBao}</span>
                    </div>
                    <button onClick={() => setThongBao("")} className="text-emerald-600 hover:text-emerald-800">✕</button>
                </div>
            )}

            {/* PHẦN 1: TIỀN PHẠT CẦN THANH TOÁN (QR CODE) */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiDollarSign className="text-red-500" />
                        <span>Khoản phạt & Phí thư viện (Quét QR Thanh Toán)</span>
                    </h2>
                </div>

                {dangTai ? (
                    <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-xl border">Đang kiểm tra dữ liệu phạt...</div>
                ) : dsPhat.length === 0 ? (
                    <div className="p-6 bg-white rounded-xl border border-gray-100 text-sm text-emerald-700 flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <p className="font-bold">Bạn không có khoản nợ hay tiền phạt nào!</p>
                            <p className="text-xs text-gray-500">Cảm ơn bạn đã luôn trả sách đúng hạn và giữ gìn sách cẩn thận.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dsPhat.map((phat) => {
                            const daThanhToan = phat.trangThai === "DA_THANH_TOAN";
                            return (
                                <div
                                    key={phat.id}
                                    className={`p-5 rounded-2xl border transition bg-white shadow-sm flex flex-col justify-between ${
                                        daThanhToan ? "border-green-200 bg-green-50/20" : "border-red-200"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-gray-400">
                                                Phiếu phạt #{phat.id}
                                            </span>
                                            <span
                                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                                    daThanhToan
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {daThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </span>
                                        </div>

                                        <p className="font-bold text-gray-800 mt-2 text-sm">
                                            Lý do: {phat.lyDo === "QUA_HAN" ? "Trả sách trễ hạn" :
                                                    phat.lyDo === "HU_HONG" ? "Làm hư hỏng sách" :
                                                    phat.lyDo === "LAM_MAT" ? "Làm mất sách" : phat.lyDo}
                                        </p>
                                        {phat.ghiChu && (
                                            <p className="text-xs text-gray-500 mt-0.5">{phat.ghiChu}</p>
                                        )}

                                        <p className="text-xl font-black text-red-600 mt-3">
                                            {dinhDangTien(phat.soTien)}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        {daThanhToan ? (
                                            <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                                                <FiCheck /> Đã thanh toán thành công
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => moMaQRThanhToan(phat.id)}
                                                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                                            >
                                                <FiCreditCard size={15} />
                                                Quét mã QR MoMo / Ngân Hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* PHẦN 2: DANH SÁCH PHIẾU MƯỢN */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBook className="text-emerald-600" />
                    <span>Lịch sử các phiếu mượn sách</span>
                </h2>

                {dangTai ? (
                    <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-xl border">Đang tải phiếu mượn...</div>
                ) : dsPhieu.length === 0 ? (
                    <div className="p-8 bg-white rounded-xl border text-center text-sm text-gray-500">
                        Bạn chưa mượn cuốn sách nào gần đây.{" "}
                        <Link href="/sach" className="text-emerald-600 font-semibold hover:underline">
                            Duyệt sách ngay
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl bg-white border border-gray-100 shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                                <tr>
                                    <th className="px-5 py-3">Mã phiếu</th>
                                    <th className="px-5 py-3">Ngày mượn</th>
                                    <th className="px-5 py-3">Ghi chú</th>
                                    <th className="px-5 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dsPhieu.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono font-bold text-emerald-800">
                                            {p.maPhieu}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-600">
                                            {p.ngayMuon ? new Date(p.ngayMuon).toLocaleString("vi-VN") : "-"}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-600">
                                            {p.ghiChu || "Mượn sách thư viện"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                                    p.trangThai === "DA_TRA"
                                                        ? "bg-green-100 text-green-700"
                                                        : p.trangThai === "QUA_HAN"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {p.trangThai === "DA_TRA"
                                                    ? "Đã trả xong"
                                                    : p.trangThai === "QUA_HAN"
                                                    ? "Quá hạn"
                                                    : "Đang mượn"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL QUÉT MÃ QR THANH TOÁN MOMO / VIETQR */}
            {dangMoQr && qrData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative text-center">
                        <button
                            onClick={() => setDangMoQr(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                            <FiCreditCard size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800">Quét mã QR Thanh Toán</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Mở ứng dụng <b>MoMo</b> hoặc <b>Ngân hàng (VietQR)</b> để quét mã
                        </p>

                        {/* Ảnh QR Động VietQR */}
                        <div className="my-4 p-2 bg-gray-50 rounded-2xl border inline-block">
                            <img
                                src={qrData.qrUrl}
                                alt="Mã QR VietQR MoMo"
                                className="w-56 h-56 mx-auto object-contain rounded-lg"
                            />
                        </div>

                        {/* Chi tiết khoản nộp */}
                        <div className="text-left bg-gray-50 p-3 rounded-xl text-xs space-y-1.5 text-gray-600 mb-4 border border-gray-100">
                            <div className="flex justify-between">
                                <span>Số tiền nộp:</span>
                                <b className="text-red-600 text-sm font-black">{dinhDangTien(qrData.soTien)}</b>
                            </div>
                            <div className="flex justify-between">
                                <span>Người nhận:</span>
                                <b className="text-gray-800">{qrData.tenNguoiNhan}</b>
                            </div>
                            <div className="flex justify-between">
                                <span>Nội dung chuyển:</span>
                                <b className="font-mono text-emerald-700">{qrData.noiDung}</b>
                            </div>
                        </div>

                        <button
                            onClick={() => xacNhanThanhToanMoMo(qrData.tienPhatId)}
                            disabled={dangXacNhan}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
                        >
                            {dangXacNhan ? "Đang xác thực giao dịch..." : "Tôi đã chuyển khoản thành công"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

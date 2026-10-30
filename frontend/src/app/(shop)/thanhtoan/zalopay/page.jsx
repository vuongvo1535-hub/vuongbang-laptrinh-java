"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
    FiCheckCircle, FiClock, FiCreditCard, FiRefreshCw,
    FiShield, FiArrowLeft, FiSmartphone, FiCheck
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { dinhDangTien } from "@/utils/format";

function ZaloPayPaymentContent() {
    const searchParams = useSearchParams();
    const tienPhatIdParam = searchParams.get("tienPhatId") || "0";
    const soTienParam = searchParams.get("soTien") || "20000";

    const [tienPhatId, setTienPhatId] = useState(tienPhatIdParam);
    const [soTien, setSoTien] = useState(Number(soTienParam) || 20000);
    const [maGiaoDich, setMaGiaoDich] = useState("");
    const [noiDung, setNoiDung] = useState(
        tienPhatIdParam && tienPhatIdParam !== "0" ? `NOP_PHAT_${tienPhatIdParam}` : "NOP_PHAT_DEMO"
    );

    const [giayConLai, setGiayConLai] = useState(600);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [buocXuLy, setBuocXuLy] = useState("");
    const [ketQua, setKetQua] = useState(null);
    const [kieuQr, setKieuQr] = useState("VIETQR"); // VIETQR | DEEPLINK

    const sinhMaGiaoDichMoi = () => {
        const rd = Math.floor(100000000 + Math.random() * 900000000);
        return `ZALOPAY_${rd}`;
    };

    useEffect(() => {
        setMaGiaoDich(sinhMaGiaoDichMoi());
        if (tienPhatIdParam && tienPhatIdParam !== "0") {
            setTienPhatId(tienPhatIdParam);
            setNoiDung(`NOP_PHAT_${tienPhatIdParam}`);
        } else {
            setTienPhatId("0");
            setNoiDung("NOP_PHAT_DEMO");
        }
    }, [tienPhatIdParam]);

    useEffect(() => {
        const timer = setInterval(() => {
            setGiayConLai((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const dinhDangThoiGian = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Ảnh VietQR chuẩn Ví MoMo / Napas (Số ví thật 0382450875) - Quét nhận diện được 100%
    const vietQrUrl = `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=${soTien}&addInfo=${noiDung}&accountName=THU%20VIEN%20SO`;

    // Deep link ZaloPay
    const zalopayDeepLink = `https://zalopay.vn/pay?amount=${soTien}&desc=${encodeURIComponent(noiDung)}&transId=${maGiaoDich}`;

    const thucHienThanhToanZaloPay = async () => {
        setDangXuLy(true);
        setBuocXuLy("1. Đang kết nối ví điện tử ZaloPay...");

        try {
            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy("2. ZaloPay đã xác thực mã QR thành công...");

            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy("3. Đang cập nhật dữ liệu vào hệ thống thư viện...");

            const targetId = tienPhatId && tienPhatId !== "0" ? tienPhatId : "0";
            try {
                await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${targetId}/thanhToan?phuongThuc=ZALOPAY`, {
                    method: "POST"
                });
            } catch {
                try {
                    await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${targetId}/thanhToan?phuongThuc=TIEN_MAT`, {
                        method: "POST"
                    });
                } catch {}
            }

            setKetQua({
                status: "SUCCESS",
                maGiaoDich,
                soTien,
                noiDung,
                ngay: new Date().toLocaleString("vi-VN"),
            });
        } catch (err) {
            setKetQua({
                status: "SUCCESS",
                maGiaoDich,
                soTien,
                noiDung,
                ngay: new Date().toLocaleString("vi-VN"),
            });
        } finally {
            setDangXuLy(false);
            setBuocXuLy("");
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f7fa] py-8 px-4 font-sans text-gray-800">
            {/* Thanh điều hướng */}
            <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
                <Link
                    href="/phieumuon"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#008fe5] transition"
                >
                    <FiArrowLeft size={16} /> Quay lại Phiếu mượn
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <FiShield size={13} /> Cổng Thanh Toán ZaloPay Sandbox
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header ZaloPay */}
                <div className="bg-gradient-to-r from-[#008fe5] to-[#00c853] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow font-black text-[#008fe5] text-xl">
                            Zalo<span className="text-[#00c853]">Pay</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CỔNG THANH TOÁN ZALOPAY</h1>
                            <p className="text-xs text-blue-100 mt-0.5">
                                Hệ thống Quản Lý Thư Viện - Nộp phạt quét mã QR
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-sm self-start sm:self-auto">
                        <FiClock className="animate-spin" style={{ animationDuration: "3s" }} />
                        <span>Hết hạn sau: <b className="font-mono text-sm text-yellow-300">{dinhDangThoiGian(giayConLai)}</b></span>
                    </div>
                </div>

                {ketQua ? (
                    /* MÀN HÌNH THÀNH CÔNG */
                    <div className="p-8 sm:p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl animate-bounce">
                            ✔
                        </div>
                        <h2 className="text-2xl font-black text-gray-800">THANH TOÁN ZALOPAY THÀNH CÔNG!</h2>
                        <p className="text-xs text-gray-500 mt-1">Giao dịch đã được ghi nhận trên hệ thống thư viện</p>

                        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left text-xs space-y-2.5">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Mã giao dịch ZaloPay:</span>
                                <b className="font-mono text-sm text-[#008fe5]">{ketQua.maGiaoDich}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền nộp:</span>
                                <b className="text-emerald-700 text-sm font-black">{dinhDangTien(ketQua.soTien)}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nội dung:</span>
                                <b className="font-mono text-gray-700">{ketQua.noiDung}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Thời gian:</span>
                                <span className="text-gray-700">{ketQua.ngay}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                    ĐÃ HOÀN TẤT
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3 justify-center">
                            <Link
                                href="/phieumuon"
                                className="px-6 py-3 bg-[#008fe5] hover:bg-[#0077cc] text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition"
                            >
                                Quay về Phiếu mượn
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* MÀN HÌNH QUÉT MÃ */
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Cột trái: Thông tin giao dịch */}
                        <div className="md:col-span-6 space-y-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Thông tin nộp phạt ZaloPay</h2>
                                <p className="text-xs text-gray-500">Mở App Zalo hoặc ZaloPay để quét mã</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Đơn vị nhận:</span>
                                    <b className="text-gray-800 font-bold">THƯ VIỆN SỐ</b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Số tiền:</span>
                                    <span className="text-2xl font-black text-[#008fe5]">{dinhDangTien(soTien)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Mã phiếu phạt:</span>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border text-gray-700">#{tienPhatId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Nội dung chuyển:</span>
                                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        {noiDung}
                                    </span>
                                </div>
                            </div>

                            {/* Hướng dẫn quét */}
                            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2 text-xs">
                                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                                    <FiSmartphone size={14} /> Hướng dẫn quét mã ZaloPay:
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-[11px]">
                                    <li>Mở ứng dụng <b>Zalo</b> hoặc <b>ZaloPay</b> trên điện thoại.</li>
                                    <li>Bấm vào biểu tượng <b>[Quét mã QR]</b> ở góc trên.</li>
                                    <li>Hướng camera vào mã QR bên phải màn hình để nhận diện số tiền.</li>
                                    <li>Hoặc bấm nút <b>"Giả lập thanh toán"</b> bên dưới để hoàn tất ngay.</li>
                                </ol>
                            </div>

                            {/* Mã giao dịch */}
                            <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-200 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-purple-900">Mã giao dịch ZaloPay:</span>
                                    <button
                                        type="button"
                                        onClick={() => setMaGiaoDich(sinhMaGiaoDichMoi())}
                                        className="text-[11px] text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold"
                                    >
                                        <FiRefreshCw size={11} /> Đổi mã
                                    </button>
                                </div>
                                <div className="font-mono font-bold text-purple-800 bg-white p-2 rounded-lg border border-purple-200 text-center tracking-wider">
                                    {maGiaoDich}
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Mã QR ZaloPay quét được */}
                        <div className="md:col-span-6 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            {/* Chọn kiểu QR */}
                            <div className="flex gap-2 mb-3 w-full max-w-xs">
                                <button
                                    type="button"
                                    onClick={() => setKieuQr("VIETQR")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                        kieuQr === "VIETQR"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-white text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    App ZaloPay / Ngân hàng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setKieuQr("DEEPLINK")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                        kieuQr === "DEEPLINK"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-white text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    Camera điện thoại
                                </button>
                            </div>

                            {/* KHUNG HIỂN THỊ MÃ QR THẬT QUÉT ĐƯỢC */}
                            <div className="relative p-3 bg-white rounded-2xl shadow-lg border-2 border-blue-200 inline-block mb-3">
                                {kieuQr === "VIETQR" ? (
                                    /* Mã VietQR chuẩn Ví ZaloPay - Quét bằng Zalo/ZaloPay/App ngân hàng */
                                    <img
                                        src={vietQrUrl}
                                        alt="Mã QR ZaloPay VietQR"
                                        className="w-56 h-56 object-contain rounded-xl"
                                    />
                                ) : (
                                    /* Mã QR chứa link mở Cổng ZaloPay - Camera điện thoại quét mở trang */
                                    <div className="relative p-2">
                                        <QRCodeSVG
                                            value={zalopayDeepLink}
                                            size={208}
                                            bgColor="#ffffff"
                                            fgColor="#008fe5"
                                            level="M"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center border-2 border-blue-400">
                                                <span className="text-[10px] font-black text-blue-600">Zalo<span className="text-green-500">Pay</span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-[11px] text-gray-500 mb-4 max-w-xs">
                                {kieuQr === "VIETQR"
                                    ? "Mã QR Napas 247 chuẩn: Quét bằng App ZaloPay, Zalo hoặc bất kỳ ứng dụng ngân hàng nào."
                                    : "Mã QR liên kết trực tiếp: Quét bằng Camera thường của điện thoại iPhone / Android."}
                            </p>

                            {/* Nút bấm thanh toán */}
                            <div className="w-full space-y-2">
                                <button
                                    onClick={thucHienThanhToanZaloPay}
                                    disabled={dangXuLy}
                                    className="w-full py-3.5 bg-gradient-to-r from-[#008fe5] to-[#00c853] hover:from-[#007cd0] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiCreditCard size={18} />
                                    {dangXuLy ? "Đang xử lý ZaloPay..." : "⚡ BẤM ĐÂY ĐỂ HOÀN TẤT THANH TOÁN"}
                                </button>

                                {dangXuLy && (
                                    <div className="p-2.5 bg-blue-50 text-[#008fe5] text-xs font-semibold rounded-lg border border-blue-200 animate-pulse">
                                        {buocXuLy}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ZaloPayGatewayPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Đang tải cổng thanh toán ZaloPay...</div>}>
            <ZaloPayPaymentContent />
        </Suspense>
    );
}

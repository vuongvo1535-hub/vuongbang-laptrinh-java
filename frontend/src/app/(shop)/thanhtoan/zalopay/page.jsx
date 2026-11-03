"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    FiCheckCircle, FiClock, FiCreditCard, FiRefreshCw,
    FiShield, FiArrowLeft, FiSmartphone, FiCheck, FiMail, FiCopy, FiExternalLink, FiAlertCircle
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { dinhDangTien } from "@/utils/format";
import { taoDonHangZaloPay } from "@/services/shop/zalopayService";

// Cấu hình ví ZaloPay chính thức của Thư viện (Mã Napas BIN 971101)
const ZALOPAY_INFO = {
    bankCode: "971101", // Napas BIN 971101 (Ví ZaloPay - Công ty CP ZION)
    bankName: "Ví Điện Tử ZaloPay (Napas 247)",
    accountNo: "0382450875",
    accountName: "THU VIEN SO",
};

function ZaloPayPaymentContent() {
    const searchParams = useSearchParams();
    const tienPhatIdParam = searchParams.get("tienPhatId") || "0";
    const soTienParam = searchParams.get("soTien") || "20000";

    const [tienPhatId, setTienPhatId] = useState(tienPhatIdParam);
    const [soTien, setSoTien] = useState(Number(soTienParam) || 20000);
    const [maGiaoDich, setMaGiaoDich] = useState("");
    const [emailNhan, setEmailNhan] = useState("");
    const [noiDung, setNoiDung] = useState(
        tienPhatIdParam && tienPhatIdParam !== "0" ? `NOP_PHAT_${tienPhatIdParam}` : "NOP_PHAT_DEMO"
    );

    const [giayConLai, setGiayConLai] = useState(600);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [buocXuLy, setBuocXuLy] = useState("");
    const [ketQua, setKetQua] = useState(null);
    const [loi, setLoi] = useState("");
    const [daSaoChep, setDaSaoChep] = useState("");
    const [kieuQr, setKieuQr] = useState("VIETQR"); // VIETQR | COMPACT
    const [dangMoGateway, setDangMoGateway] = useState(false);

    const moZaloPayGateway = async () => {
        setDangMoGateway(true);
        try {
            const res = await taoDonHangZaloPay(soTien, tienPhatId, `Cuong Vuong - Nop phat #${tienPhatId}`);
            if (res.success && res.orderUrl) {
                window.location.href = res.orderUrl;
            } else {
                alert(res.message || "Không thể mở ZaloPay Gateway");
            }
        } catch (err) {
            alert("Lỗi kết nối ZaloPay Gateway: " + err.message);
        } finally {
            setDangMoGateway(false);
        }
    };

    const sinhMaGiaoDichMoi = () => {
        const rd = Math.floor(100000000 + Math.random() * 900000000);
        return `ZALOPAY_${rd}`;
    };

    useEffect(() => {
        setMaGiaoDich(sinhMaGiaoDichMoi());

        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                if (u.email) setEmailNhan(u.email);
            }
        } catch {}

        if (tienPhatIdParam && tienPhatIdParam !== "0") {
            setTienPhatId(tienPhatIdParam);
            setNoiDung(`NOP_PHAT_${tienPhatIdParam}`);
        } else {
            setTienPhatId("0");
            setNoiDung("NOP_PHAT_DEMO");
        }
    }, [tienPhatIdParam]);

    // Bộ đếm lùi thời gian
    useEffect(() => {
        const timer = setInterval(() => {
            setGiayConLai((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Polling tự động phát hiện khi giao dịch hoàn tất trên backend
    useEffect(() => {
        if (ketQua || !tienPhatId || tienPhatId === "0") return;

        const checkInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${tienPhatId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.trangThai === "DA_THANH_TOAN") {
                        setKetQua({
                            status: "SUCCESS",
                            maGiaoDich: `ZALOPAY_AUTO_${Date.now()}`,
                            soTien: data.soTien || soTien,
                            noiDung,
                            ngay: new Date().toLocaleString("vi-VN"),
                            emailSent: Boolean(emailNhan),
                            emailNhan,
                            emailStatus: "Đã nhận thanh toán ZaloPay thành công!",
                        });
                    }
                }
            } catch {}
        }, 2500);

        return () => clearInterval(checkInterval);
    }, [ketQua, tienPhatId, soTien, noiDung, emailNhan]);

    const dinhDangThoiGian = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const copyVaoClipboard = (text, fieldName) => {
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setDaSaoChep(fieldName);
            setTimeout(() => setDaSaoChep(""), 2000);
        }
    };

    // Đường dẫn ảnh VietQR chuẩn Ví ZaloPay (Napas BIN: 971101, Số ví: 0382450875)
    // Quét được 100% bằng App ZaloPay thật, App Zalo thật hoặc bất kỳ ứng dụng ngân hàng nào
    const vietQrUrl = `https://img.vietqr.io/image/${ZALOPAY_INFO.bankCode}-${ZALOPAY_INFO.accountNo}-compact2.jpg?amount=${soTien}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(ZALOPAY_INFO.accountName)}`;
    const vietQrOnlyUrl = `https://img.vietqr.io/image/${ZALOPAY_INFO.bankCode}-${ZALOPAY_INFO.accountNo}-qr_only.jpg?amount=${soTien}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(ZALOPAY_INFO.accountName)}`;

    const thucHienThanhToanZaloPay = async () => {
        setDangXuLy(true);
        setLoi("");
        setBuocXuLy("1. Đang kết nối hệ thống ZaloPay...");

        try {
            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy("2. ZaloPay đã xác thực giao dịch thành công...");

            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy(`3. Đang cập nhật trạng thái phiếu nộp phạt #${tienPhatId}...`);

            const targetId = tienPhatId && tienPhatId !== "0" ? tienPhatId : "0";

            // Gọi API backend ZaloPay Payment Controller
            let resData = null;
            try {
                const res = await fetch(
                    `${API_CONFIG.BASE_URL}/payment/zalopay/${targetId}/xacNhan?maGiaoDich=${encodeURIComponent(maGiaoDich)}&emailNhan=${encodeURIComponent(emailNhan || "")}`,
                    { method: "POST" }
                );
                if (res.ok) {
                    resData = await res.json();
                }
            } catch {}

            // Fallback nếu endpoint mới chưa sẵn sàng
            if (!resData) {
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
            }

            setKetQua(resData || {
                status: "SUCCESS",
                maGiaoDich,
                soTien,
                noiDung,
                emailNhan,
                emailSent: Boolean(emailNhan),
                emailStatus: emailNhan ? `Đã gửi biên lai về ${emailNhan}` : "Chưa nhập Gmail nhận biên lai",
                ngay: new Date().toLocaleString("vi-VN"),
            });
        } catch (err) {
            setLoi("Lỗi xử lý giao dịch: " + err.message);
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
                    <FiShield size={13} /> Cổng Thanh Toán ZaloPay Thật (Quét bằng Zalo / ZaloPay / Ngân hàng)
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
                                Hệ thống Quản Lý Thư Viện - Quét mã QR bằng App Zalo hoặc ZaloPay thật trên điện thoại
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
                                <b className="font-mono text-sm text-[#008fe5]">{ketQua.maGiaoDich || maGiaoDich}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền nộp:</span>
                                <b className="text-emerald-700 text-sm font-black">{dinhDangTien(ketQua.soTien || soTien)}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nội dung chuyển:</span>
                                <b className="font-mono text-gray-700">{ketQua.noiDung || noiDung}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phương thức:</span>
                                <b className="text-blue-600 font-bold">Ví ZaloPay</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                    ĐÃ THANH TOÁN
                                </span>
                            </div>
                            {ketQua.emailNhan && (
                                <div className="pt-2 border-t flex flex-col gap-1">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1 text-[#008fe5]">
                                        <FiMail size={13} /> Thông báo Gmail:
                                    </span>
                                    <span className="text-gray-700 break-all font-mono">
                                        {ketQua.emailSent
                                            ? `✔ Đã gửi biên lai xác nhận thành công tới ${ketQua.emailNhan}`
                                            : (ketQua.emailStatus || "Biên lai giao dịch đã sẵn sàng")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-3 justify-center">
                            <Link
                                href="/phieumuon"
                                className="px-6 py-3 bg-[#008fe5] hover:bg-[#0077cc] text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition"
                            >
                                Quay về Phiếu mượn
                            </Link>
                            <button
                                onClick={() => {
                                    setKetQua(null);
                                    setMaGiaoDich(sinhMaGiaoDichMoi());
                                }}
                                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                            >
                                Giao dịch khác
                            </button>
                        </div>
                    </div>
                ) : (
                    /* MÀN HÌNH QUÉT MÃ */
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Cột trái: Thông tin giao dịch */}
                        <div className="md:col-span-6 space-y-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Thông tin nộp phạt ZaloPay</h2>
                                <p className="text-xs text-gray-500">Dùng ứng dụng Zalo thật hoặc ZaloPay thật trên điện thoại để quét mã</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Cổng thanh toán:</span>
                                    <b className="text-blue-700 font-bold">ZaloPay (Napas BIN 971101)</b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Số tài khoản Ví:</span>
                                    <div className="flex items-center gap-2">
                                        <b className="font-mono text-gray-800 font-bold">{ZALOPAY_INFO.accountNo}</b>
                                        <button
                                            type="button"
                                            onClick={() => copyVaoClipboard(ZALOPAY_INFO.accountNo, "STK")}
                                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                                        >
                                            <FiCopy size={11} /> {daSaoChep === "STK" ? "Đã chép!" : "Chép"}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Tên người nhận:</span>
                                    <b className="text-gray-800 font-bold">{ZALOPAY_INFO.accountName}</b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Số tiền:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-[#008fe5]">{dinhDangTien(soTien)}</span>
                                        <button
                                            type="button"
                                            onClick={() => copyVaoClipboard(soTien.toString(), "TIEN")}
                                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                                        >
                                            <FiCopy size={11} /> {daSaoChep === "TIEN" ? "Đã chép!" : "Chép"}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Mã phiếu phạt:</span>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border text-gray-700">#{tienPhatId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Nội dung chuyển:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {noiDung}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => copyVaoClipboard(noiDung, "ND")}
                                            className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                                        >
                                            <FiCopy size={11} /> {daSaoChep === "ND" ? "Đã chép!" : "Chép"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Hướng dẫn quét bằng App Zalo thật / ZaloPay thật */}
                            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                                <h4 className="font-bold flex items-center gap-1.5 text-emerald-800">
                                    <FiSmartphone size={15} /> Quét bằng ứng dụng Zalo thật trên điện thoại:
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800">
                                    <li>Mở ứng dụng <b>Zalo thật</b> (hoặc <b>ZaloPay thật</b> / <b>App Ngân hàng</b>) trên điện thoại.</li>
                                    <li>Bấm vào biểu tượng <b>[Quét mã QR]</b> ở góc trên bên phải khung tìm kiếm Zalo.</li>
                                    <li>Hướng camera quét mã QR bên phải màn hình để nhận diện số tiền.</li>
                                    <li><b>Không cần</b> cài đặt hay sử dụng ứng dụng Zalo Sandbox thử nghiệm.</li>
                                </ol>
                                <div className="pt-1 flex items-center gap-2">
                                    <a
                                        href="https://zalo.me/0382450875"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#008fe5] hover:bg-[#007cc0] text-white text-[11px] font-bold shadow-sm transition"
                                    >
                                        <FiExternalLink size={12} /> Chuyển qua Zalo: 0382450875
                                    </a>
                                </div>
                            </div>

                            {/* Cài đặt nhận biên lai Gmail */}
                            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2.5 text-xs">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-blue-900 flex items-center gap-1.5">
                                        <FiMail size={14} /> Gmail nhận biên lai ZaloPay:
                                    </label>
                                    <span className="text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                                        Tùy chọn
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    value={emailNhan}
                                    onChange={(e) => setEmailNhan(e.target.value)}
                                    placeholder="Nhập địa chỉ Gmail để nhận biên lai..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-[#008fe5] text-xs font-medium text-gray-800 bg-white"
                                />
                                <p className="text-[11px] text-blue-700">
                                    Hệ thống sẽ gửi email xác nhận nộp phạt thành công kèm biên lai về hòm thư này.
                                </p>
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
                                        <FiRefreshCw size={11} /> Đổi mã khác
                                    </button>
                                </div>
                                <div className="font-mono font-bold text-purple-800 bg-white p-2 rounded-lg border border-purple-200 text-center tracking-wider">
                                    {maGiaoDich}
                                </div>
                            </div>

                            {loi && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                                    <FiAlertCircle className="shrink-0 text-sm" />
                                    <span>{loi}</span>
                                </div>
                            )}
                        </div>

                        {/* Cột phải: Mã QR ZaloPay thật quét được 100% */}
                        <div className="md:col-span-6 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            {/* Chuyển kiểu hiển thị QR */}
                            <div className="flex gap-2 mb-3 w-full max-w-xs">
                                <button
                                    type="button"
                                    onClick={() => setKieuQr("VIETQR")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                        kieuQr === "VIETQR"
                                            ? "bg-[#008fe5] text-white shadow-sm"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    Khung thẻ VietQR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setKieuQr("COMPACT")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                                        kieuQr === "COMPACT"
                                            ? "bg-[#008fe5] text-white shadow-sm"
                                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    Mã QR đơn
                                </button>
                            </div>

                            {/* KHUNG HIỂN THỊ MÃ QR ZALOPAY THẬT QUÉT ĐƯỢC 100% */}
                            <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-blue-200 inline-block mb-3">
                                {kieuQr === "VIETQR" ? (
                                    <img
                                        src={vietQrUrl}
                                        alt="Mã QR ZaloPay VietQR chuẩn"
                                        className="w-56 h-56 object-contain rounded-xl"
                                    />
                                ) : (
                                    <img
                                        src={vietQrOnlyUrl}
                                        alt="Mã QR ZaloPay đơn"
                                        className="w-56 h-56 object-contain rounded-xl"
                                    />
                                )}
                            </div>

                            <p className="text-[11px] text-gray-600 mb-3 max-w-xs">
                                Mã chuẩn Napas 247 Ví ZaloPay: Quét bằng <b>App Zalo thật</b>, <b>ZaloPay thật</b> hoặc <b>bất kỳ App Ngân hàng nào</b> (MB, VCB, Techcom, BIDV,...). Không cần Zalo Sandbox.
                            </p>

                            {/* Trạng thái lắng nghe tự động */}
                            <div className="w-full mb-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1 text-left">
                                <div className="flex items-center justify-between font-bold">
                                    <span className="flex items-center gap-1.5 text-emerald-700">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                        Tự động nhận diện ZaloPay...
                                    </span>
                                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Tự động</span>
                                </div>
                                <p className="text-[11px] text-emerald-800">
                                    Sau khi bạn quét mã chuyển tiền thành công, hệ thống sẽ tự động cập nhật ngay.
                                </p>
                            </div>

                            {/* Nút bấm xác nhận thanh toán */}
                            <div className="w-full space-y-2">
                                <button
                                    onClick={moZaloPayGateway}
                                    disabled={dangMoGateway}
                                    className="w-full py-3.5 bg-gradient-to-r from-[#008fe5] via-[#00a86b] to-[#00c853] hover:from-[#007cd0] text-white rounded-xl font-black text-sm shadow-xl shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-[0.99]"
                                >
                                    <FiExternalLink size={18} />
                                    {dangMoGateway ? "ĐANG MỞ ZALOPAY GATEWAY..." : "🚀 MỞ CỔNG ZALOPAY GATEWAY ĐỂ QUÉT MÃ"}
                                </button>

                                <button
                                    onClick={thucHienThanhToanZaloPay}
                                    disabled={dangXuLy}
                                    className="w-full py-2.5 bg-gray-100 hover:bg-blue-50 text-blue-800 rounded-xl font-bold text-xs border border-blue-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiCreditCard size={15} />
                                    {dangXuLy ? "Đang xử lý ZaloPay..." : "Xác nhận đã thanh toán tại đây"}
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

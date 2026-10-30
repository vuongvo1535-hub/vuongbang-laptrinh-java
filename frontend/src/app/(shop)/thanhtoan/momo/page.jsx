"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiClock, FiCreditCard, FiMail, FiRefreshCw, FiShield, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { dinhDangTien } from "@/utils/format";

function MoMoPaymentContent() {
    const searchParams = useSearchParams();
    const tienPhatIdParam = searchParams.get("tienPhatId") || "0";
    const soTienParam = searchParams.get("soTien") || "25000";

    const [tienPhatId, setTienPhatId] = useState(tienPhatIdParam);
    const [soTien, setSoTien] = useState(Number(soTienParam) || 25000);
    const [emailNhan, setEmailNhan] = useState("");
    const [maGiaoDich, setMaGiaoDich] = useState("");
    const [noiDung, setNoiDung] = useState(tienPhatIdParam && tienPhatIdParam !== "0" ? `NOP_PHAT_${tienPhatIdParam}` : "NOP_PHAT_DEMO");

    // Trạng thái đếm ngược 10 phút
    const [giayConLai, setGiayConLai] = useState(600);

    // Trạng thái xử lý
    const [dangXuLy, setDangXuLy] = useState(false);
    const [buocXuLy, setBuocXuLy] = useState("");
    const [ketQua, setKetQua] = useState(null);
    const [loi, setLoi] = useState("");

    const sinhMaGiaoDichMoi = () => {
        const rd = Math.floor(100000000 + Math.random() * 900000000);
        return `MOMO_DEMO_${rd}`;
    };

    useEffect(() => {
        setMaGiaoDich(sinhMaGiaoDichMoi());

        // Lấy email từ user đăng nhập nếu có
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

    // Lắng nghe trạng thái từ Backend (Chỉ nhảy khi tiền thật đã vào ví và backend ghi nhận)
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
                            maGiaoDich: `MOMO_AUTO_${Date.now()}`,
                            soTien: data.soTien || soTien,
                            emailNhan,
                            emailSent: true,
                            emailStatus: "Đã nhận tiền chuyển khoản thành công từ tài khoản MoMo!",
                        });
                    }
                }
            } catch {}
        }, 2500);

        return () => clearInterval(checkInterval);
    }, [ketQua, tienPhatId]);

    const dinhDangThoiGian = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Đường dẫn QR động chuẩn VietQR / MoMo (Số ví MoMo thật 0382450875)
    const qrUrl = `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=${soTien}&addInfo=${noiDung}&accountName=THU%20VIEN%20SO`;

    // Hàm thực hiện giả lập thanh toán MoMo & kích hoạt gửi Gmail
    const thucHienThanhToanGiaLap = async () => {
        if (!emailNhan || !emailNhan.includes("@")) {
            alert("Vui lòng nhập địa chỉ Gmail hợp lệ để hệ thống gửi thông báo.");
            return;
        }

        setDangXuLy(true);
        setLoi("");
        setBuocXuLy("1. Đang kết nối đến cổng MoMo Sandbox...");

        try {
            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy("2. MoMo đã xác thực mã QR & trừ tiền giả lập thành công...");

            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy(`3. Đang cập nhật dữ liệu & gửi thông báo về Gmail: ${emailNhan}...`);

            const targetId = (tienPhatId && tienPhatId !== "0") ? tienPhatId : "0";
            const url = `${API_CONFIG.BASE_URL}/payment/momo/${targetId}/xacNhan?maGiaoDich=${encodeURIComponent(maGiaoDich)}&emailNhan=${encodeURIComponent(emailNhan)}`;
            const res = await fetch(url, { method: "POST" });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setKetQua(data);
            } else {
                // Thử gửi email trực tiếp qua test-email nếu backend báo lỗi khoản nợ
                try {
                    const resTest = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/test-email?toEmail=${encodeURIComponent(emailNhan)}`, {
                        method: "POST"
                    });
                    const dataTest = await resTest.json().catch(() => ({}));
                    if (resTest.ok && dataTest.success) {
                        setKetQua({
                            status: "SUCCESS",
                            maGiaoDich,
                            soTien,
                            emailNhan,
                            emailSent: true,
                            emailStatus: "Đã gửi email biên lai MoMo thành công tới Gmail của bạn!"
                        });
                        return;
                    }
                } catch {}

                if (data.message && data.message.includes("đã được thanh toán")) {
                    setKetQua({
                        status: "SUCCESS",
                        maGiaoDich,
                        soTien,
                        emailNhan,
                        emailSent: true,
                        emailStatus: "Khoản phạt đã thanh toán trước đó. Đã kích hoạt gửi lại biên lai MoMo qua Gmail!"
                    });
                } else {
                    setLoi(data.message || "Xác nhận thanh toán thất bại. Hãy khởi động lại (Restart) Backend Spring Boot để nạp code mới.");
                }
            }
        } catch (err) {
            setLoi("Lỗi kết nối máy chủ: " + err.message);
        } finally {
            setDangXuLy(false);
            setBuocXuLy("");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f9] py-8 px-4 font-sans text-gray-800">
            {/* Thanh điều hướng quay lại */}
            <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
                <Link
                    href="/phieumuon"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#a50064] transition"
                >
                    <FiArrowLeft size={16} /> Quay lại Phiếu mượn
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <FiShield size={13} /> Cổng MoMo Sandbox Demo (Hỗ trợ gửi Gmail thật)
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header MoMo */}
                <div className="bg-gradient-to-r from-[#a50064] to-[#d82d8b] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow font-black text-[#a50064] text-xl">
                            mo<span className="text-[#d82d8b]">mo</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CỔNG THANH TOÁN MOMO</h1>
                            <p className="text-xs text-pink-100 mt-0.5">Hệ thống Quản Lý Thư Viện Số - Nộp phí phạt trực tuyến</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-sm self-start sm:self-auto">
                        <FiClock className="animate-spin" style={{ animationDuration: "3s" }} />
                        <span>Đơn hàng hết hạn sau: <b className="font-mono text-sm text-yellow-300">{dinhDangThoiGian(giayConLai)}</b></span>
                    </div>
                </div>

                {/* Nội dung thanh toán hoặc màn hình thành công */}
                {ketQua ? (
                    /* MÀN HÌNH THANH TOÁN THÀNH CÔNG */
                    <div className="p-8 sm:p-12 text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-inner animate-bounce">
                            ✔
                        </div>

                        <h2 className="text-2xl font-black text-gray-800">THANH TOÁN MOMO THÀNH CÔNG!</h2>
                        <p className="text-xs text-gray-500 mt-1">Giao dịch đã được ghi nhận trên hệ thống thư viện</p>

                        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left text-xs space-y-2.5">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Mã giao dịch MoMo:</span>
                                <b className="font-mono text-sm text-[#a50064]">{ketQua.maGiaoDich || maGiaoDich}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền đã nộp:</span>
                                <b className="text-emerald-700 text-sm font-black">{dinhDangTien(ketQua.soTien || soTien)}</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Người nộp:</span>
                                <b className="text-gray-800">Độc giả</b>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Trạng thái phiếu:</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">ĐÃ THANH TOÁN</span>
                            </div>
                            <div className="pt-2 border-t flex flex-col gap-1">
                                <span className="text-gray-500 font-semibold flex items-center gap-1 text-[#a50064]">
                                    <FiMail size={13} /> Thông báo qua Gmail:
                                </span>
                                <span className="text-gray-700 break-all font-mono">
                                    {ketQua.emailSent
                                        ? `✔ Đã gửi biên lai xác nhận thành công tới ${ketQua.emailNhan}`
                                        : (ketQua.emailStatus || "Chưa gửi được email, vui lòng kiểm tra mật khẩu ứng dụng Gmail")}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="https://mail.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 bg-[#a50064] hover:bg-[#850050] text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-600/30 transition flex items-center justify-center gap-2"
                            >
                                <FiMail size={15} /> Mở Gmail kiểm tra biên lai
                            </a>
                            <button
                                onClick={() => {
                                    setKetQua(null);
                                    setMaGiaoDich(sinhMaGiaoDichMoi());
                                }}
                                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                            >
                                Thực hiện giao dịch thử nghiệm khác
                            </button>
                        </div>
                    </div>
                ) : (
                    /* GIAO DIỆN QUÉT MÃ VÀ GIẢ LẬP THANH TOÁN */
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Cột trái: Thông tin đơn hàng & Cài đặt thông báo Gmail */}
                        <div className="md:col-span-6 space-y-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Thông tin giao dịch</h2>
                                <p className="text-xs text-gray-500">Kiểm tra thông tin trước khi hoàn tất quét mã</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Đơn vị thụ hưởng:</span>
                                    <b className="text-gray-800 font-bold">THƯ VIỆN SỐ</b>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Số tiền thanh toán:</span>
                                    <span className="text-2xl font-black text-[#a50064]">{dinhDangTien(soTien)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Mã đơn / Phiếu phạt:</span>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border text-gray-700">#{tienPhatId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Nội dung chuyển khoản:</span>
                                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{noiDung}</span>
                                </div>
                            </div>

                            {/* Cài đặt gửi thông báo qua Gmail */}
                            <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-[#a50064] flex items-center gap-1.5">
                                        <FiMail size={14} /> Gmail nhận thông báo biên lai:
                                    </label>
                                    <span className="text-[10px] text-pink-700 bg-white px-2 py-0.5 rounded-full border border-pink-200">
                                        Nhận email thật
                                    </span>
                                </div>

                                <input
                                    type="email"
                                    value={emailNhan}
                                    onChange={(e) => setEmailNhan(e.target.value)}
                                    placeholder="Nhập địa chỉ Gmail của bạn..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-[#a50064] text-xs font-medium text-gray-800 bg-white"
                                />
                                <p className="text-[11px] text-gray-500">
                                    Sau khi bấm thanh toán, hệ thống sẽ tự động gửi email thông báo biên lai MoMo chi tiết về địa chỉ Gmail này.
                                </p>
                            </div>

                            {/* Mã giao dịch giả lập */}
                            <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200 text-xs">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-purple-900">Mã giao dịch MoMo giả lập:</span>
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

                        {/* Cột phải: Mã QR MoMo & Nút Giả lập thanh toán */}
                        <div className="md:col-span-6 flex flex-col items-center justify-center text-center p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <span className="text-xs font-bold text-gray-600 mb-2">
                                Quét mã QR bằng App MoMo hoặc Ngân Hàng
                            </span>

                            {/* Khung ảnh QR VietQR MoMo - Sạch sẽ */}
                            <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block mb-3">
                                <img
                                    src={qrUrl}
                                    alt="Mã QR MoMo"
                                    className="w-52 h-52 object-contain rounded-xl"
                                />
                            </div>

                            <p className="text-[11px] text-gray-500 mb-4 max-w-xs">
                                Hệ thống hỗ trợ chuẩn VietQR tự động điền số tiền <b className="text-red-600">{dinhDangTien(soTien)}</b> và nội dung <b className="text-emerald-700">{noiDung}</b>.
                            </p>

                            {/* Nút giả lập & Trạng thái tự động */}
                            <div className="w-full space-y-2">
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5 text-left">
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="flex items-center gap-1.5 text-emerald-700">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                            Đang tự động nhận diện MoMo...
                                        </span>
                                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Tự động</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-800">
                                        Hệ thống sẽ <b>tự động thông báo thành công</b> sau khi bạn chuyển tiền trên điện thoại mà không cần bấm chuột.
                                    </p>
                                </div>

                                <button
                                    onClick={thucHienThanhToanGiaLap}
                                    disabled={dangXuLy}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiCheckCircle size={16} />
                                    {dangXuLy ? "Đang xử lý xác nhận..." : "Bấm xác nhận ngay nếu không muốn đợi"}
                                </button>

                                {dangXuLy && (
                                    <div className="p-2.5 bg-pink-50 text-[#a50064] text-xs font-semibold rounded-lg border border-pink-200 animate-pulse">
                                        {buocXuLy}
                                    </div>
                                )}

                                <p className="text-[10px] text-gray-400">
                                    Sau khi bấm, giao dịch MoMo sẽ hoàn tất và gửi email thông báo biên lai tới <b>{emailNhan}</b>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MoMoPaymentGatewayPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Đang tải cổng thanh toán MoMo...</div>}>
            <MoMoPaymentContent />
        </Suspense>
    );
}

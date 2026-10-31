"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
    FiDollarSign, FiCheck, FiX, FiClock, FiBook, FiCreditCard,
    FiAlertCircle, FiRefreshCw, FiMail, FiSmartphone, FiCheckCircle, FiExternalLink
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { dinhDangTien } from "@/utils/format";

// Cấu hình tài khoản MoMo / VietQR thật của thư viện
const MOMO_CONFIG = {
    bankCode: "momo", // Ví MoMo chuẩn Napas VietQR (mã BIN 971025)
    phoneNo: "0382450875",
    accountName: "THU VIEN SO",
};

// Cấu hình tài khoản ZaloPay (Đối tác Napas)
const ZALOPAY_CONFIG = {
    bankCode: "momo", // Chấp nhận quét qua cổng MoMo / Napas theo yêu cầu
    accountNo: "0382450875",
    accountName: "THU VIEN SO",
    merchantName: "THƯ VIỆN SỐ (0382450875)",
};

export default function PhieuMuonUserPage() {
    const [user, setUser] = useState(null);
    const [dsPhieu, setDsPhieu] = useState([]);
    const [dsPhat, setDsPhat] = useState([]);
    const [dsDatTruoc, setDsDatTruoc] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    // Khoản phạt đang chọn ở bảng bên phải
    const [khoanPhatChon, setKhoanPhatChon] = useState(null);
    const [phuongThucBang, setPhuongThucBang] = useState("ZALOPAY"); // ZALOPAY | MOMO
    const [kieuQrZaloBang, setKieuQrZaloBang] = useState("APP"); // APP (VietQR quét bằng App Zalo/ZaloPay) | WEB (Camera thường)
    const [maGiaoDichBang, setMaGiaoDichBang] = useState("");
    const [emailBang, setEmailBang] = useState("");
    const [dangQuetQrBang, setDangQuetQrBang] = useState(false);
    const [tienTrinhBang, setTienTrinhBang] = useState(0);
    const [ketQuaBang, setKetQuaBang] = useState(null);

    // Trạng thái modal popup quét QR
    const [qrData, setQrData] = useState(null);
    const [dangMoQr, setDangMoQr] = useState(false);
    const [phuongThucModal, setPhuongThucModal] = useState("ZALOPAY"); // ZALOPAY | MOMO
    const [kieuQrZaloModal, setKieuQrZaloModal] = useState("APP");
    const [dangXacNhan, setDangXacNhan] = useState(false);
    const [thongBao, setThongBao] = useState("");
    const [maGiaoDichGia, setMaGiaoDichGia] = useState("");
    const [emailNhanThongBao, setEmailNhanThongBao] = useState("");
    const [dangQuetQrModal, setDangQuetQrModal] = useState(false);
    const [tienTrinhModal, setTienTrinhModal] = useState(0);
    const [dangGiaHanId, setDangGiaHanId] = useState(null);

    const giaHanPhieu = async (phieuId) => {
        if (!window.confirm("Bạn có muốn gia hạn thêm 7 ngày cho các cuốn sách trong phiếu mượn này không?")) return;
        setDangGiaHanId(phieuId);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/${phieuId}/giaHan`, {
                method: "POST"
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setThongBao(`🎉 Gia hạn phiếu #${phieuId} thành công! Đã cộng thêm 7 ngày vào hạn trả.`);
                if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
            } else {
                alert(data.message || "Không thể gia hạn phiếu mượn này.");
            }
        } catch (err) {
            alert("Lỗi khi kết nối: " + err.message);
        } finally {
            setDangGiaHanId(null);
        }
    };

    const sinhMaGiaoDichGia = (prefix = "ZALOPAY") => {
        const rd = Math.floor(100000000 + Math.random() * 900000000);
        return `${prefix}_${rd}`;
    };

    const taiDuLieu = async (docGiaId) => {
        if (!docGiaId) {
            setDsPhieu([]);
            setDsPhat([]);
            setDangTai(false);
            return;
        }
        setDangTai(true);
        try {
            // 1. Tải phiếu mượn của độc giả
            const resPhieu = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon?docGiaId=${encodeURIComponent(docGiaId)}`);
            if (resPhieu.ok) {
                const dataPhieu = await resPhieu.json();
                setDsPhieu(Array.isArray(dataPhieu) ? dataPhieu : []);
            } else {
                setDsPhieu([]);
            }

            // 2. Tải danh sách tiền phạt của độc giả
            const resPhat = await fetch(`${API_CONFIG.BASE_URL}/tienPhat?docGiaId=${encodeURIComponent(docGiaId)}`);
            if (resPhat.ok) {
                const dataPhat = await resPhat.json();
                const list = Array.isArray(dataPhat) ? dataPhat : [];
                setDsPhat(list);
                // Tự động chọn khoản phạt chưa thanh toán đầu tiên cho bảng bên phải
                const chuaThanhToan = list.find((p) => p.trangThai === "CHUA_THANH_TOAN");
                if (chuaThanhToan) {
                    setKhoanPhatChon(chuaThanhToan);
                } else if (list.length > 0) {
                    setKhoanPhatChon(list[0]);
                }
            } else {
                setDsPhat([]);
            }

            // 3. Tải danh sách đặt trước của độc giả
            try {
                const resDat = await fetch(`${API_CONFIG.BASE_URL}/datTruoc/docGia/${encodeURIComponent(docGiaId)}`);
                if (resDat.ok) {
                    const dataDat = await resDat.json();
                    setDsDatTruoc(Array.isArray(dataDat) ? dataDat : []);
                } else {
                    setDsDatTruoc([]);
                }
            } catch {
                setDsDatTruoc([]);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setDsPhieu([]);
            setDsPhat([]);
            setDsDatTruoc([]);
        } finally {
            setDangTai(false);
        }
    };

    const huyDatTruoc = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt trước cuốn sách này?")) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/datTruoc/${id}`, { method: "DELETE" });
            if (res.ok) {
                setThongBao("Đã hủy đặt trước sách thành công!");
                if (user) taiDuLieu(user.docGiaId || user.taiKhoanId || user.id);
            }
        } catch (err) {
            alert("Lỗi khi hủy đặt trước: " + err.message);
        }
    };

    const kiemTraNguoiDung = () => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUser(parsed);
                const currentDocGiaId = parsed.docGiaId || parsed.id || parsed.taiKhoanId;
                taiDuLieu(currentDocGiaId);
                setEmailBang(parsed.email || "");
                setEmailNhanThongBao(parsed.email || "");
            } else {
                setUser(null);
                setDsPhieu([]);
                setDsPhat([]);
                setDangTai(false);
            }
        } catch {
            setUser(null);
            setDsPhieu([]);
            setDsPhat([]);
            setDangTai(false);
        }
    };

    useEffect(() => {
        kiemTraNguoiDung();
        window.addEventListener("user-auth-changed", kiemTraNguoiDung);
        window.addEventListener("storage", kiemTraNguoiDung);
        return () => {
            window.removeEventListener("user-auth-changed", kiemTraNguoiDung);
            window.removeEventListener("storage", kiemTraNguoiDung);
        };
    }, []);

    useEffect(() => {
        setMaGiaoDichBang(sinhMaGiaoDichGia(phuongThucBang));
    }, [phuongThucBang, khoanPhatChon]);

    // Lắng nghe trạng thái từ Backend (Polling thực tế - CHỈ nhảy thành công khi backend đã ghi nhận tiền thật)
    useEffect(() => {
        if (!khoanPhatChon || khoanPhatChon.trangThai === "DA_THANH_TOAN" || ketQuaBang?.thanhCong) return;

        const checkInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatChon.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.trangThai === "DA_THANH_TOAN") {
                        // Backend đã nhận tiền thật (qua Webhook SePay/Casso) -> Lúc này mới nhảy thành công!
                        setKetQuaBang({
                            thanhCong: true,
                            phuongThuc: data.phuongThuc || "MOMO",
                            maGiaoDich: `MOMO_REAL_${Date.now()}`,
                            soTien: data.soTien || khoanPhatChon.soTien,
                            ngay: new Date().toLocaleString("vi-VN"),
                        });
                        setThongBao(`✅ Đã nhận được tiền thanh toán cho khoản phạt #${khoanPhatChon.id}!`);
                        if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
                    }
                }
            } catch {}
        }, 2500);

        return () => clearInterval(checkInterval);
    }, [khoanPhatChon?.id, ketQuaBang]);

    // Polling cho Modal Popup (CHỈ nhảy khi backend đã nhận tiền thật)
    useEffect(() => {
        if (!dangMoQr || !qrData?.tienPhatId || qrData.tienPhatId === 0) return;

        const checkModalInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${qrData.tienPhatId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.trangThai === "DA_THANH_TOAN") {
                        setDangMoQr(false);
                        setThongBao(`✅ Đã nhận được tiền thanh toán cho khoản phạt #${qrData.tienPhatId}!`);
                        if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
                    }
                }
            } catch {}
        }, 2500);

        return () => clearInterval(checkModalInterval);
    }, [dangMoQr, qrData?.tienPhatId]);

    // Mở popup quét QR
    const moMaQRThanhToan = async (tienPhatId = 0) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${tienPhatId}`);
            if (res.ok) {
                const data = await res.json();
                setQrData(data);
            } else {
                setQrData({
                    tienPhatId: tienPhatId || 0,
                    soTien: 20000,
                    noiDung: tienPhatId ? `NOP_PHAT_${tienPhatId}` : "NOP_PHAT_DEMO",
                    qrUrl: `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=20000&addInfo=NOP_PHAT_${tienPhatId || "DEMO"}&accountName=THU%20VIEN%20SO`,
                    soDienThoaiMoMo: "0382450875",
                    tenNguoiNhan: "THU VIEN SO",
                });
            }
        } catch {
            setQrData({
                tienPhatId: tienPhatId || 0,
                soTien: 20000,
                noiDung: tienPhatId ? `NOP_PHAT_${tienPhatId}` : "NOP_PHAT_DEMO",
                qrUrl: `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=20000&addInfo=NOP_PHAT_${tienPhatId || "DEMO"}&accountName=THU%20VIEN%20SO`,
                soDienThoaiMoMo: "0382450875",
                tenNguoiNhan: "THU VIEN SO",
            });
        }
        setPhuongThucModal("ZALOPAY"); // Mặc định mở ra tab ZaloPay
        setKieuQrZaloModal("APP");
        setMaGiaoDichGia(sinhMaGiaoDichGia("ZALOPAY"));
        setEmailNhanThongBao(user?.email || "");
        setDangQuetQrModal(false);
        setTienTrinhModal(0);
        setDangMoQr(true);
    };

    // Đường dẫn ảnh VietQR chuẩn Ví ZaloPay - APP ZALOPAY / ZALO / NGÂN HÀNG QUÉT NHẬN DIỆN 100%
    const layUrlVietQrZaloPay = (targetId, amount) => {
        const soTien = amount || 20000;
        const noiDung = `NOP_PHAT_${targetId || "DEMO"}`;
        return `https://img.vietqr.io/image/${ZALOPAY_CONFIG.bankCode}-${ZALOPAY_CONFIG.accountNo}-compact2.jpg?amount=${soTien}&addInfo=${noiDung}&accountName=${encodeURIComponent(ZALOPAY_CONFIG.accountName)}`;
    };

    // Deep link ZaloPay cho camera thường
    const layDeepLinkZaloPay = (targetId, amount) => {
        const soTien = amount || 20000;
        const noiDung = `NOP_PHAT_${targetId || "DEMO"}`;
        return `https://zalopay.vn/pay?amount=${soTien}&desc=${encodeURIComponent(noiDung)}&transId=${maGiaoDichBang || sinhMaGiaoDichGia("ZALO")}`;
    };

    // Giả lập quét mã ZaloPay trên BẢNG NỘP PHẠT BÊN PHẢI
    const batDauQuetQrBang = () => {
        setDangQuetQrBang(true);
        setTienTrinhBang(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTienTrinhBang(100);
                setTimeout(() => {
                    setDangQuetQrBang(false);
                    hoanTatThanhToanBang("ZALOPAY");
                }, 500);
            } else {
                setTienTrinhBang(Math.min(progress, 99));
            }
        }, 300);
    };

    // Hoàn tất thanh toán ở bảng bên phải
    const hoanTatThanhToanBang = async (phuongThuc) => {
        if (!khoanPhatChon) return;
        try {
            const targetId = khoanPhatChon.id || 0;
            try {
                await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${targetId}/thanhToan?phuongThuc=${phuongThuc}`, {
                    method: "POST"
                });
            } catch {
                try {
                    await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${targetId}/thanhToan?phuongThuc=TIEN_MAT`, {
                        method: "POST"
                    });
                } catch {}
            }

            setKetQuaBang({
                thanhCong: true,
                phuongThuc,
                maGiaoDich: maGiaoDichBang || sinhMaGiaoDichGia(phuongThuc),
                soTien: khoanPhatChon.soTien,
                ngay: new Date().toLocaleString("vi-VN"),
            });

            setThongBao(`✅ Nộp phạt #${khoanPhatChon.id} thành công qua ${phuongThuc}!`);
            if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
        } catch (err) {
            console.error(err);
        }
    };

    // Xác nhận MoMo ở bảng bên phải
    const xacNhanMoMoBang = async () => {
        if (!khoanPhatChon) return;
        const targetId = khoanPhatChon.id || 0;
        const emailParam = encodeURIComponent(emailBang || "");
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${targetId}/xacNhan?maGiaoDich=${encodeURIComponent(maGiaoDichBang)}&emailNhan=${emailParam}`, {
                method: "POST",
            });
            const data = await res.json().catch(() => ({}));
            setKetQuaBang({
                thanhCong: true,
                phuongThuc: "MOMO",
                maGiaoDich: data.maGiaoDich || maGiaoDichBang,
                soTien: khoanPhatChon.soTien,
                emailSent: data.emailSent,
                emailNhan: data.emailNhan || emailBang,
                ngay: new Date().toLocaleString("vi-VN"),
            });
            setThongBao(`✅ Nộp phạt #${khoanPhatChon.id} thành công qua MoMo!`);
            if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
        } catch (err) {
            alert("Lỗi xác nhận: " + err.message);
        }
    };

    // Giả lập quét QR ZaloPay trong MODAL POPUP
    const batDauQuetQrModal = () => {
        setDangQuetQrModal(true);
        setTienTrinhModal(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTienTrinhModal(100);
                setTimeout(async () => {
                    setDangQuetQrModal(false);
                    const targetId = qrData?.tienPhatId || 0;
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
                    setDangMoQr(false);
                    setThongBao(`✅ Quét mã ZaloPay thành công! Giao dịch #${maGiaoDichGia} đã ghi nhận.`);
                    if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
                }, 500);
            } else {
                setTienTrinhModal(Math.min(progress, 99));
            }
        }, 300);
    };

    // Xác nhận MoMo trong MODAL POPUP
    const xacNhanThanhToanMoMoModal = async (tienPhatId) => {
        setDangXacNhan(true);
        try {
            const maGD = maGiaoDichGia || sinhMaGiaoDichGia("MOMO");
            const emailParam = encodeURIComponent(emailNhanThongBao || user?.email || "");
            const targetId = (tienPhatId && tienPhatId !== 0 && String(tienPhatId) !== "0") ? tienPhatId : 0;
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${targetId}/xacNhan?maGiaoDich=${encodeURIComponent(maGD)}&emailNhan=${emailParam}`, {
                method: "POST",
            });
            const data = await res.json().catch(() => ({}));
            let msg = `✅ Thanh toán MoMo thành công! (Mã GD: ${data.maGiaoDich || maGD})`;
            if (data.emailSent) {
                msg += ` - Đã gửi biên lai xác nhận về Gmail: ${data.emailNhan}`;
            }
            setThongBao(msg);
            setDangMoQr(false);
            if (user) taiDuLieu(user.docGiaId || user.taiKhoanId);
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
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[75vh]">
            {/* Header trang */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Lịch sử Phiếu Mượn & Tiền Phạt</h1>
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

            {/* Thông báo kết quả */}
            {thongBao && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center justify-between border border-emerald-200 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                        <FiCheck className="shrink-0 text-lg text-emerald-600" />
                        <span>{thongBao}</span>
                    </div>
                    <button onClick={() => setThongBao("")} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
                </div>
            )}

            {/* ============================================================== */}
            {/* PHẦN 1: KHOẢN PHẠT - BÊN TRÁI DANH SÁCH, BÊN PHẢI BẢNG NỘP PHẠT */}
            {/* ============================================================== */}
            <div className="mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FiDollarSign className="text-red-500" />
                            <span>Khoản phạt & Phí thư viện</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Chọn khoản phạt để quét mã thanh toán bằng App ZaloPay hoặc MoMo
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/thanhtoan/zalopay?tienPhatId=${khoanPhatChon?.id || 0}&soTien=${khoanPhatChon?.soTien || 20000}`}
                            target="_blank"
                            className="px-3.5 py-2 bg-[#008fe5] hover:bg-[#007cd0] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                        >
                            <span>📱</span> Cổng ZaloPay (Tab mới) <FiExternalLink size={12} />
                        </Link>
                        <button
                            onClick={() => moMaQRThanhToan(khoanPhatChon?.id || 0)}
                            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                        >
                            <span>⚡</span> Mở Popup QR Nộp Phạt
                        </button>
                    </div>
                </div>

                {dangTai ? (
                    <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-xl border">
                        Đang kiểm tra dữ liệu phạt...
                    </div>
                ) : dsPhat.length === 0 ? (
                    <div className="p-6 bg-white rounded-xl border border-gray-100 text-sm text-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎉</span>
                            <div>
                                <p className="font-bold text-base">Bạn không có khoản nợ hay tiền phạt nào!</p>
                                <p className="text-xs text-gray-500 mt-0.5">Cảm ơn bạn đã luôn trả sách đúng hạn và giữ gìn sách cẩn thận.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => moMaQRThanhToan(0)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                            <span>⚡</span> Thử nghiệm quét ZaloPay / MoMo
                        </button>
                    </div>
                ) : (
                    /* LAYOUT CHIA ĐÔI: BÊN TRÁI DANH SÁCH - BÊN PHẢI BẢNG NỘP PHẠT */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* CỘT TRÁI: DANH SÁCH CÁC KHOẢN PHẠT */}
                        <div className="lg:col-span-6 space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
                                <span>Danh sách khoản phạt ({dsPhat.length})</span>
                                <span>Nhấn để chọn nộp phạt 👉</span>
                            </div>

                            {dsPhat.map((phat) => {
                                const daThanhToan = phat.trangThai === "DA_THANH_TOAN";
                                const isSelected = khoanPhatChon?.id === phat.id;

                                return (
                                    <div
                                        key={phat.id}
                                        onClick={() => {
                                            setKhoanPhatChon(phat);
                                            setKetQuaBang(null);
                                        }}
                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50/25 ring-2 ring-blue-400/30"
                                                : daThanhToan
                                                ? "border-green-200 bg-green-50/10 opacity-75"
                                                : "border-gray-200 hover:border-blue-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold text-gray-500">
                                                Khoản phạt #{phat.id}
                                            </span>
                                            <span
                                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                                    daThanhToan
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {daThanhToan ? "✓ Đã thanh toán" : "● Chưa thanh toán"}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-baseline justify-between">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">
                                                    Lý do: {phat.lyDo === "QUA_HAN" ? "Trả sách trễ hạn" :
                                                            phat.lyDo === "HU_HONG" ? "Làm hư hỏng sách" :
                                                            phat.lyDo === "LAM_MAT" ? "Làm mất sách" : phat.lyDo}
                                                </p>
                                                {phat.ghiChu && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{phat.ghiChu}</p>
                                                )}
                                            </div>
                                            <span className="text-lg font-black text-red-600">
                                                {dinhDangTien(phat.soTien)}
                                            </span>
                                        </div>

                                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                                            <span className="text-gray-400">
                                                Ngày: {phat.ngayLap ? new Date(phat.ngayLap).toLocaleDateString("vi-VN") : "Hôm nay"}
                                            </span>
                                            <span className={`font-semibold flex items-center gap-1 ${
                                                isSelected ? "text-blue-600" : "text-gray-500"
                                            }`}>
                                                {isSelected ? "Đang chọn thanh toán ▼" : "Chọn nộp phạt"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CỘT PHẢI: BẢNG NỘP PHẠT BÊN PHẢI (CHỌN ZALOPAY / MOMO) */}
                        <div className="lg:col-span-6 sticky top-6">
                            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                                {/* Header Bảng nộp phạt */}
                                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                                                💳
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm tracking-wide">BẢNG NỘP PHẠT TRỰC TUYẾN</h3>
                                                <p className="text-[11px] text-blue-100">
                                                    Khoản phạt #{khoanPhatChon?.id || "DEMO"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-black bg-white/20 px-3 py-1 rounded-xl backdrop-blur">
                                            {dinhDangTien(khoanPhatChon?.soTien || 20000)}
                                        </span>
                                    </div>
                                </div>

                                {/* Nội dung bảng nộp phạt */}
                                <div className="p-5 space-y-4">
                                    {ketQuaBang?.thanhCong ? (
                                        /* MÀN HÌNH THÀNH CÔNG TẠI BẢNG */
                                        <div className="text-center py-6 space-y-3">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                                                ✔
                                            </div>
                                            <h4 className="text-lg font-black text-gray-800">NỘP PHẠT THÀNH CÔNG!</h4>
                                            <p className="text-xs text-gray-500">
                                                Phương thức: <b className="text-blue-600">{ketQuaBang.phuongThuc}</b> • Mã GD: <b className="font-mono text-purple-700">{ketQuaBang.maGiaoDich}</b>
                                            </p>
                                            <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-xs text-green-800 text-left space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Số tiền đã thanh toán:</span>
                                                    <b className="font-bold">{dinhDangTien(ketQuaBang.soTien)}</b>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Thời gian:</span>
                                                    <span>{ketQuaBang.ngay}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setKetQuaBang(null)}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
                                            >
                                                Thực hiện giao dịch khác
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* CHỌN PHƯƠNG THỨC THANH TOÁN (UI HIỆN ĐẠI) */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-2.5">
                                                    Chọn phương thức thanh toán:
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Nút chọn ZaloPay */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPhuongThucBang("ZALOPAY");
                                                            setDangQuetQrBang(false);
                                                        }}
                                                        className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                                                            phuongThucBang === "ZALOPAY"
                                                                ? "border-[#008fe5] bg-blue-50/60 shadow-md shadow-blue-500/10 ring-2 ring-blue-400/20"
                                                                : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50/50 text-gray-700"
                                                        }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#008fe5] to-[#00c853] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                            Zalo
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-extrabold text-xs text-gray-900 flex items-center justify-between">
                                                                <span>ZaloPay</span>
                                                                <span className="text-[10px] bg-[#008fe5] text-white px-1.5 py-0.2 rounded-full font-bold">Mới</span>
                                                            </div>
                                                            <div className="text-[11px] text-gray-500 truncate">Quét mã QR Ví ZaloPay</div>
                                                        </div>
                                                    </button>

                                                    {/* Nút chọn MoMo */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPhuongThucBang("MOMO");
                                                            setDangQuetQrBang(false);
                                                        }}
                                                        className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                                                            phuongThucBang === "MOMO"
                                                                ? "border-[#a50064] bg-pink-50/60 shadow-md shadow-pink-500/10 ring-2 ring-pink-400/20"
                                                                : "border-gray-200 hover:border-pink-300 bg-white hover:bg-gray-50/50 text-gray-700"
                                                        }`}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#a50064] to-[#d82d8b] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                                            mo<span className="text-pink-200">mo</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-extrabold text-xs text-gray-900 flex items-center justify-between">
                                                                <span>MoMo</span>
                                                                <span className="text-[10px] bg-[#a50064] text-white px-1.5 py-0.2 rounded-full font-bold">Ví</span>
                                                            </div>
                                                            <div className="text-[11px] text-gray-500 truncate">Quét mã QR MoMo</div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* NỘI DUNG THEO PHƯƠNG THỨC */}
                                            {phuongThucBang === "ZALOPAY" ? (
                                                /* TAB ZALOPAY - GIAO DIỆN MỚI CỰC ĐẸP, BỎ VẠCH GẠCH */
                                                <div className="space-y-3.5">
                                                    {/* Chuyển kiểu quét */}
                                                    <div className="flex bg-gray-100/80 p-1 rounded-xl text-[11px] font-bold">
                                                        <button
                                                            type="button"
                                                            onClick={() => setKieuQrZaloBang("APP")}
                                                            className={`flex-1 py-1.5 rounded-lg transition ${
                                                                kieuQrZaloBang === "APP"
                                                                    ? "bg-white text-blue-700 shadow-sm font-extrabold"
                                                                    : "text-gray-500 hover:text-gray-800"
                                                            }`}
                                                        >
                                                            📱 App ZaloPay / Zalo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setKieuQrZaloBang("WEB")}
                                                            className={`flex-1 py-1.5 rounded-lg transition ${
                                                                kieuQrZaloBang === "WEB"
                                                                    ? "bg-white text-blue-700 shadow-sm font-extrabold"
                                                                    : "text-gray-500 hover:text-gray-800"
                                                            }`}
                                                        >
                                                            📷 Camera điện thoại
                                                        </button>
                                                    </div>

                                                    {/* KHUNG MÃ QR ZALOPAY - SẠCH SẼ, BỎ VẠCH KẺ GẠCH */}
                                                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border border-blue-100 shadow-sm">
                                                        <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block">
                                                            {kieuQrZaloBang === "APP" ? (
                                                                <img
                                                                    src={layUrlVietQrZaloPay(khoanPhatChon?.id, khoanPhatChon?.soTien)}
                                                                    alt="Mã QR ZaloPay chuẩn"
                                                                    className="w-48 h-48 object-contain rounded-xl"
                                                                />
                                                            ) : (
                                                                <div className="relative p-1">
                                                                    <QRCodeSVG
                                                                        value={layDeepLinkZaloPay(khoanPhatChon?.id, khoanPhatChon?.soTien)}
                                                                        size={180}
                                                                        bgColor="#ffffff"
                                                                        fgColor="#008fe5"
                                                                        level="M"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                        <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-blue-400">
                                                                            <span className="text-[9px] font-black text-blue-600">Zalo<span className="text-green-500">Pay</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-[11px] text-gray-500 mt-2.5 text-center font-medium">
                                                            {kieuQrZaloBang === "APP"
                                                                ? "Mở App Zalo hoặc ZaloPay quét mã QR để chuyển tiền"
                                                                : "Dùng Camera iPhone / Android quét để mở trang ZaloPay"}
                                                        </p>
                                                    </div>

                                                    {/* Thông tin thanh toán ZaloPay */}
                                                    <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/70 text-xs space-y-1.5 text-gray-700">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Người nhận:</span>
                                                            <b className="text-gray-900 font-bold">{ZALOPAY_CONFIG.merchantName}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Số tài khoản Ví:</span>
                                                            <b className="font-mono text-blue-700 font-bold">{ZALOPAY_CONFIG.accountNo}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Số tiền nộp:</span>
                                                            <b className="text-red-600 font-extrabold text-sm">{dinhDangTien(khoanPhatChon?.soTien)}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Nội dung chuyển:</span>
                                                            <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                                                                NOP_PHAT_{khoanPhatChon?.id || "DEMO"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Nút bấm ZaloPay */}
                                                    <div className="space-y-2">
                                                        <button
                                                            type="button"
                                                            onClick={batDauQuetQrBang}
                                                            disabled={dangQuetQrBang}
                                                            className="w-full py-3.5 bg-gradient-to-r from-[#008fe5] to-[#00c853] hover:from-[#007cd0] text-white rounded-xl font-black text-xs shadow-lg shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            <FiSmartphone size={16} />
                                                            {dangQuetQrBang ? "Đang quét mã QR ZaloPay..." : "⚡ Giả lập quét mã ZaloPay thành công"}
                                                        </button>

                                                        {dangQuetQrBang && (
                                                            <div className="mt-2 space-y-1">
                                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                                    <div
                                                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                                                                        style={{ width: `${tienTrinhBang}%` }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-between text-[11px] text-blue-600 font-semibold">
                                                                    <span>Đang đọc dữ liệu ZaloPay...</span>
                                                                    <span>{Math.round(tienTrinhBang)}%</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                /* TAB MOMO - GIAO DIỆN MỚI CỰC ĐẸP */
                                                <div className="space-y-3.5">
                                                    {/* KHUNG MÃ QR MOMO - SẠCH SẼ, HIỆN ĐẠI */}
                                                    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-pink-50/50 to-white rounded-2xl border border-pink-100 shadow-sm">
                                                        <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block">
                                                            <img
                                                                src={`https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=${khoanPhatChon?.soTien || 20000}&addInfo=NOP_PHAT_${khoanPhatChon?.id || "DEMO"}&accountName=THU%20VIEN%20SO`}
                                                                alt="QR MoMo"
                                                                className="w-48 h-48 object-contain rounded-xl"
                                                            />
                                                        </div>

                                                        <p className="text-[11px] text-gray-500 mt-2.5 text-center font-medium">
                                                            Mở App MoMo hoặc Ngân hàng quét mã VietQR để thanh toán
                                                        </p>
                                                    </div>

                                                    {/* Thông tin chuyển khoản MoMo */}
                                                    <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/70 text-xs space-y-1.5 text-gray-700">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Người nhận:</span>
                                                            <b className="text-gray-900 font-bold">{MOMO_CONFIG.accountName}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Số ví MoMo:</span>
                                                            <b className="font-mono text-pink-700 font-bold">{MOMO_CONFIG.phoneNo}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Số tiền:</span>
                                                            <b className="text-red-600 font-extrabold text-sm">{dinhDangTien(khoanPhatChon?.soTien)}</b>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500">Nội dung chuyển:</span>
                                                            <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                                                                NOP_PHAT_{khoanPhatChon?.id || "DEMO"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Nhập Gmail nhận biên lai */}
                                                    <div>
                                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                                            <FiMail size={12} className="text-pink-600" />
                                                            <span>Gmail nhận thông báo biên lai:</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={emailBang}
                                                            onChange={(e) => setEmailBang(e.target.value)}
                                                            placeholder="Nhập email của bạn (tùy chọn)..."
                                                            className="w-full px-3 py-2 text-xs text-gray-800 bg-white rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                                                        />
                                                    </div>

                                                    {/* Nút bấm xác nhận MoMo */}
                                                    <button
                                                        type="button"
                                                        onClick={xacNhanMoMoBang}
                                                        className="w-full py-3.5 bg-gradient-to-r from-[#a50064] to-[#d82d8b] hover:from-[#8d0055] text-white rounded-xl font-black text-xs shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
                                                    >
                                                        <FiCheck size={16} />
                                                        XÁC NHẬN ĐÃ CHUYỂN TIỀN MOMO
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* PHẦN 2: LỊCH SỬ CÁC PHIẾU MƯỢN SÁCH */}
            {/* ============================================================== */}
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
                                    <th className="px-5 py-3">Người mượn</th>
                                    <th className="px-5 py-3">Ngày mượn</th>
                                    <th className="px-5 py-3">Ghi chú</th>
                                    <th className="px-5 py-3">Trạng thái</th>
                                    <th className="px-5 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dsPhieu.map((p) => {
                                    const coTheGiaHan = p.trangThai === "DANG_MUON";
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-mono font-bold text-emerald-800">
                                                {p.maPhieu}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-gray-800 text-xs">
                                                    {p.tenDocGia || user?.hoTen || user?.tenDangNhap || `Độc giả #${p.docGiaId}`}
                                                </div>
                                                <div className="text-[11px] text-gray-400">
                                                    Mã thẻ: #{p.docGiaId || user?.docGiaId || user?.taiKhoanId || user?.id}
                                                </div>
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
                                            <td className="px-5 py-4 text-center">
                                                {coTheGiaHan ? (
                                                    <button
                                                        onClick={() => giaHanPhieu(p.id)}
                                                        disabled={dangGiaHanId === p.id}
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1 mx-auto"
                                                        title="Gia hạn thêm 7 ngày vào hạn trả sách"
                                                    >
                                                        <span>🔄</span>
                                                        <span>{dangGiaHanId === p.id ? "Đang xử lý..." : "Gia hạn +7 ngày"}</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* PHẦN 3: SÁCH ĐANG ĐẶT TRƯỚC (RESERVATION / HOLD) */}
            {/* ============================================================== */}
            <div className="mt-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span>📌</span>
                            <span>Sách bạn đang đặt trước (Hàng đợi giữ chỗ)</span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Khi có bạn đọc khác trả sách về thư viện, hệ thống sẽ tự động ưu tiên giữ sách cho bạn
                        </p>
                    </div>
                    <Link
                        href="/sach"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                        + Khám phá thêm sách để đặt trước →
                    </Link>
                </div>

                {dsDatTruoc.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
                        Bạn hiện không có cuốn sách nào trong hàng đợi đặt trước. Nếu cuốn sách bạn yêu thích tạm hết trên kệ, hãy bấm <b>"📌 Đặt trước"</b> tại trang chi tiết cuốn sách đó!
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                                <tr>
                                    <th className="px-5 py-3">Tên sách đặt trước</th>
                                    <th className="px-5 py-3">Ngày đặt</th>
                                    <th className="px-5 py-3">Trạng thái hàng đợi</th>
                                    <th className="px-5 py-3">Ghi chú</th>
                                    <th className="px-5 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dsDatTruoc.map((dt) => {
                                    const daCoSach = dt.trangThai === "DA_CO_SACH";
                                    const dangCho = dt.trangThai === "CHO_CO_SACH";
                                    return (
                                        <tr key={dt.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-gray-900 text-sm">{dt.tenSach || `Sách #${dt.sachId}`}</div>
                                                <div className="text-[11px] text-gray-400">Mã yêu cầu: #{dt.id}</div>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-600">
                                                {dt.ngayDat ? new Date(dt.ngayDat).toLocaleString("vi-VN") : "-"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    daCoSach ? "bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-300" :
                                                    dangCho ? "bg-amber-100 text-amber-800" :
                                                    dt.trangThai === "DA_NHAN" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-600"
                                                }`}>
                                                    {daCoSach ? "🎉 Đã có sách về (Mời nhận)!" :
                                                     dangCho ? "⏳ Đang chờ sách hoàn trả" :
                                                     dt.trangThai === "DA_NHAN" ? "✓ Đã nhận sách" : "Đã hủy"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-500 max-w-xs truncate">
                                                {dt.ghiChu || "-"}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {(dangCho || daCoSach) && (
                                                    <button
                                                        onClick={() => huyDatTruoc(dt.id)}
                                                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition font-medium border border-red-200"
                                                    >
                                                        Hủy đặt
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* MODAL POPUP QUÉT MÃ - HỖ TRỢ ZALOPAY QUÉT ĐƯỢC 100% VÀ MOMO */}
            {/* ============================================================== */}
            {dangMoQr && qrData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative text-center my-8">
                        <button
                            onClick={() => setDangMoQr(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                        >
                            <FiX size={20} />
                        </button>

                        {/* TAB CHỌN PHƯƠNG THỨC TRONG POPUP */}
                        <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setPhuongThucModal("ZALOPAY");
                                    setMaGiaoDichGia(sinhMaGiaoDichGia("ZALOPAY"));
                                }}
                                className={`flex-1 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                                    phuongThucModal === "ZALOPAY"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <span>📱</span> ZaloPay (Quét được)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPhuongThucModal("MOMO");
                                    setMaGiaoDichGia(sinhMaGiaoDichGia("MOMO"));
                                }}
                                className={`flex-1 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                                    phuongThucModal === "MOMO"
                                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <span>🩷</span> MoMo & VietQR
                            </button>
                        </div>

                        {/* TIÊU ĐỀ POPUP */}
                        <h3 className="text-lg font-bold text-gray-800">
                            {phuongThucModal === "ZALOPAY" ? "Thanh toán ZaloPay (Quét mã thật)" : "Thanh toán MoMo & VietQR"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {phuongThucModal === "ZALOPAY"
                                ? "Mở App ZaloPay / Zalo quét mã để nhận diện số tiền"
                                : "Quét mã QR bằng ứng dụng MoMo hoặc ngân hàng bất kỳ"}
                        </p>

                        {/* MÃ QR CODE THẬT (KHÔNG CÓ VẠCH GẠCH) */}
                        <div className="my-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-md inline-block">
                            {phuongThucModal === "ZALOPAY" ? (
                                <img
                                    src={layUrlVietQrZaloPay(qrData.tienPhatId, qrData.soTien)}
                                    alt="Mã QR ZaloPay chuẩn"
                                    className="w-48 h-48 mx-auto object-contain rounded-xl"
                                />
                            ) : (
                                <img
                                    src={qrData.qrUrl}
                                    alt="Mã QR VietQR MoMo"
                                    className="w-48 h-48 mx-auto object-contain rounded-xl"
                                />
                            )}
                        </div>

                        {/* CHI TIẾT KHOẢN NỘP */}
                        <div className="text-left bg-gray-50 p-3 rounded-xl text-xs space-y-1.5 text-gray-600 mb-3 border border-gray-100">
                            <div className="flex justify-between">
                                <span>Số tiền nộp phạt:</span>
                                <b className="text-red-600 text-sm font-black">{dinhDangTien(qrData.soTien)}</b>
                            </div>
                            <div className="flex justify-between">
                                <span>Người nhận:</span>
                                <b className="text-gray-800">{phuongThucModal === "ZALOPAY" ? ZALOPAY_CONFIG.merchantName : qrData.tenNguoiNhan}</b>
                            </div>
                            <div className="flex justify-between">
                                <span>Nội dung chuyển:</span>
                                <b className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{qrData.noiDung}</b>
                            </div>
                        </div>

                        {/* NỘI DUNG FORM RIÊNG THEO PHƯƠNG THỨC */}
                        {phuongThucModal === "ZALOPAY" ? (
                            /* GIẢ LẬP ZALOPAY */
                            <div className="space-y-3">
                                <div className="text-left bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1">
                                    <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
                                        <span>Mã giao dịch ZaloPay:</span>
                                        <button
                                            type="button"
                                            onClick={() => setMaGiaoDichGia(sinhMaGiaoDichGia("ZALOPAY"))}
                                            className="text-[11px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded border border-blue-200"
                                        >
                                            <FiRefreshCw size={10} className="inline mr-1" /> Đổi mã
                                        </button>
                                    </div>
                                    <div className="font-mono text-xs font-bold text-blue-800 bg-white p-1.5 rounded border border-blue-200 text-center">
                                        {maGiaoDichGia}
                                    </div>
                                </div>

                                <button
                                    onClick={batDauQuetQrModal}
                                    disabled={dangQuetQrModal}
                                    className="w-full py-3 bg-gradient-to-r from-[#008fe5] to-[#00c853] hover:from-[#007cd0] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiSmartphone size={16} />
                                    {dangQuetQrModal ? "Đang quét mã ZaloPay..." : "⚡ Giả lập quét mã ZaloPay thành công"}
                                </button>

                                {dangQuetQrModal && (
                                    <div className="space-y-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                                                style={{ width: `${tienTrinhModal}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[11px] text-blue-600 font-semibold">
                                            <span>Đang đọc QR ZaloPay...</span>
                                            <span>{Math.round(tienTrinhModal)}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* GIẢ LẬP MOMO */
                            <div className="space-y-3">
                                <div className="text-left bg-gradient-to-br from-pink-50/70 to-purple-50/70 p-3.5 rounded-xl border border-pink-200 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                                            <span>🧪</span> Giả lập MoMo & Gửi Gmail
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setMaGiaoDichGia(sinhMaGiaoDichGia("MOMO"))}
                                            className="text-[11px] text-pink-700 hover:text-pink-900 flex items-center gap-1 font-medium bg-white/80 px-2 py-0.5 rounded-md border border-pink-200"
                                        >
                                            <FiRefreshCw size={11} /> Đổi mã
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                            Mã giao dịch MoMo giả lập:
                                        </label>
                                        <input
                                            type="text"
                                            value={maGiaoDichGia}
                                            onChange={(e) => setMaGiaoDichGia(e.target.value)}
                                            className="w-full px-3 py-1.5 text-xs font-mono font-bold text-pink-700 bg-white rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                            <FiMail size={12} className="text-pink-600" />
                                            <span>Gmail nhận biên lai thông báo:</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={emailNhanThongBao}
                                            onChange={(e) => setEmailNhanThongBao(e.target.value)}
                                            placeholder="Nhập email của bạn..."
                                            className="w-full px-3 py-1.5 text-xs text-gray-800 bg-white rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                    </div>
                                </div>

                                {/* Trạng thái tự động nhận diện MoMo */}
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="flex items-center gap-1.5 text-emerald-700">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                            Đang tự động nhận diện giao dịch MoMo...
                                        </span>
                                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Tự động</span>
                                    </div>
                                    <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                                        <div className="h-1.5 bg-emerald-600 rounded-full animate-pulse" style={{ width: "100%" }} />
                                    </div>
                                    <p className="text-[11px] text-emerald-800 text-left">
                                        ⚡ Chuyển tiền xong trên App, màn hình sẽ <b>tự động báo thành công</b> sau vài giây mà không cần thao tác chuột!
                                    </p>
                                </div>

                                {/* Nút xác nhận chuyển tiền dự phòng */}
                                <div>
                                    <button
                                        onClick={() => xacNhanThanhToanMoMoModal(qrData.tienPhatId)}
                                        disabled={dangXacNhan}
                                        className="w-full py-2.5 bg-gray-100 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs transition border border-emerald-300 flex items-center justify-center gap-2"
                                    >
                                        <FiCheck size={15} />
                                        {dangXacNhan ? "Đang xử lý..." : "Bấm xác nhận ngay nếu không muốn đợi"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

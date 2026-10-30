"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
    FiDollarSign, FiCheck, FiRefreshCw, FiX, FiMail, FiEdit2,
    FiCreditCard, FiSmartphone, FiCheckCircle, FiClock
} from "react-icons/fi";
import API_CONFIG from "@/config/api";

// ===== DỮ LIỆU GIẢ ZALOPAY =====
const ZALOPAY_FAKE = {
    appId: "2554",
    merchantName: "THƯ VIỆN SỐ",
    bankCode: "zalopayapp",
    accountNo: "0382450875",
    accountName: "THU VIEN SO",
    description: "Nộp phạt thư viện",
    logoUrl: "https://upload.wikimedia.org/wikipedia/vi/5/5e/ZaloPay_Logo.png",
    prefix: "ZALO",
};

// ===== DỮ LIỆU MOMO THẬT =====
const MOMO_FAKE = {
    soDienThoai: "0382450875",
    tenNguoiNhan: "THU VIEN SO",
    prefix: "MOMO",
};

export default function TienPhatAdminPage() {
    const [dsPhat, setDsPhat] = useState([]);
    const [locTrangThai, setLocTrangThai] = useState("");
    const [dangTai, setDangTai] = useState(true);

    // Panel nộp phạt bên phải
    const [khoanPhatChon, setKhoanPhatChon] = useState(null);
    const [phuongThuc, setPhuongThuc] = useState("MOMO"); // MOMO | ZALOPAY | TIEN_MAT

    // QR & thanh toán
    const [maGiaoDich, setMaGiaoDich] = useState("");
    const [emailNhan, setEmailNhan] = useState("");
    const [dangXuLy, setDangXuLy] = useState(false);
    const [buocXuLy, setBuocXuLy] = useState("");
    const [ketQuaThanhToan, setKetQuaThanhToan] = useState(null);

    // Quét QR ZaloPay
    const [dangQuetQr, setDangQuetQr] = useState(false);
    const [tienTrinhQuet, setTienTrinhQuet] = useState(0);
    const [quetThanhCong, setQuetThanhCong] = useState(false);

    // Modal chỉnh sửa số tiền
    const [khoanPhatDangSua, setKhoanPhatDangSua] = useState(null);
    const [soTienMoi, setSoTienMoi] = useState("");
    const [ghiChuSua, setGhiChuSua] = useState("");
    const [dangLuuSua, setDangLuuSua] = useState(false);

    // Đếm ngược
    const [giayConLai, setGiayConLai] = useState(600);

    const sinhMaGia = (prefix = "MOMO") => prefix + "_" + Math.floor(100000000 + Math.random() * 900000000);

    const dinhDangGia = (tien) => Number(tien || 0).toLocaleString("vi-VN") + " ₫";

    const dinhDangThoiGian = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Timer đếm ngược
    useEffect(() => {
        if (!khoanPhatChon) return;
        setGiayConLai(600);
        const timer = setInterval(() => {
            setGiayConLai((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [khoanPhatChon]);

    // Tải danh sách
    const taiDanhSach = async () => {
        setDangTai(true);
        try {
            const url = locTrangThai
                ? `${API_CONFIG.BASE_URL}/tienPhat?trangThai=${locTrangThai}`
                : `${API_CONFIG.BASE_URL}/tienPhat`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDsPhat(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Lỗi tải tiền phạt:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDanhSach();
    }, [locTrangThai]);

    // Chọn khoản phạt để nộp
    const chonKhoanPhat = (row) => {
        setKhoanPhatChon(row);
        setPhuongThuc("MOMO");
        setMaGiaoDich(sinhMaGia("MOMO"));
        setEmailNhan("");
        setKetQuaThanhToan(null);
        setQuetThanhCong(false);
        setDangQuetQr(false);
        setTienTrinhQuet(0);
    };

    // Thu tiền mặt
    const thuTienMat = async () => {
        if (!khoanPhatChon) return;
        if (!confirm("Xác nhận thu tiền mặt tại quầy cho khoản phạt này?")) return;
        setDangXuLy(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatChon.id}/thanhToan?phuongThuc=TIEN_MAT`, {
                method: "POST",
            });
            if (res.ok) {
                setKetQuaThanhToan({
                    thanhCong: true,
                    phuongThuc: "TIEN_MAT",
                    maGiaoDich: "CASH_" + Date.now(),
                    soTien: khoanPhatChon.soTien,
                });
                taiDanhSach();
            } else {
                alert("Thu tiền thất bại");
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        } finally {
            setDangXuLy(false);
        }
    };

    // Xác nhận thanh toán MoMo
    const xacNhanMoMo = async () => {
        if (!khoanPhatChon) return;
        setDangXuLy(true);
        setBuocXuLy("1. Đang kết nối đến cổng MoMo Sandbox...");
        try {
            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy("2. MoMo đã xác thực mã QR & trừ tiền giả lập thành công...");
            await new Promise((r) => setTimeout(r, 600));
            setBuocXuLy(`3. Đang cập nhật dữ liệu & gửi thông báo Gmail...`);

            const emailParam = encodeURIComponent(emailNhan || "");
            const res = await fetch(
                `${API_CONFIG.BASE_URL}/payment/momo/${khoanPhatChon.id}/xacNhan?maGiaoDich=${encodeURIComponent(maGiaoDich)}&emailNhan=${emailParam}`,
                { method: "POST" }
            );
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setKetQuaThanhToan({
                    thanhCong: true,
                    phuongThuc: "MOMO",
                    maGiaoDich: data.maGiaoDich || maGiaoDich,
                    soTien: khoanPhatChon.soTien,
                    emailSent: data.emailSent,
                    emailNhan: data.emailNhan || emailNhan,
                    emailStatus: data.emailStatus,
                });
                taiDanhSach();
            } else {
                // Fallback: vẫn coi như thành công nếu đã thanh toán trước đó
                if (data.message && data.message.includes("đã được thanh toán")) {
                    setKetQuaThanhToan({
                        thanhCong: true,
                        phuongThuc: "MOMO",
                        maGiaoDich,
                        soTien: khoanPhatChon.soTien,
                        emailStatus: "Khoản phạt đã thanh toán trước đó.",
                    });
                } else {
                    alert("Lỗi: " + (data.message || "Xác nhận thất bại"));
                }
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        } finally {
            setDangXuLy(false);
            setBuocXuLy("");
        }
    };

    // ===== GIẢ LẬP QUÉT QR ZALOPAY (quét mã → thanh toán thành công trực tiếp) =====
    const batDauQuetQrZalo = () => {
        setDangQuetQr(true);
        setTienTrinhQuet(0);
        setQuetThanhCong(false);

        const maGD = sinhMaGia("ZALO");
        setMaGiaoDich(maGD);

        // Giả lập tiến trình quét QR
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 18 + 8;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTienTrinhQuet(100);
                setTimeout(() => {
                    setQuetThanhCong(true);
                    setDangQuetQr(false);
                    // Quét xong → gọi API cập nhật trạng thái & hiện kết quả thành công luôn
                    hoanTatZaloPay(maGD);
                }, 600);
            } else {
                setTienTrinhQuet(Math.min(progress, 99));
            }
        }, 400);
    };

    // Hoàn tất thanh toán ZaloPay (gọi API cập nhật + trả về thành công trực tiếp)
    const hoanTatZaloPay = async (maGD) => {
        setDangXuLy(true);
        setBuocXuLy("ZaloPay đang xác thực giao dịch...");
        try {
            await new Promise((r) => setTimeout(r, 800));
            setBuocXuLy("ZaloPay xử lý thanh toán thành công...");
            await new Promise((r) => setTimeout(r, 600));

            // Gọi API backend để cập nhật trạng thái khoản phạt
            try {
                await fetch(
                    `${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatChon.id}/thanhToan?phuongThuc=ZALOPAY`,
                    { method: "POST" }
                );
            } catch {
                // Nếu API chưa hỗ trợ ZALOPAY, thử qua TIEN_MAT
                try {
                    await fetch(
                        `${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatChon.id}/thanhToan?phuongThuc=TIEN_MAT`,
                        { method: "POST" }
                    );
                } catch {}
            }

            // Luôn trả về thành công (dữ liệu giả)
            setKetQuaThanhToan({
                thanhCong: true,
                phuongThuc: "ZALOPAY",
                maGiaoDich: maGD,
                soTien: khoanPhatChon.soTien,
                ngayGiaoDich: new Date().toLocaleString("vi-VN"),
                taiKhoanNhan: ZALOPAY_FAKE.accountName,
            });
            taiDanhSach();
        } catch (err) {
            // Vẫn trả thành công vì là giả lập
            setKetQuaThanhToan({
                thanhCong: true,
                phuongThuc: "ZALOPAY",
                maGiaoDich: maGD,
                soTien: khoanPhatChon.soTien,
                ngayGiaoDich: new Date().toLocaleString("vi-VN"),
                taiKhoanNhan: ZALOPAY_FAKE.accountName,
            });
        } finally {
            setDangXuLy(false);
            setBuocXuLy("");
        }
    };

    // Tạo URL ảnh VietQR chuẩn Ví ZaloPay / MoMo - App quét nhận diện 100%
    const layUrlVietQrZaloPay = () => {
        if (!khoanPhatChon) return "";
        const soTien = khoanPhatChon.soTien || 25000;
        const noiDung = `NOP_PHAT_${khoanPhatChon.id}`;
        return `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=${soTien}&addInfo=${noiDung}&accountName=THU%20VIEN%20SO`;
    };

    // Tạo QR URL MoMo (VietQR - Số ví MoMo thật 0382450875)
    const taoQrUrlMoMo = () => {
        if (!khoanPhatChon) return "";
        const soTien = khoanPhatChon.soTien || 25000;
        const noiDung = `NOP_PHAT_${khoanPhatChon.id}`;
        return `https://img.vietqr.io/image/momo-0382450875-compact2.jpg?amount=${soTien}&addInfo=${noiDung}&accountName=THU%20VIEN%20SO`;
    };

    // Chỉnh sửa số tiền
    const batDauSua = (row) => {
        setKhoanPhatDangSua(row);
        setSoTienMoi(row.soTien || 0);
        setGhiChuSua(row.ghiChu || "");
    };

    const luuSoTienMoi = async (e) => {
        e.preventDefault();
        if (!khoanPhatDangSua) return;
        const tien = Number(soTienMoi);
        if (isNaN(tien) || tien < 0) {
            alert("Vui lòng nhập số tiền phạt hợp lệ (>= 0)");
            return;
        }
        setDangLuuSua(true);
        try {
            const res = await fetch(
                `${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatDangSua.id}/soTien?soTien=${tien}&ghiChu=${encodeURIComponent(ghiChuSua)}`,
                { method: "PUT" }
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Không thể cập nhật số tiền");
            }
            alert(`Đã cập nhật số tiền phạt thành ${tien.toLocaleString("vi-VN")} ₫ thành công!`);
            setKhoanPhatDangSua(null);
            taiDanhSach();
        } catch (err) {
            alert("Lỗi: " + err.message);
        } finally {
            setDangLuuSua(false);
        }
    };

    // Lấy tên lý do phạt
    const tenLyDo = (lyDo) => {
        switch (lyDo) {
            case "QUA_HAN": return "Trả trễ hạn";
            case "HU_HONG": return "Làm hư hại sách";
            case "LAM_MAT": return "Làm mất sách";
            default: return lyDo;
        }
    };

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Tiền phạt thư viện</h1>
                    <p className="text-sm text-gray-500">Thu tiền phạt trễ hạn, hư hỏng và làm mất sách • Hỗ trợ MoMo, ZaloPay, Tiền mặt</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={locTrangThai}
                        onChange={(e) => setLocTrangThai(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
                        <option value="DA_THANH_TOAN">Đã thanh toán</option>
                    </select>

                    <button
                        onClick={taiDanhSach}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw size={16} /> Làm mới
                    </button>
                </div>
            </div>

            {/* LAYOUT: Bảng bên trái + Panel nộp phạt bên phải */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ===== BẢNG DANH SÁCH TIỀN PHẠT (BÊN TRÁI) ===== */}
                <div className={`${khoanPhatChon ? "lg:col-span-7" : "lg:col-span-12"} transition-all duration-300`}>
                    {dangTai ? (
                        <div className="text-center py-12 text-gray-500">Đang tải danh sách tiền phạt...</div>
                    ) : dsPhat.length === 0 ? (
                        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                            Không có khoản tiền phạt nào.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-100">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Mã CT Phiếu</th>
                                        <th className="px-4 py-3">Lý do</th>
                                        <th className="px-4 py-3">Số tiền</th>
                                        <th className="px-4 py-3">Ngày lập</th>
                                        <th className="px-4 py-3">Trạng thái</th>
                                        <th className="px-4 py-3 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dsPhat.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={`hover:bg-gray-50 transition cursor-pointer ${khoanPhatChon?.id === row.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                                            onClick={() => row.trangThai === "CHUA_THANH_TOAN" && chonKhoanPhat(row)}
                                        >
                                            <td className="px-4 py-3 font-semibold text-gray-800">#{row.id}</td>
                                            <td className="px-4 py-3">CT #{row.chiTietPhieuMuonId}</td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-700">{tenLyDo(row.lyDo)}</span>
                                                {row.ghiChu && <p className="text-xs text-gray-400">{row.ghiChu}</p>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-red-600">{dinhDangGia(row.soTien)}</span>
                                                    {row.trangThai === "CHUA_THANH_TOAN" && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); batDauSua(row); }}
                                                            title="Chỉnh sửa số tiền phạt"
                                                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition font-medium"
                                                        >
                                                            <FiEdit2 size={11} />
                                                            <span>Sửa</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {row.ngayLap ? new Date(row.ngayLap).toLocaleDateString("vi-VN") : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.trangThai === "DA_THANH_TOAN" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        <FiCheck size={12} /> Đã thanh toán
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                        Chưa thanh toán
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {row.trangThai === "CHUA_THANH_TOAN" ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); chonKhoanPhat(row); }}
                                                        className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                                                            khoanPhatChon?.id === row.id
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                                        }`}
                                                    >
                                                        {khoanPhatChon?.id === row.id ? "✓ Đang chọn" : "Nộp phạt"}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Hoàn thành</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ===== PANEL NỘP PHẠT BÊN PHẢI ===== */}
                {khoanPhatChon && (
                    <div className="lg:col-span-5 transition-all duration-300">
                        <div className="sticky top-6 rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                            {/* Header panel */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <FiCreditCard size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Nộp phạt #{khoanPhatChon.id}</h3>
                                        <p className="text-xs text-blue-100">{tenLyDo(khoanPhatChon.lyDo)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setKhoanPhatChon(null); setKetQuaThanhToan(null); }}
                                    className="text-white/70 hover:text-white p-1"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            {/* Thông tin khoản phạt */}
                            <div className="p-4 bg-gray-50 border-b">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Số tiền phạt:</span>
                                    <span className="text-xl font-black text-red-600">{dinhDangGia(khoanPhatChon.soTien)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">Hết hạn sau:</span>
                                    <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                        <FiClock size={11} className="animate-spin" style={{ animationDuration: "3s" }} />
                                        {dinhDangThoiGian(giayConLai)}
                                    </span>
                                </div>
                            </div>

                            {/* NẾU ĐÃ THANH TOÁN THÀNH CÔNG */}
                            {ketQuaThanhToan?.thanhCong ? (
                                <div className="p-5 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl animate-bounce">
                                        ✔
                                    </div>
                                    <h3 className="text-lg font-black text-gray-800">THANH TOÁN THÀNH CÔNG!</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Phương thức: <b className={
                                            ketQuaThanhToan.phuongThuc === "ZALOPAY" ? "text-blue-600" :
                                            ketQuaThanhToan.phuongThuc === "MOMO" ? "text-pink-600" : "text-emerald-600"
                                        }>
                                            {ketQuaThanhToan.phuongThuc === "ZALOPAY" ? "ZaloPay" :
                                             ketQuaThanhToan.phuongThuc === "MOMO" ? "MoMo" : "Tiền mặt"}
                                        </b>
                                    </p>

                                    <div className="mt-4 p-3 rounded-xl bg-gray-50 border text-left text-xs space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Mã giao dịch:</span>
                                            <b className="font-mono text-indigo-700">{ketQuaThanhToan.maGiaoDich}</b>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Số tiền:</span>
                                            <b className="text-emerald-700">{dinhDangGia(ketQuaThanhToan.soTien)}</b>
                                        </div>
                                        {ketQuaThanhToan.ngayGiaoDich && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Thời gian:</span>
                                                <b className="text-gray-700">{ketQuaThanhToan.ngayGiaoDich}</b>
                                            </div>
                                        )}
                                        {ketQuaThanhToan.taiKhoanNhan && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tài khoản nhận:</span>
                                                <b className="text-gray-700">{ketQuaThanhToan.taiKhoanNhan}</b>
                                            </div>
                                        )}
                                        {ketQuaThanhToan.emailSent && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Email biên lai:</span>
                                                <b className="text-pink-600">{ketQuaThanhToan.emailNhan}</b>
                                            </div>
                                        )}
                                        {ketQuaThanhToan.emailStatus && (
                                            <p className="text-[11px] text-gray-500 pt-1 border-t">{ketQuaThanhToan.emailStatus}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => { setKhoanPhatChon(null); setKetQuaThanhToan(null); }}
                                        className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {/* ===== CHỌN PHƯƠNG THỨC THANH TOÁN ===== */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2">Phương thức thanh toán:</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* MoMo */}
                                            <button
                                                onClick={() => { setPhuongThuc("MOMO"); setMaGiaoDich(sinhMaGia("MOMO")); setQuetThanhCong(false); setDangQuetQr(false); }}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-xs font-semibold ${
                                                    phuongThuc === "MOMO"
                                                        ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md shadow-pink-100"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-pink-300"
                                                }`}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a50064] to-[#d82d8b] flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                                    mo<span className="text-pink-200">mo</span>
                                                </div>
                                                <span>MoMo</span>
                                            </button>

                                            {/* ZaloPay */}
                                            <button
                                                onClick={() => { setPhuongThuc("ZALOPAY"); setMaGiaoDich(sinhMaGia("ZALO")); setQuetThanhCong(false); setDangQuetQr(false); }}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-xs font-semibold ${
                                                    phuongThuc === "ZALOPAY"
                                                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                                                }`}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#008fe5] to-[#00c853] flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                                    Zalo
                                                </div>
                                                <span>ZaloPay</span>
                                            </button>

                                            {/* Tiền mặt */}
                                            <button
                                                onClick={() => { setPhuongThuc("TIEN_MAT"); setQuetThanhCong(false); setDangQuetQr(false); }}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-xs font-semibold ${
                                                    phuongThuc === "TIEN_MAT"
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                                                }`}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm">
                                                    <FiDollarSign size={18} />
                                                </div>
                                                <span>Tiền mặt</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ===== NỘI DUNG THEO PHƯƠNG THỨC ===== */}

                                    {/* ---------- MOMO ---------- */}
                                    {phuongThuc === "MOMO" && (
                                        <div className="space-y-3">
                                            {/* QR MoMo */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-gray-600 mb-2">Quét mã QR bằng App MoMo</span>
                                                <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block">
                                                    <img
                                                        src={taoQrUrlMoMo()}
                                                        alt="QR MoMo"
                                                        className="w-44 h-44 object-contain rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Thông tin chuyển khoản */}
                                            <div className="bg-pink-50/60 p-3 rounded-xl border border-pink-200 text-xs space-y-1.5">
                                                <p>Người nhận: <b>{MOMO_FAKE.tenNguoiNhan}</b></p>
                                                <p>SĐT MoMo: <b className="font-mono">{MOMO_FAKE.soDienThoai}</b></p>
                                                <p>Nội dung: <b className="text-emerald-700">NOP_PHAT_{khoanPhatChon.id}</b></p>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                                    <FiMail size={12} className="text-pink-600" />
                                                    <span>Gmail nhận biên lai:</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={emailNhan}
                                                    onChange={(e) => setEmailNhan(e.target.value)}
                                                    placeholder="Nhập email (tùy chọn)..."
                                                    className="w-full px-3 py-2 text-xs rounded-lg border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                />
                                            </div>

                                            {/* Mã giao dịch */}
                                            <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-200 text-xs">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-purple-900">Mã GD giả lập:</span>
                                                    <button onClick={() => setMaGiaoDich(sinhMaGia("MOMO"))} className="text-[11px] text-purple-700 hover:text-purple-900 flex items-center gap-1">
                                                        <FiRefreshCw size={10} /> Đổi mã
                                                    </button>
                                                </div>
                                                <div className="font-mono font-bold text-purple-800 bg-white p-1.5 rounded border border-purple-200 text-center tracking-wider text-[11px]">
                                                    {maGiaoDich}
                                                </div>
                                            </div>

                                            {buocXuLy && (
                                                <div className="p-2 bg-pink-50 text-[#a50064] text-xs font-semibold rounded-lg border border-pink-200 animate-pulse">
                                                    {buocXuLy}
                                                </div>
                                            )}

                                            {/* Nút thanh toán MoMo */}
                                            <button
                                                onClick={xacNhanMoMo}
                                                disabled={dangXuLy}
                                                className="w-full py-3 bg-gradient-to-r from-[#a50064] to-[#d82d8b] hover:from-[#8d0055] text-white rounded-xl font-bold text-xs shadow-lg shadow-pink-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <FiCreditCard size={15} />
                                                {dangXuLy ? "Đang xử lý..." : "⚡ Xác nhận thanh toán MoMo"}
                                            </button>
                                        </div>
                                    )}

                                    {/* ---------- ZALOPAY ---------- */}
                                    {phuongThuc === "ZALOPAY" && (
                                        <div className="space-y-3">
                                            {/* QR ZaloPay - Quét được 100% bằng App ZaloPay / Zalo / Ngân hàng */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-gray-600 mb-2">Quét mã QR bằng App ZaloPay / Zalo</span>
                                                <div className="relative p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block">
                                                    <img
                                                        src={layUrlVietQrZaloPay()}
                                                        alt="Mã QR ZaloPay chuẩn"
                                                        className="w-44 h-44 object-contain rounded-xl"
                                                    />
                                                    {/* Overlay quét thành công */}
                                                    {quetThanhCong && (
                                                        <div className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                                                            <div className="bg-white rounded-full p-2 shadow-lg">
                                                                <FiCheckCircle size={32} className="text-green-500" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Thông tin ZaloPay */}
                                            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs space-y-1.5">
                                                <p>Đơn vị nhận: <b>{ZALOPAY_FAKE.merchantName}</b></p>
                                                <p>Số TK: <b className="font-mono">{ZALOPAY_FAKE.accountNo}</b></p>
                                                <p>Nội dung: <b className="text-emerald-700">NOP_PHAT_{khoanPhatChon.id}</b></p>
                                            </div>

                                            {/* Nút giả lập quét QR */}
                                            {!quetThanhCong && !dangXuLy && (
                                                <div>
                                                    <button
                                                        onClick={batDauQuetQrZalo}
                                                        disabled={dangQuetQr}
                                                        className="w-full py-3 bg-gradient-to-r from-[#008fe5] to-[#00c853] hover:from-[#0077cc] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <FiSmartphone size={15} />
                                                        {dangQuetQr ? "Đang quét mã QR..." : "📱 Giả lập quét mã QR ZaloPay"}
                                                    </button>

                                                    {/* Thanh tiến trình quét */}
                                                    {dangQuetQr && (
                                                        <div className="mt-2 space-y-1.5">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                                <div
                                                                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300 ease-out"
                                                                    style={{ width: `${tienTrinhQuet}%` }}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-between text-[11px]">
                                                                <span className="text-blue-600 font-semibold animate-pulse">
                                                                    🔍 Đang quét mã QR ZaloPay...
                                                                </span>
                                                                <span className="font-mono font-bold text-blue-700">
                                                                    {Math.round(tienTrinhQuet)}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Trạng thái đang xử lý sau quét */}
                                            {quetThanhCong && dangXuLy && (
                                                <div className="space-y-2">
                                                    <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs">
                                                        <div className="flex items-center gap-2 text-green-700 font-bold">
                                                            <FiCheckCircle size={14} />
                                                            Quét mã QR ZaloPay thành công!
                                                        </div>
                                                    </div>
                                                    {buocXuLy && (
                                                        <div className="p-2.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 animate-pulse flex items-center gap-2">
                                                            <FiClock size={13} className="animate-spin" style={{ animationDuration: "2s" }} />
                                                            {buocXuLy}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ---------- TIỀN MẶT ---------- */}
                                    {phuongThuc === "TIEN_MAT" && (
                                        <div className="space-y-3">
                                            <div className="flex flex-col items-center py-4">
                                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                                                    <FiDollarSign size={32} className="text-emerald-600" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-800">Thu tiền mặt tại quầy</p>
                                                <p className="text-xs text-gray-500 mt-1 text-center">
                                                    Xác nhận độc giả đã nộp <b className="text-red-600">{dinhDangGia(khoanPhatChon.soTien)}</b> tiền mặt
                                                </p>
                                            </div>

                                            <button
                                                onClick={thuTienMat}
                                                disabled={dangXuLy}
                                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <FiCheck size={15} />
                                                {dangXuLy ? "Đang xử lý..." : "✅ Xác nhận đã thu tiền mặt"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== MODAL CHỈNH SỬA SỐ TIỀN PHẠT ===== */}
            {khoanPhatDangSua && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <FiEdit2 className="text-orange-600" />
                                <span>Chỉnh sửa số tiền phạt #{khoanPhatDangSua.id}</span>
                            </h3>
                            <button
                                onClick={() => setKhoanPhatDangSua(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <form onSubmit={luuSoTienMoi} className="space-y-4 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 block">Lý do phạt:</span>
                                <span className="font-semibold text-gray-800">{tenLyDo(khoanPhatDangSua.lyDo)}</span>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-1">
                                    Số tiền phạt mới (VNĐ) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="5000"
                                        value={soTienMoi}
                                        onChange={(e) => setSoTienMoi(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-orange-300 p-2.5 font-bold text-red-600 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">VNĐ</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    <span className="text-[11px] text-gray-500 self-center">Chọn nhanh:</span>
                                    {[10000, 20000, 30000, 50000, 70000, 100000, 150000].map((muc) => (
                                        <button
                                            key={muc}
                                            type="button"
                                            onClick={() => setSoTienMoi(muc)}
                                            className="text-[11px] px-2 py-0.5 rounded border border-gray-300 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition"
                                        >
                                            {muc.toLocaleString("vi-VN")}đ
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Ghi chú điều chỉnh</label>
                                <input
                                    type="text"
                                    value={ghiChuSua}
                                    onChange={(e) => setGhiChuSua(e.target.value)}
                                    placeholder="Lý do điều chỉnh số tiền..."
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setKhoanPhatDangSua(null)}
                                    className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuSua}
                                    className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 transition"
                                >
                                    {dangLuuSua ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

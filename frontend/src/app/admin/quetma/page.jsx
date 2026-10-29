"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    FiCamera,
    FiSearch,
    FiCheckCircle,
    FiAlertCircle,
    FiBook,
    FiUser,
    FiRefreshCw,
    FiCheck,
    FiClock,
    FiMapPin,
    FiUpload,
    FiSquare
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { layDuongDanAnh, dinhDangTien } from "@/utils/format";

export default function WebQuetMaAdminPage() {
    const [maQuet, setMaQuet] = useState("");
    const [dangQuetCamera, setDangQuetCamera] = useState(false);
    const [dangTaiThuVien, setDangTaiThuVien] = useState(false);
    const [loiCamera, setLoiCamera] = useState("");
    const [danhSachCamera, setDanhSachCamera] = useState([]);
    const [cameraIdDuocChon, setCameraIdDuocChon] = useState("");
    const [dangTimKiem, setDangTimKiem] = useState(false);
    const [thongBao, setThongBao] = useState("");
    const [loi, setLoi] = useState("");

    // Kết quả quét
    const [ketQuaSach, setKetQuaSach] = useState(null);
    const [ketQuaThe, setKetQuaThe] = useState(null);

    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Phát âm thanh beep ngắn khi quét trúng mã
    const phatTiengBeep = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch {}
    };

    // Tắt Camera
    const tatCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Lỗi khi tắt scanner:", err);
            }
            scannerRef.current = null;
        }
        setDangQuetCamera(false);
        setDangTaiThuVien(false);
    };

    // Bật Camera Web với html5-qrcode
    const batCamera = async (overrideCameraId = null) => {
        setLoiCamera("");
        setDangTaiThuVien(true);

        try {
            const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

            // Lấy danh sách camera trên thiết bị
            try {
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length > 0) {
                    setDanhSachCamera(devices);
                    if (!cameraIdDuocChon && !overrideCameraId) {
                        // Ưu tiên camera sau (back/environment) nếu có
                        const backCam = devices.find((d) =>
                            d.label.toLowerCase().includes("back") ||
                            d.label.toLowerCase().includes("sau") ||
                            d.label.toLowerCase().includes("environment")
                        );
                        setCameraIdDuocChon(backCam ? backCam.id : devices[0].id);
                    }
                }
            } catch (camErr) {
                console.warn("Không lấy được danh sách camera:", camErr);
            }

            setDangQuetCamera(true);
            setDangTaiThuVien(false);

            // Chờ DOM hiển thị phần tử #reader-barcode-scanner
            setTimeout(async () => {
                try {
                    const el = document.getElementById("reader-barcode-scanner");
                    if (!el) return;

                    // Nếu đã có scanner cũ, dọn dẹp trước
                    if (scannerRef.current) {
                        try {
                            if (scannerRef.current.isScanning) {
                                await scannerRef.current.stop();
                            }
                            scannerRef.current.clear();
                        } catch {}
                    }

                    const scanner = new Html5Qrcode("reader-barcode-scanner");
                    scannerRef.current = scanner;

                    const config = {
                        fps: 15,
                        qrbox: (viewfinderWidth, viewfinderHeight) => {
                            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                            const qrboxWidth = Math.floor(minEdge * 0.85);
                            const qrboxHeight = Math.floor(minEdge * 0.6);
                            return { width: Math.max(qrboxWidth, 240), height: Math.max(qrboxHeight, 160) };
                        },
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.QR_CODE,
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.CODE_39,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.EAN_8,
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                            Html5QrcodeSupportedFormats.CODABAR,
                        ],
                    };

                    const activeCamId = overrideCameraId || cameraIdDuocChon;
                    const cameraSource = activeCamId ? { deviceId: { exact: activeCamId } } : { facingMode: "environment" };

                    await scanner.start(
                        cameraSource,
                        config,
                        (decodedText) => {
                            // Quét thành công!
                            phatTiengBeep();
                            tatCamera();
                            setMaQuet(decodedText);
                            xuLyTraCuuMa(decodedText);
                        },
                        () => {
                            // Khung hình chưa tìm thấy mã - tiếp tục quét
                        }
                    );
                } catch (startErr) {
                    console.error("Lỗi khởi chạy camera:", startErr);
                    setLoiCamera("Không thể truy cập camera: " + (startErr.message || startErr) + ". Vui lòng cấp quyền camera cho trình duyệt.");
                    setDangQuetCamera(false);
                }
            }, 300);
        } catch (err) {
            console.error("Lỗi nạp thư viện html5-qrcode:", err);
            setLoiCamera("Lỗi tải bộ quét camera: " + err.message);
            setDangQuetCamera(false);
            setDangTaiThuVien(false);
        }
    };

    // Đổi camera khi có nhiều camera
    const doiCamera = async (newCamId) => {
        setCameraIdDuocChon(newCamId);
        await tatCamera();
        setTimeout(() => {
            batCamera(newCamId);
        }, 400);
    };

    // Quét mã từ file ảnh do người dùng tải lên
    const quetTuFileAnh = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoi("");
        setThongBao("Đang phân tích hình ảnh để tìm mã vạch / QR...");
        setDangTimKiem(true);

        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const scanner = new Html5Qrcode("reader-file-temp");
            const decodedText = await scanner.scanFile(file, true);
            scanner.clear();

            phatTiengBeep();
            setMaQuet(decodedText);
            xuLyTraCuuMa(decodedText);
        } catch (err) {
            setLoi("Không nhận diện được mã vạch hoặc mã QR trong ảnh. Vui lòng chụp rõ nét hơn hoặc dùng máy quét.");
            setThongBao("");
            setDangTimKiem(false);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        return () => {
            tatCamera();
        };
    }, []);

    // Tra cứu mã vạch hoặc mã QR
    const xuLyTraCuuMa = async (maCanTim) => {
        const ma = (maCanTim || maQuet).trim();
        if (!ma) return;

        setDangTimKiem(true);
        setLoi("");
        setThongBao("");
        setKetQuaSach(null);
        setKetQuaThe(null);

        try {
            // 1. Thử tra cứu theo Bản sao sách / Mã vạch sách trước
            let resBss = await fetch(`${API_CONFIG.BASE_URL}/banSaoSach/maVach/${encodeURIComponent(ma)}`);
            if (resBss.ok) {
                const bss = await resBss.json();
                // Lấy thông tin đầu sách tương ứng
                let thongTinSach = {};
                try {
                    const resS = await fetch(`${API_CONFIG.BASE_URL}/sach/${bss.sachId}`);
                    if (resS.ok) thongTinSach = await resS.json();
                } catch {}

                setKetQuaSach({ ...thongTinSach, banSao: bss });
                setThongBao(`Đã tìm thấy sách với mã vạch [${ma}]!`);
                setDangTimKiem(false);
                return;
            }

            // 2. Thử tra cứu theo mã sách trực tiếp (DEMO001, DEMO002...)
            let resSachList = await fetch(`${API_CONFIG.BASE_URL}/sach?tuKhoa=${encodeURIComponent(ma)}`);
            if (resSachList.ok) {
                const ds = await resSachList.json();
                const matched = Array.isArray(ds) ? ds.find((s) => (s.maSach || s.ma_sach || "").toLowerCase() === ma.toLowerCase()) : null;
                if (matched) {
                    setKetQuaSach(matched);
                    setThongBao(`Đã tìm thấy thông tin sách [${matched.tenSach || matched.ten_sach}]!`);
                    setDangTimKiem(false);
                    return;
                }
            }

            // 3. Thử tra cứu Thẻ thư viện theo số thẻ (THE0001, THE-DG871337...)
            try {
                let resThe = await fetch(`${API_CONFIG.BASE_URL}/theThuVien/soThe/${encodeURIComponent(ma)}`);
                if (resThe.ok) {
                    const the = await resThe.json();
                    if (the && the.docGiaId) {
                        let dg = null;
                        let dsPhieu = [];
                        try {
                            const rDg = await fetch(`${API_CONFIG.BASE_URL}/docGia/${the.docGiaId}`);
                            if (rDg.ok) dg = await rDg.json();
                        } catch {}
                        try {
                            const rPhieu = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon?docGiaId=${the.docGiaId}`);
                            if (rPhieu.ok) dsPhieu = await rPhieu.json();
                        } catch {}

                        if (dg) {
                            setKetQuaThe({ docGia: dg, theThuVien: the, phieuMuon: dsPhieu });
                            setThongBao(`Đã tìm thấy thẻ thư viện [${the.soThe}] của độc giả [${dg.hoTen}]!`);
                            setDangTimKiem(false);
                            return;
                        }
                    }
                }
            } catch {}

            // 4. Thử tra cứu Thẻ thư viện hoặc Mã độc giả (THE0001, DG001, DG871337...)
            const maDocGiaClean = ma.toUpperCase().startsWith("THE-") ? ma.substring(4) : ma;
            let resDocGia = await fetch(`${API_CONFIG.BASE_URL}/docGia?tuKhoa=${encodeURIComponent(maDocGiaClean)}`);
            if (resDocGia.ok) {
                const dsDg = await resDocGia.json();
                const dg = Array.isArray(dsDg) && dsDg.length > 0 ? dsDg[0] : null;
                if (dg) {
                    // Lấy thẻ thư viện và phiếu mượn của độc giả
                    let the = null;
                    let dsPhieu = [];
                    try {
                        const rThe = await fetch(`${API_CONFIG.BASE_URL}/theThuVien/docGia/${dg.id}`);
                        if (rThe.ok) the = await rThe.json();
                    } catch {}
                    try {
                        const rPhieu = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon?docGiaId=${dg.id}`);
                        if (rPhieu.ok) dsPhieu = await rPhieu.json();
                    } catch {}

                    setKetQuaThe({ docGia: dg, theThuVien: the, phieuMuon: dsPhieu });
                    setThongBao(`Đã tìm thấy độc giả [${dg.hoTen}] (Mã: ${dg.maDocGia})!`);
                    setDangTimKiem(false);
                    return;
                }
            }

            setLoi(`Không tìm thấy dữ liệu nào tương ứng với mã [${ma}]. Vui lòng kiểm tra lại.`);
        } catch (err) {
            setLoi("Lỗi kết nối máy chủ: " + err.message);
        } finally {
            setDangTimKiem(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        xuLyTraCuuMa(maQuet);
    };

    const chonMauTest = (ma) => {
        setMaQuet(ma);
        xuLyTraCuuMa(ma);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-[85vh]">
            {/* Vùng ẩn phục vụ giải mã file ảnh */}
            <div id="reader-file-temp" style={{ display: "none" }} />

            {/* Input file ẩn phục vụ tải ảnh */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={quetTuFileAnh}
                className="hidden"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span>📷</span>
                        <span>Web Quét Mã Vạch & QR Thư Viện</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sử dụng Camera trực tiếp, tải ảnh mã hoặc máy quét USB để tra cứu mượn - trả sách siêu tốc
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        title="Tải ảnh mã vạch hoặc mã QR từ máy tính"
                    >
                        <FiUpload size={16} />
                        <span>Tải ảnh quét</span>
                    </button>

                    <button
                        onClick={dangQuetCamera ? tatCamera : () => batCamera()}
                        disabled={dangTaiThuVien}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition ${
                            dangQuetCamera
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        } disabled:opacity-50`}
                    >
                        <FiCamera size={18} />
                        {dangTaiThuVien ? "Đang bật..." : dangQuetCamera ? "Tắt Camera" : "Mở Camera Quét"}
                    </button>
                </div>
            </div>

            {/* Khung Camera Web Quét Mã Vạch / QR */}
            {dangQuetCamera && (
                <div className="mb-6 bg-slate-900 rounded-2xl p-4 overflow-hidden relative max-w-md mx-auto shadow-2xl border border-slate-700">
                    <div className="flex items-center justify-between text-white text-xs mb-3 pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-2 font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            Camera đang quét tự động...
                        </span>

                        {danhSachCamera.length > 1 && (
                            <select
                                value={cameraIdDuocChon}
                                onChange={(e) => doiCamera(e.target.value)}
                                className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                {danhSachCamera.map((cam, idx) => (
                                    <option key={cam.id} value={cam.id}>
                                        {cam.label || `Camera ${idx + 1}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="rounded-xl overflow-hidden bg-black border-2 border-emerald-500/80 shadow-inner">
                        <div id="reader-barcode-scanner" className="w-full" />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-slate-400 text-xs">
                        <span>Hỗ trợ: Barcode (Code128, EAN) & QR Code</span>
                        <button
                            onClick={tatCamera}
                            className="text-red-400 hover:text-red-300 font-semibold"
                        >
                            Đóng Camera
                        </button>
                    </div>
                </div>
            )}

            {loiCamera && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200 flex items-center gap-2">
                    <FiAlertCircle className="shrink-0 text-base text-amber-600" />
                    <span>{loiCamera}</span>
                </div>
            )}

            {/* Ô nhập mã vạch / Dùng súng quét */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />
                        <input
                            type="text"
                            value={maQuet}
                            onChange={(e) => setMaQuet(e.target.value)}
                            placeholder="Nhập mã vạch sách (vd: BC001-1) hoặc thẻ (vd: THE0001, DG001)..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={dangTimKiem}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition disabled:opacity-50"
                    >
                        {dangTimKiem ? "Đang tra cứu..." : "Tìm kiếm"}
                    </button>
                </form>

                {/* Các nút bấm test nhanh */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Bấm thử mã mẫu:</span>
                    <button
                        type="button"
                        onClick={() => chonMauTest("BC001-1")}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-emerald-800 font-mono font-semibold"
                    >
                        BC001-1 (Sách Đắc Nhân Tâm)
                    </button>
                    <button
                        type="button"
                        onClick={() => chonMauTest("BC002-1")}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-emerald-800 font-mono font-semibold"
                    >
                        BC002-1 (Sách Nhà Giả Kim)
                    </button>
                    <button
                        type="button"
                        onClick={() => chonMauTest("DG001")}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-blue-800 font-mono font-semibold"
                    >
                        DG001 (Độc giả Châu)
                    </button>
                    <button
                        type="button"
                        onClick={() => chonMauTest("DG002")}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-blue-800 font-mono font-semibold"
                    >
                        DG002 (Độc giả Huy)
                    </button>
                </div>
            </div>

            {/* Thông báo kết quả */}
            {thongBao && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2 border border-emerald-200">
                    <FiCheckCircle className="shrink-0 text-base" />
                    <span>{thongBao}</span>
                </div>
            )}
            {loi && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-200">
                    <FiAlertCircle className="shrink-0 text-base" />
                    <span>{loi}</span>
                </div>
            )}

            {/* KẾT QUẢ: KHI QUÉT TRÚNG SÁCH */}
            {ketQuaSach && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200 mb-6">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4">
                        <FiBook size={18} />
                        <span>KẾT QUẢ QUÉT BẢN SAO SÁCH</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="w-28 h-40 rounded-xl overflow-hidden bg-gray-100 border shrink-0">
                            <img
                                src={layDuongDanAnh(ketQuaSach.anhBia || ketQuaSach.anh_bia)}
                                alt={ketQuaSach.tenSach}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-2 text-sm">
                            <h2 className="text-xl font-bold text-gray-900">
                                {ketQuaSach.tenSach || ketQuaSach.ten_sach}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-xs">
                                <p>Mã sách: <b className="font-mono">{ketQuaSach.maSach || ketQuaSach.ma_sach}</b></p>
                                <p>Năm xuất bản: <b>{ketQuaSach.namXuatBan || "-"}</b></p>
                                <p>Giá trị sách: <b className="text-emerald-700">{dinhDangTien(ketQuaSach.giaTien || ketQuaSach.gia_tien)}</b></p>
                                <p>Ngôn ngữ: <b>{ketQuaSach.ngonNgu || "Tiếng Việt"}</b></p>
                            </div>

                            {ketQuaSach.banSao && (
                                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mã vạch bản sao:</span>
                                        <span className="font-mono font-bold text-emerald-900">{ketQuaSach.banSao.maVach}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vị trí kệ:</span>
                                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                                            <FiMapPin size={12} /> {ketQuaSach.banSao.viTriKe || "Kệ K1"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái hiện tại:</span>
                                        <span
                                            className={`px-2 py-0.5 rounded font-bold ${
                                                ketQuaSach.banSao.trangThai === "SAN_SANG"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                        >
                                            {ketQuaSach.banSao.trangThai === "SAN_SANG" ? "Sẵn sàng cho mượn" : "Đang được mượn"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-3 flex gap-3">
                                <Link
                                    href={`/admin/donhang/tao`}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition"
                                >
                                    Lập phiếu mượn sách này
                                </Link>
                                <Link
                                    href={`/sach/${ketQuaSach.id}`}
                                    target="_blank"
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition"
                                >
                                    Xem chi tiết sách
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KẾT QUẢ: KHI QUÉT TRÚNG THẺ THƯ VIỆN / ĐỘC GIẢ */}
            {ketQuaThe && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 mb-6">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-4">
                        <FiUser size={18} />
                        <span>KẾT QUẢ QUÉT THẺ THƯ VIỆN & ĐỘC GIẢ</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center shrink-0">
                            {ketQuaThe.docGia.hoTen ? ketQuaThe.docGia.hoTen.substring(0, 2).toUpperCase() : "DG"}
                        </div>

                        <div className="flex-1 space-y-2 text-sm">
                            <h2 className="text-xl font-bold text-gray-900">
                                {ketQuaThe.docGia.hoTen}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-xs">
                                <p>Mã độc giả: <b className="font-mono text-blue-700">{ketQuaThe.docGia.maDocGia}</b></p>
                                <p>Số điện thoại: <b>{ketQuaThe.docGia.soDienThoai || "-"}</b></p>
                                <p>Email: <b>{ketQuaThe.docGia.email || "-"}</b></p>
                                <p>Địa chỉ: <b>{ketQuaThe.docGia.diaChi || "-"}</b></p>
                            </div>

                            {ketQuaThe.theThuVien && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số thẻ thư viện:</span>
                                        <b className="font-mono text-blue-900">{ketQuaThe.theThuVien.soThe}</b>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thời hạn thẻ:</span>
                                        <span>
                                            {ketQuaThe.theThuVien.ngayCap} đến <b>{ketQuaThe.theThuVien.ngayHetHan}</b>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái thẻ:</span>
                                        <span className="px-2 py-0.5 rounded font-bold bg-green-100 text-green-700">
                                            {ketQuaThe.theThuVien.trangThai === "CON_HAN" ? "Còn hạn sử dụng" : "Hết hạn"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Danh sách phiếu mượn của độc giả này */}
                            <div className="mt-4 pt-3 border-t">
                                <p className="font-bold text-xs text-gray-700 mb-2">
                                    Lịch sử mượn sách gần đây ({ketQuaThe.phieuMuon?.length || 0} phiếu):
                                </p>
                                {ketQuaThe.phieuMuon && ketQuaThe.phieuMuon.length > 0 ? (
                                    <ul className="space-y-1.5 text-xs">
                                        {ketQuaThe.phieuMuon.slice(0, 3).map((p) => (
                                            <li key={p.id} className="p-2 bg-gray-50 rounded-lg flex justify-between items-center">
                                                <span className="font-mono font-semibold">{p.maPhieu}</span>
                                                <span className="text-gray-500">{p.ghiChu || "Mượn sách"}</span>
                                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                                    {p.trangThai}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Chưa có phiếu mượn nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

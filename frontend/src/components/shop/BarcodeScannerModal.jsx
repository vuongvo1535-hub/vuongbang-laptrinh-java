"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiCamera, FiX, FiSearch, FiBook, FiUser, FiCreditCard, FiAlertCircle, FiCheckCircle, FiUpload, FiRefreshCw } from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { layDuongDanAnh, dinhDangTien } from "@/utils/format";

export default function BarcodeScannerModal({ mo, dong, maBanDau = "" }) {
    const [maQuet, setMaQuet] = useState(maBanDau);
    const [dangQuetCamera, setDangQuetCamera] = useState(false);
    const [dangTaiThuVien, setDangTaiThuVien] = useState(false);
    const [loiCamera, setLoiCamera] = useState("");
    const [danhSachCamera, setDanhSachCamera] = useState([]);
    const [cameraIdDuocChon, setCameraIdDuocChon] = useState("");

    const [dangTimKiem, setDangTimKiem] = useState(false);
    const [thongBao, setThongBao] = useState("");
    const [loi, setLoi] = useState("");
    const [ketQuaSach, setKetQuaSach] = useState(null);
    const [ketQuaThe, setKetQuaThe] = useState(null);

    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Khi modal mở hoặc maBanDau thay đổi
    useEffect(() => {
        if (mo) {
            setLoi("");
            setThongBao("");
            setKetQuaSach(null);
            setKetQuaThe(null);
            if (maBanDau) {
                setMaQuet(maBanDau);
                traCuuMa(maBanDau);
            }
        } else {
            tatCamera();
        }
    }, [mo, maBanDau]);

    // Âm thanh beep khi quét thành công
    const phatTiengBeep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch {}
    };

    // Bật camera quét mã
    const batCamera = async (overrideCamId = null) => {
        setLoiCamera("");
        setDangTaiThuVien(true);

        try {
            const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

            try {
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length > 0) {
                    setDanhSachCamera(devices);
                    if (!cameraIdDuocChon && !overrideCamId) {
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

            setTimeout(async () => {
                try {
                    const el = document.getElementById("shop-barcode-scanner");
                    if (!el) return;

                    if (scannerRef.current) {
                        try {
                            if (scannerRef.current.isScanning) {
                                await scannerRef.current.stop();
                            }
                            scannerRef.current.clear();
                        } catch {}
                    }

                    const scanner = new Html5Qrcode("shop-barcode-scanner");
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

                    const activeCamId = overrideCamId || cameraIdDuocChon;
                    const cameraSource = activeCamId ? { deviceId: { exact: activeCamId } } : { facingMode: "environment" };

                    await scanner.start(
                        cameraSource,
                        config,
                        (decodedText) => {
                            phatTiengBeep();
                            tatCamera();
                            setMaQuet(decodedText);
                            traCuuMa(decodedText);
                        },
                        () => {}
                    );
                } catch (startErr) {
                    console.error("Lỗi bật camera:", startErr);
                    setLoiCamera("Không thể truy cập camera: " + (startErr.message || startErr));
                    setDangQuetCamera(false);
                }
            }, 300);
        } catch (err) {
            setLoiCamera("Lỗi tải module camera: " + err.message);
            setDangQuetCamera(false);
            setDangTaiThuVien(false);
        }
    };

    // Tắt camera
    const tatCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch {}
            scannerRef.current = null;
        }
        setDangQuetCamera(false);
    };

    // Quét mã từ ảnh tải lên
    const xuLyTaiFileAnh = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setDangTimKiem(true);
        setLoi("");
        setThongBao("");

        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const tempScanner = new Html5Qrcode("shop-reader-file-temp");
            const decoded = await tempScanner.scanFile(file, true);
            tempScanner.clear();

            phatTiengBeep();
            setMaQuet(decoded);
            await traCuuMa(decoded);
        } catch (err) {
            setLoi("Không nhận diện được mã vạch hoặc QR trong ảnh này: " + (err.message || "Ảnh mờ hoặc không hợp lệ"));
            setDangTimKiem(false);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Tra cứu mã vạch / QR
    const traCuuMa = async (maTim) => {
        const ma = (maTim || maQuet).trim();
        if (!ma) return;

        setDangTimKiem(true);
        setLoi("");
        setThongBao("");
        setKetQuaSach(null);
        setKetQuaThe(null);

        try {
            // 1. Thử tra cứu Thẻ thư viện trực tiếp theo số thẻ (THE-DG871337, THE0001...)
            try {
                const resThe = await fetch(`${API_CONFIG.BASE_URL}/theThuVien/soThe/${encodeURIComponent(ma)}`);
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

            // 2. Thử tra cứu Độc giả theo mã độc giả hoặc từ khóa (DG871337, chau, huy...)
            try {
                const maDgClean = ma.toUpperCase().startsWith("THE-") ? ma.substring(4) : ma;
                const resDocGia = await fetch(`${API_CONFIG.BASE_URL}/docGia?tuKhoa=${encodeURIComponent(maDgClean)}`);
                if (resDocGia.ok) {
                    const dsDg = await resDocGia.json();
                    const dg = Array.isArray(dsDg) && dsDg.length > 0 ? dsDg[0] : null;
                    if (dg) {
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
            } catch {}

            // 3. Thử tra cứu Bản sao sách theo mã vạch sách (BS-DEMO001-01, ...)
            try {
                const resBss = await fetch(`${API_CONFIG.BASE_URL}/banSaoSach/maVach/${encodeURIComponent(ma)}`);
                if (resBss.ok) {
                    const bss = await resBss.json();
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
            } catch {}

            // 4. Thử tra cứu theo mã sách trực tiếp (DEMO001, DEMO002...)
            try {
                const resSachList = await fetch(`${API_CONFIG.BASE_URL}/sach?tuKhoa=${encodeURIComponent(ma)}`);
                if (resSachList.ok) {
                    const ds = await resSachList.json();
                    const matched = Array.isArray(ds) ? ds.find((s) => (s.maSach || s.ma_sach || "").toLowerCase() === ma.toLowerCase()) : null;
                    if (matched) {
                        setKetQuaSach(matched);
                        setThongBao(`Đã tìm thấy sách [${matched.tenSach || matched.ten_sach}]!`);
                        setDangTimKiem(false);
                        return;
                    }
                }
            } catch {}

            setLoi(`Không tìm thấy dữ liệu nào tương ứng với mã [${ma}]. Vui lòng kiểm tra lại.`);
        } catch (err) {
            setLoi("Lỗi kết nối máy chủ: " + err.message);
        } finally {
            setDangTimKiem(false);
        }
    };

    if (!mo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📷</span>
                        <div>
                            <h2 className="text-lg font-bold">Quét Mã Vạch & QR Thư Viện</h2>
                            <p className="text-xs text-emerald-100">Tra cứu nhanh thẻ độc giả và mã sách</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            tatCamera();
                            dong();
                        }}
                        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {/* Ô nhập mã hoặc quét từ súng barcode */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            traCuuMa(maQuet);
                        }}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <input
                                value={maQuet}
                                onChange={(e) => setMaQuet(e.target.value)}
                                placeholder="Nhập hoặc quét mã (VD: THE-DG871337, DEMO001)..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                autoFocus
                            />
                            {maQuet && (
                                <button
                                    type="button"
                                    onClick={() => setMaQuet("")}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={dangTimKiem || !maQuet.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-1.5"
                        >
                            {dangTimKiem ? <FiRefreshCw className="animate-spin" /> : <FiSearch />}
                            <span>Tra cứu</span>
                        </button>
                    </form>

                    {/* Các nút kích hoạt camera và tải ảnh */}
                    <div className="flex flex-wrap gap-2.5 items-center justify-between pt-1 border-t border-gray-100">
                        <div className="flex gap-2">
                            {!dangQuetCamera ? (
                                <button
                                    type="button"
                                    onClick={() => batCamera()}
                                    disabled={dangTaiThuVien}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 border border-emerald-200"
                                >
                                    <FiCamera size={15} />
                                    <span>Bật Camera quét trực tiếp</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={tatCamera}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 border border-red-200"
                                >
                                    <FiX size={15} />
                                    <span>Tắt Camera</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 border border-gray-200"
                            >
                                <FiUpload size={15} />
                                <span>Tải ảnh mã vạch / QR</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={xuLyTaiFileAnh}
                                className="hidden"
                            />
                        </div>

                        {dangQuetCamera && danhSachCamera.length > 1 && (
                            <select
                                value={cameraIdDuocChon}
                                onChange={(e) => {
                                    setCameraIdDuocChon(e.target.value);
                                    batCamera(e.target.value);
                                }}
                                className="text-xs border rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none"
                            >
                                {danhSachCamera.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.label || `Camera ${c.id.slice(0, 5)}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Vùng quét Camera */}
                    {dangQuetCamera && (
                        <div className="bg-gray-900 rounded-2xl overflow-hidden p-3 relative flex flex-col items-center">
                            <div id="shop-barcode-scanner" className="w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden bg-black" />
                            <p className="text-xs text-gray-300 mt-2 text-center">
                                Hướng Camera về mã vạch sách hoặc mã QR thẻ thư viện
                            </p>
                        </div>
                    )}

                    {loiCamera && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                            <FiAlertCircle size={16} />
                            <span>{loiCamera}</span>
                        </div>
                    )}

                    {/* Vùng quét ảnh ẩn */}
                    <div id="shop-reader-file-temp" className="hidden" />

                    {/* Thông báo kết quả / Lỗi */}
                    {thongBao && (
                        <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm flex items-center gap-2 font-medium">
                            <FiCheckCircle size={18} className="text-green-600 shrink-0" />
                            <span>{thongBao}</span>
                        </div>
                    )}

                    {loi && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                            <FiAlertCircle size={18} className="text-red-600 shrink-0" />
                            <span>{loi}</span>
                        </div>
                    )}

                    {/* KẾT QUẢ: THẺ THƯ VIỆN & ĐỘC GIẢ */}
                    {ketQuaThe && (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                                <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                                    <FiCreditCard size={20} className="text-emerald-700" />
                                    <span>THÔNG TIN THẺ THƯ VIỆN</span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                    ketQuaThe.theThuVien?.trangThai === "CON_HAN"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}>
                                    {ketQuaThe.theThuVien?.trangThai === "CON_HAN" ? "✓ Còn hạn sử dụng" : "Hết hạn / Khóa"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500 text-xs block">Họ và tên:</span>
                                    <span className="font-bold text-gray-900 text-base">{ketQuaThe.docGia?.hoTen}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Số thẻ thư viện:</span>
                                    <span className="font-mono font-black text-emerald-800 text-base">
                                        {ketQuaThe.theThuVien?.soThe || `THE-${ketQuaThe.docGia?.maDocGia}`}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Mã độc giả:</span>
                                    <span className="font-mono font-bold text-gray-700">{ketQuaThe.docGia?.maDocGia}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Số điện thoại:</span>
                                    <span className="text-gray-800">{ketQuaThe.docGia?.soDienThoai || "Chưa cập nhật"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Ngày cấp thẻ:</span>
                                    <span className="text-gray-700">{ketQuaThe.theThuVien?.ngayCap || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Hạn thẻ đến:</span>
                                    <span className="font-semibold text-emerald-700">{ketQuaThe.theThuVien?.ngayHetHan || "-"}</span>
                                </div>
                            </div>

                            {/* Danh sách phiếu mượn nếu có */}
                            {Array.isArray(ketQuaThe.phieuMuon) && ketQuaThe.phieuMuon.length > 0 && (
                                <div className="pt-3 border-t border-emerald-200">
                                    <span className="text-xs font-bold text-emerald-900 block mb-2">
                                        Lịch sử / Phiếu mượn gần đây ({ketQuaThe.phieuMuon.length} phiếu):
                                    </span>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                        {ketQuaThe.phieuMuon.slice(0, 3).map((pm) => (
                                            <div key={pm.id} className="text-xs bg-white/80 p-2 rounded-lg border border-emerald-100 flex justify-between items-center">
                                                <span>Phiếu #{pm.id} - Ngày mượn: {pm.ngayMuon || pm.ngay_muon}</span>
                                                <span className="font-semibold text-emerald-800">{pm.trangThai || pm.trang_thai}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end gap-2">
                                <Link
                                    href="/thethuvien"
                                    onClick={() => dong()}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                                >
                                    Xem thẻ thư viện đầy đủ →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* KẾT QUẢ: SÁCH & BẢN SAO SÁCH */}
                    {ketQuaSach && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                            <div className="w-24 h-32 rounded-xl overflow-hidden bg-white border shrink-0 shadow-xs">
                                <img
                                    src={layDuongDanAnh(ketQuaSach.anhBia || ketQuaSach.anh_bia || (ketQuaSach.maSach ? `${ketQuaSach.maSach}.jpg` : null))}
                                    alt={ketQuaSach.tenSach || ketQuaSach.ten_sach}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-1.5 text-sm text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 text-base line-clamp-2">
                                    {ketQuaSach.tenSach || ketQuaSach.ten_sach}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Mã sách: <b className="font-mono text-indigo-700">{ketQuaSach.maSach || ketQuaSach.ma_sach}</b>
                                    {ketQuaSach.banSao && (
                                        <span> | Mã vạch bản sao: <b className="font-mono text-emerald-700">{ketQuaSach.banSao.maVach}</b></span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Năm XB: <b>{ketQuaSach.namXuatBan || "-"}</b> | Giá: <b>{dinhDangTien(ketQuaSach.giaTien || 0)}</b>
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href={`/sach/${ketQuaSach.id || ketQuaSach.banSao?.sachId}`}
                                        onClick={() => dong()}
                                        className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                    >
                                        Xem chi tiết sách này →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

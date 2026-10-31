"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload, FiCheckCircle, FiClock, FiRefreshCw, FiBook } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function TheThuVienPage() {
    const [user, setUser] = useState(null);
    const [the, setThe] = useState(null);
    const [docGia, setDocGia] = useState(null);
    const [dangTai, setDangTai] = useState(true);
    const qrRef = useRef(null);

    const taiThongTinThe = async (docGiaId) => {
        setDangTai(true);
        try {
            const [resThe, resDocGia] = await Promise.all([
                fetch(`${API_CONFIG.BASE_URL}/theThuVien/docGia/${docGiaId}`),
                fetch(`${API_CONFIG.BASE_URL}/docGia/${docGiaId}`),
            ]);
            if (resThe.ok) setThe(await resThe.json());
            if (resDocGia.ok) setDocGia(await resDocGia.json());
        } catch (err) {
            console.error("Lỗi tải thẻ thư viện:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                setUser(u);
                taiThongTinThe(u.docGiaId || u.taiKhoanId || u.id);
            } else {
                setDangTai(false);
            }
        } catch {
            setDangTai(false);
        }
    }, []);

    // Tải thẻ về máy dưới dạng ảnh PNG
    const taiVeMayTinh = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;

        // Vẽ toàn bộ thẻ lên canvas lớn hơn
        const card = document.createElement("canvas");
        card.width = 600;
        card.height = 320;
        const ctx = card.getContext("2d");

        // Nền gradient xanh
        const grad = ctx.createLinearGradient(0, 0, 600, 320);
        grad.addColorStop(0, "#059669");
        grad.addColorStop(1, "#0f766e");
        ctx.fillStyle = grad;
        ctx.roundRect(0, 0, 600, 320, 24);
        ctx.fill();

        // Vẽ QR lên canvas thẻ
        ctx.drawImage(canvas, 380, 70, 180, 180);

        // Tiêu đề thư viện
        ctx.fillStyle = "#a7f3d0";
        ctx.font = "bold 13px Arial";
        ctx.fillText("THƯ VIỆN SÁCH ĐIỆN TỬ", 30, 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.fillText("THẺ ĐỘC GIẢ CHÍNH THỨC", 30, 78);

        // Thông tin người dùng
        ctx.font = "bold 18px Arial";
        ctx.fillText(docGia?.hoTen || user?.hoTen || user?.tenDangNhap || "---", 30, 130);

        ctx.fillStyle = "#d1fae5";
        ctx.font = "13px Arial";
        ctx.fillText(`Số thẻ: ${the?.soThe || "THE-" + (user?.docGiaId || user?.id)}`, 30, 165);
        ctx.fillText(`Mã độc giả: #${user?.docGiaId || user?.id || "---"}`, 30, 190);
        ctx.fillText(`Cấp: ${the?.ngayCap || "---"}`, 30, 215);
        ctx.fillText(`Hết hạn: ${the?.ngayHetHan || "---"}`, 30, 240);

        // Footer
        ctx.fillStyle = "#6ee7b7";
        ctx.font = "11px Arial";
        ctx.fillText("Hệ thống Quản lý Thư viện Số 2026", 30, 290);

        const link = document.createElement("a");
        link.download = `the-thu-vien-${the?.soThe || "the"}.png`;
        link.href = card.toDataURL("image/png");
        link.click();
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-md text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🪪
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Thẻ Thư Viện Điện Tử</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Vui lòng đăng nhập tài khoản độc giả để xem thẻ thư viện có mã QR cá nhân của bạn.
                </p>
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    const soThe = the?.soThe || `THE-${user.docGiaId || user.taiKhoanId || user.id}`;
    const hoTen = docGia?.hoTen || user?.hoTen || user?.tenDangNhap || "Độc giả";
    const conHan = !the?.trangThai || the?.trangThai === "CON_HAN";
    // Giá trị mã QR: mã số thẻ (thủ thư quét để tra cứu)
    const qrValue = soThe;

    return (
        <div className="container mx-auto px-4 py-10 max-w-2xl min-h-[75vh]">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-800">Thẻ Thư Viện Điện Tử</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Xuất trình mã QR tại quầy để thủ thư quét mượn – trả sách
                </p>
            </div>

            {dangTai ? (
                <div className="text-center py-16 text-gray-400">Đang tải thẻ thư viện...</div>
            ) : (
                <>
                    {/* === CARD THẺ THƯ VIỆN === */}
                    <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                        {/* Họa tiết nền */}
                        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                        <div className="absolute left-0 bottom-0 -translate-x-10 translate-y-10 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

                        {/* Header thẻ */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                                    THƯ VIỆN SÁCH ĐIỆN TỬ
                                </span>
                                <h2 className="text-xl font-bold mt-0.5">THẺ ĐỘC GIẢ CHÍNH THỨC</h2>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm ${conHan ? "bg-emerald-400/30 text-emerald-100" : "bg-red-400/30 text-red-100"}`}>
                                {conHan ? <FiCheckCircle /> : <FiClock />}
                                {conHan ? "CÒN HẠN" : "HẾT HẠN"}
                            </span>
                        </div>

                        {/* Nội dung thẻ */}
                        <div ref={qrRef} className="bg-white text-gray-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center gap-6 relative z-10">
                            {/* Mã QR cá nhân */}
                            <div className="text-center shrink-0 flex flex-col items-center gap-2">
                                <QRCodeCanvas
                                    value={qrValue}
                                    size={160}
                                    bgColor="#ffffff"
                                    fgColor="#065f46"
                                    level="M"
                                    includeMargin={true}
                                />
                                <span className="text-[10px] text-gray-400 font-mono">Quét tại quầy</span>
                            </div>

                            {/* Thông tin độc giả */}
                            <div className="flex-1 space-y-3 text-sm w-full">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Họ và tên</span>
                                    <p className="font-black text-gray-900 text-lg leading-tight">{hoTen}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Số thẻ</span>
                                        <p className="font-mono font-bold text-emerald-800">{soThe}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Mã độc giả</span>
                                        <p className="font-mono font-bold text-gray-700">#{user.docGiaId || user.id || "---"}</p>
                                    </div>
                                    {docGia?.email && (
                                        <div className="col-span-2">
                                            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Email</span>
                                            <p className="font-medium text-gray-700 truncate">{docGia.email}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2.5 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                    <span>Cấp: <b className="text-gray-700">{the?.ngayCap || "---"}</b></span>
                                    <span>Hết hạn: <b className={conHan ? "text-emerald-700" : "text-red-600"}>{the?.ngayHetHan || "---"}</b></span>
                                </div>
                            </div>
                        </div>

                        {/* Footer thẻ */}
                        <div className="mt-5 flex justify-between items-center text-xs text-emerald-300 relative z-10">
                            <span>Hệ thống Quản lý Thư viện Số 2026</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={taiVeMayTinh}
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5"
                                    title="Tải thẻ về máy"
                                >
                                    <FiDownload size={13} /> Tải thẻ
                                </button>
                                <Link
                                    href="/phieumuon"
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5"
                                >
                                    <FiBook size={13} /> Sách đang mượn
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* === HƯỚNG DẪN SỬ DỤNG === */}
                    <div className="mt-6 grid sm:grid-cols-3 gap-4">
                        {[
                            { icon: "📱", title: "Mở thẻ điện tử", desc: "Mở trang này trên điện thoại khi đến quầy thư viện" },
                            { icon: "📷", title: "Thủ thư quét mã", desc: "Thủ thư dùng máy quét hoặc camera để đọc mã QR của bạn" },
                            { icon: "📚", title: "Mượn & trả sách", desc: "Hệ thống tự động cập nhật danh sách sách bạn mượn" },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                                <div className="text-2xl mb-2">{icon}</div>
                                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

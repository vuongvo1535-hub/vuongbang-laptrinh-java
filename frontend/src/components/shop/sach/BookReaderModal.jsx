"use client";

import { useState, useEffect } from "react";
import { 
    FiX, FiBookOpen, FiList, FiSun, FiMoon, 
    FiChevronLeft, FiChevronRight, FiShoppingCart, 
    FiZoomIn, FiZoomOut, FiCheckCircle 
} from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function BookReaderModal({ sachId, isOpen, onClose, onMuonSach, daTrongGio }) {
    const [duLieuDoc, setDuLieuDoc] = useState(null);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    
    // Tuỳ biến giao diện đọc sách
    const [cheDoMau, setCheDoMau] = useState("sepia"); // "light", "sepia", "dark"
    const [coChu, setCoChu] = useState("base"); // "sm", "base", "lg", "xl"
    const [chuongHienTai, setChuongHienTai] = useState(0);
    const [hienMucLuc, setHienMucLuc] = useState(false);

    useEffect(() => {
        if (!isOpen || !sachId) return;

        const taiDuLieu = async () => {
            setDangTai(true);
            setLoi("");
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/sach/${sachId}/docThu`);
                if (!res.ok) throw new Error("Không thể tải dữ liệu đọc thử sách");
                const data = await res.json();
                setDuLieuDoc(data);
                setChuongHienTai(0);
            } catch (err) {
                setLoi(err.message || "Đã có lỗi xảy ra");
            } finally {
                setDangTai(false);
            }
        };

        taiDuLieu();
    }, [isOpen, sachId]);

    // Đóng khi bấm phím Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Phong cách màu
    const themeClasses = {
        light: "bg-white text-gray-800",
        sepia: "bg-[#fbf7ee] text-[#4a3b2c]",
        dark: "bg-slate-900 text-slate-200"
    };

    const headerThemeClasses = {
        light: "bg-white border-b border-gray-200 text-gray-800",
        sepia: "bg-[#f4ebd9] border-b border-[#e5d5be] text-[#4a3b2c]",
        dark: "bg-slate-800 border-b border-slate-700 text-slate-100"
    };

    const sidebarThemeClasses = {
        light: "bg-gray-50 border-r border-gray-200",
        sepia: "bg-[#f5ecdd] border-r border-[#e5d5be]",
        dark: "bg-slate-950 border-r border-slate-800"
    };

    const fontSizes = {
        sm: "text-sm leading-relaxed",
        base: "text-base leading-loose",
        lg: "text-lg leading-loose",
        xl: "text-xl leading-loose"
    };

    const chuongList = duLieuDoc?.chuongTrichDoan || [];
    const chuong = chuongList[chuongHienTai];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className={`relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${themeClasses[cheDoMau]}`}>
                
                {/* THANH ĐIỀU KHIỂN TRÊN CÙNG (HEADER) */}
                <div className={`px-4 py-3 flex items-center justify-between gap-3 shrink-0 ${headerThemeClasses[cheDoMau]}`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setHienMucLuc(!hienMucLuc)}
                            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5 text-xs font-semibold"
                            title="Danh sách mục lục"
                        >
                            <FiList size={18} />
                            <span className="hidden sm:inline">Mục lục</span>
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold truncate">
                                📖 {duLieuDoc?.tenSach || "Đang tải tác phẩm..."}
                            </h2>
                            <p className="text-[11px] opacity-75 truncate">
                                Tác giả: {duLieuDoc?.tacGia || "..."} • Thể loại: {duLieuDoc?.danhMuc || "..."}
                            </p>
                        </div>
                    </div>

                    {/* Bộ công cụ chỉnh chế độ đọc (Cỡ chữ, Giao diện màu) */}
                    <div className="flex items-center gap-2">
                        {/* Cỡ chữ */}
                        <div className="flex items-center border border-current/20 rounded-lg p-0.5">
                            <button
                                onClick={() => setCoChu(prev => prev === "xl" ? "lg" : prev === "lg" ? "base" : "sm")}
                                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded"
                                title="Giảm cỡ chữ"
                            >
                                <FiZoomOut size={14} />
                            </button>
                            <span className="text-[11px] font-bold px-1.5 uppercase select-none">{coChu}</span>
                            <button
                                onClick={() => setCoChu(prev => prev === "sm" ? "base" : prev === "base" ? "lg" : "xl")}
                                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded"
                                title="Tăng cỡ chữ"
                            >
                                <FiZoomIn size={14} />
                            </button>
                        </div>

                        {/* Chế độ màu sắc */}
                        <div className="flex items-center border border-current/20 rounded-lg p-0.5 gap-1">
                            <button
                                onClick={() => setCheDoMau("light")}
                                className={`px-2 py-1 rounded text-xs font-medium transition ${cheDoMau === "light" ? "bg-white shadow text-gray-900 font-bold" : "hover:opacity-80"}`}
                                title="Chế độ Ban ngày (Sáng)"
                            >
                                <FiSun size={14} />
                            </button>
                            <button
                                onClick={() => setCheDoMau("sepia")}
                                className={`px-2 py-1 rounded text-xs font-medium transition ${cheDoMau === "sepia" ? "bg-[#e9dac3] font-bold text-[#382b1c]" : "hover:opacity-80"}`}
                                title="Chế độ Giấy ngà (Dịu mắt)"
                            >
                                📜
                            </button>
                            <button
                                onClick={() => setCheDoMau("dark")}
                                className={`px-2 py-1 rounded text-xs font-medium transition ${cheDoMau === "dark" ? "bg-slate-700 text-white font-bold" : "hover:opacity-80"}`}
                                title="Chế độ Ban đêm (Tối)"
                            >
                                <FiMoon size={14} />
                            </button>
                        </div>

                        {/* Nút đóng */}
                        <button
                            onClick={onClose}
                            className="p-2 ml-1 rounded-xl hover:bg-red-500 hover:text-white transition"
                            title="Đóng bản đọc thử (Esc)"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </div>

                {/* THÂN NỘI DUNG (SIDEBAR MỤC LỤC + NỘI DUNG ĐỌC) */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Sidebar Mục lục (Hiển thị khi toggle hoặc màn hình lớn) */}
                    {hienMucLuc && (
                        <div className={`w-72 shrink-0 p-4 overflow-y-auto z-10 transition-all ${sidebarThemeClasses[cheDoMau]}`}>
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
                                <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <FiList /> Mục lục trích đoạn
                                </h3>
                                <button onClick={() => setHienMucLuc(false)} className="text-xs hover:underline">
                                    Đóng
                                </button>
                            </div>

                            <div className="space-y-1 mb-6">
                                <p className="text-[11px] font-semibold opacity-60 uppercase mb-2">Trích đoạn xem trước</p>
                                {chuongList.map((c, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setChuongHienTai(idx);
                                            setHienMucLuc(false);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-start justify-between gap-2 ${
                                            chuongHienTai === idx 
                                                ? "bg-emerald-600 text-white font-bold shadow-sm" 
                                                : "hover:bg-black/5 dark:hover:bg-white/10 opacity-85"
                                        }`}
                                    >
                                        <span className="line-clamp-2">{c.tieuDe}</span>
                                        <span className="text-[10px] shrink-0 opacity-80">Tr. {c.trangBatDau}</span>
                                    </button>
                                ))}
                            </div>

                            {duLieuDoc?.mucLuc && (
                                <div className="space-y-1">
                                    <p className="text-[11px] font-semibold opacity-60 uppercase mb-2">Mục lục sách đầy đủ</p>
                                    {duLieuDoc.mucLuc.map((ml, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2 rounded-lg text-[11px] opacity-75 flex items-center justify-between border-b border-current/5"
                                        >
                                            <span className="truncate pr-2 font-medium">{ml.chuong}: {ml.tieuDe}</span>
                                            <span className="shrink-0 opacity-60">Tr. {ml.trang}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* VÙNG ĐỌC VĂN BẢN CHÍNH */}
                    <div className="flex-1 overflow-y-auto px-6 sm:px-16 py-8 flex flex-col items-center">
                        {dangTai ? (
                            <div className="m-auto text-center py-20">
                                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-sm font-semibold opacity-75">Đang nạp dữ liệu trích đoạn cuốn sách...</p>
                            </div>
                        ) : loi ? (
                            <div className="m-auto text-center py-20 text-red-500">
                                <p className="text-base font-bold mb-2">Không thể tải bản đọc thử</p>
                                <p className="text-xs opacity-80">{loi}</p>
                            </div>
                        ) : chuong ? (
                            <div className="max-w-2xl w-full">
                                {/* Tiêu đề chương */}
                                <div className="text-center pb-8 mb-8 border-b border-current/10">
                                    <span className="text-[11px] font-bold tracking-widest uppercase opacity-60 px-3 py-1 rounded-full border border-current/20 inline-block mb-3">
                                        Bản đọc thử trích đoạn • Trang {chuong.trangBatDau} / {duLieuDoc?.tongSoTrang || 300}
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mt-1">
                                        {chuong.tieuDe}
                                    </h1>
                                </div>

                                {/* Nội dung văn bản */}
                                <div className={`font-serif ${fontSizes[coChu]} whitespace-pre-line text-justify space-y-4`}>
                                    {chuong.noiDung}
                                </div>

                                {/* Hộp kêu gọi mượn sách */}
                                <div className="mt-12 p-6 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-50/20 text-center">
                                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                                        ✨ Thích cuốn sách này?
                                    </p>
                                    <p className="text-xs opacity-75 mb-4">
                                        Mượn trọn bộ cuốn sách hoàn toàn miễn phí tại Thư viện để đọc tiếp các chương tiếp theo.
                                    </p>
                                    <button
                                        onClick={onMuonSach}
                                        disabled={daTrongGio}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition inline-flex items-center gap-2 ${
                                            daTrongGio 
                                                ? "bg-gray-400 text-white cursor-not-allowed" 
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                        }`}
                                    >
                                        <FiShoppingCart size={14} />
                                        <span>{daTrongGio ? "Đã có trong giỏ mượn" : "Thêm vào giỏ mượn sách ngay"}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="m-auto text-center py-20 opacity-60 text-sm">
                                Cuốn sách chưa có nội dung đọc thử trực tuyến.
                            </div>
                        )}
                    </div>
                </div>

                {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG (FOOTER) */}
                <div className={`px-4 py-3 flex items-center justify-between gap-3 shrink-0 ${headerThemeClasses[cheDoMau]}`}>
                    <button
                        onClick={() => setChuongHienTai(prev => Math.max(0, prev - 1))}
                        disabled={chuongHienTai === 0}
                        className="px-3 py-1.5 rounded-lg border border-current/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                        <FiChevronLeft size={16} />
                        <span>Trang / Phần trước</span>
                    </button>

                    <span className="text-xs font-medium opacity-75">
                        Phần {chuongHienTai + 1} / {chuongList.length || 1}
                    </span>

                    <button
                        onClick={() => setChuongHienTai(prev => Math.min(chuongList.length - 1, prev + 1))}
                        disabled={chuongHienTai >= chuongList.length - 1}
                        className="px-3 py-1.5 rounded-lg border border-current/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                        <span>Phần tiếp theo</span>
                        <FiChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

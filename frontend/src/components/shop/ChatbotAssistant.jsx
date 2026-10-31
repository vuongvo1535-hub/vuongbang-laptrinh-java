"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
    FiMessageSquare, FiX, FiSend, FiRefreshCw, 
    FiBookOpen, FiArrowRight, FiCheckCircle, FiHelpCircle,
    FiChevronDown, FiUser
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { layDuongDanAnh } from "@/utils/format";

const CAU_HOI_MAU = [
    "Quy định mượn trả sách",
    "Cách gia hạn mượn 1-click",
    "Phí phạt quá hạn là bao nhiêu?",
    "Thẻ thư viện QR là gì?",
    "Hướng dẫn đọc thử sách",
    "Gợi ý sách hay nhất tuần",
];

export default function ChatbotAssistant() {
    const [moChat, setMoChat] = useState(false);
    const [tinNhan, setTinNhan] = useState([
        {
            nguoiGui: "bot",
            noiDung: "👋 **Xin chào bạn!** Tôi là **Thư ký ảo AI** của Thư viện số.\n\nTôi có thể giúp bạn tra cứu sách tức thì, hướng dẫn gia hạn mượn 1-click, giải đáp quy định mượn trả và mức phạt quá hạn. Bạn đang cần tìm hiểu thông tin gì?",
            suggestedQuestions: CAU_HOI_MAU,
            books: []
        }
    ]);
    const [vanBanNhap, setVanBanNhap] = useState("");
    const [dangTraLoi, setDangTraLoi] = useState(false);
    const cuonCuoiRef = useRef(null);

    const cuonXuongCuoi = () => {
        cuonCuoiRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (moChat) {
            cuonXuongCuoi();
        }
    }, [tinNhan, moChat, dangTraLoi]);

    const guiTinNhan = async (noiDungGui) => {
        const text = (noiDungGui || vanBanNhap).trim();
        if (!text || dangTraLoi) return;

        // Thêm tin nhắn của người dùng
        const tinNhanMoi = [...tinNhan, { nguoiGui: "user", noiDung: text }];
        setTinNhan(tinNhanMoi);
        setVanBanNhap("");
        setDangTraLoi(true);

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/troLyAi/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (res.ok) {
                const data = await res.json();
                setTinNhan(prev => [
                    ...prev,
                    {
                        nguoiGui: "bot",
                        noiDung: data.reply || "Tôi đã nhận được câu hỏi của bạn.",
                        suggestedQuestions: data.suggestedQuestions || [],
                        books: data.books || []
                    }
                ]);
            } else {
                throw new Error("Không thể kết nối máy chủ");
            }
        } catch (err) {
            setTinNhan(prev => [
                ...prev,
                {
                    nguoiGui: "bot",
                    noiDung: "⚠️ Xin lỗi, hiện tại hệ thống kết nối AI đang bận. Bạn có thể thử lại sau ít giây hoặc chọn một trong các câu hỏi gợi ý bên dưới.",
                    suggestedQuestions: ["Quy định mượn trả sách", "Cách gia hạn mượn 1-click"],
                    books: []
                }
            ]);
        } finally {
            setDangTraLoi(false);
        }
    };

    const lamMoiCuocTroChuyen = () => {
        setTinNhan([
            {
                nguoiGui: "bot",
                noiDung: "Đã làm mới cuộc hội thoại! 👋 Tôi có thể hỗ trợ gì cho bạn trong việc mượn sách hôm nay?",
                suggestedQuestions: CAU_HOI_MAU,
                books: []
            }
        ]);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 select-none">
            {/* CỬA SỔ CHATBOT (HIỂN THỊ KHI MỞ) */}
            {moChat && (
                <div className="mb-4 w-[92vw] sm:w-[410px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
                    
                    {/* Header Cửa Sổ Chat */}
                    <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white p-4 flex items-center justify-between shrink-0 shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/20">
                                    🤖
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                                    <span>Trợ Lý Ảo Thư Viện</span>
                                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-mono">AI</span>
                                </h3>
                                <p className="text-[11px] text-emerald-200/80">Sẵn sàng giải đáp 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={lamMoiCuocTroChuyen}
                                className="p-2 hover:bg-white/10 rounded-xl transition text-emerald-200 hover:text-white"
                                title="Làm mới cuộc trò chuyện"
                            >
                                <FiRefreshCw size={15} />
                            </button>
                            <button
                                onClick={() => setMoChat(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition text-emerald-200 hover:text-white"
                                title="Thu nhỏ khung chat"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Vùng Cuộn Tin Nhắn */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-xs">
                        {tinNhan.map((tn, idx) => {
                            const isBot = tn.nguoiGui === "bot";
                            return (
                                <div key={idx} className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}>
                                    {isBot && (
                                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                                            🤖
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] space-y-2 ${isBot ? "" : "text-right"}`}>
                                        <div
                                            className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-left shadow-xs ${
                                                isBot
                                                    ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                                                    : "bg-emerald-600 text-white rounded-br-xs font-medium"
                                            }`}
                                        >
                                            {tn.noiDung}
                                        </div>

                                        {/* Card Sách gợi ý (nếu có) */}
                                        {isBot && tn.books && tn.books.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2 pt-1">
                                                {tn.books.map((b) => {
                                                    const anh = layDuongDanAnh(b.anhBia) || `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                                                        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140" viewBox="0 0 100 140"><rect width="100" height="140" fill="#e2e8f0"/><text x="50" y="70" font-size="10" fill="#64748b" text-anchor="middle">📚</text></svg>`
                                                    )}`;
                                                    return (
                                                        <div
                                                            key={b.id}
                                                            className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs hover:border-emerald-500 transition"
                                                        >
                                                            <img
                                                                src={anh}
                                                                alt={b.tenSach}
                                                                className="w-10 h-14 object-cover rounded-lg shrink-0 bg-slate-100"
                                                            />
                                                            <div className="flex-1 min-w-0 text-left">
                                                                <h4 className="font-bold text-slate-800 truncate text-[11px]">
                                                                    {b.tenSach}
                                                                </h4>
                                                                <p className="text-[10px] text-slate-400 truncate">
                                                                    {b.tacGia || "Thư viện"}
                                                                </p>
                                                                <div className="mt-1 flex items-center justify-between">
                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${b.conSach ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                                                                        {b.conSach ? "Sẵn sàng" : "Đã mượn"}
                                                                    </span>
                                                                    <Link
                                                                        href={`/sach/${b.id}`}
                                                                        onClick={() => setMoChat(false)}
                                                                        className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                                                                    >
                                                                        <span>Xem</span>
                                                                        <FiArrowRight size={10} />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Câu hỏi gợi ý nhanh */}
                                        {isBot && tn.suggestedQuestions && tn.suggestedQuestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {tn.suggestedQuestions.map((q, qIdx) => (
                                                    <button
                                                        key={qIdx}
                                                        onClick={() => guiTinNhan(q)}
                                                        className="text-[10px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/70 transition text-left"
                                                    >
                                                        💡 {q}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Chỉ báo bot đang suy nghĩ */}
                        {dangTraLoi && (
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                                    🤖
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={cuonCuoiRef} />
                    </div>

                    {/* Khung Soạn Thảo Tin Nhắn */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            guiTinNhan();
                        }}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                    >
                        <input
                            value={vanBanNhap}
                            onChange={(e) => setVanBanNhap(e.target.value)}
                            placeholder="Nhập câu hỏi hoặc tên sách cần tìm..."
                            className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                        <button
                            type="submit"
                            disabled={!vanBanNhap.trim() || dangTraLoi}
                            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition shadow-sm shadow-emerald-600/20 shrink-0"
                            title="Gửi câu hỏi"
                        >
                            <FiSend size={15} />
                        </button>
                    </form>
                </div>
            )}

            {/* NÚT BONG BÓNG BẬT TẮT CHATBOT (LUÔN NẰM GÓC DƯỚI) */}
            <button
                onClick={() => setMoChat(!moChat)}
                className={`relative group flex items-center justify-center transition-all duration-300 shadow-xl ${
                    moChat
                        ? "w-12 h-12 rounded-2xl bg-slate-800 text-white hover:bg-slate-900"
                        : "w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white hover:scale-105 active:scale-95 shadow-emerald-600/35 ring-4 ring-emerald-500/20"
                }`}
                title={moChat ? "Đóng trợ lý ảo" : "Mở Trợ lý ảo AI Thư viện"}
            >
                {moChat ? (
                    <FiChevronDown size={22} />
                ) : (
                    <>
                        <span className="text-2xl animate-pulse">🤖</span>
                        {/* Đèn xanh báo trạng thái Online */}
                        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                    </>
                )}

                {/* Nhãn gợi ý khi hover lúc đang đóng */}
                {!moChat && (
                    <div className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        ✨ Trợ lý ảo AI Thư viện
                    </div>
                )}
            </button>
        </div>
    );
}

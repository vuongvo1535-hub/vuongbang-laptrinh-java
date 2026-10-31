"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    FiCamera, FiAward, FiStar, FiSearch, FiBookOpen, 
    FiCreditCard, FiRefreshCw, FiMail, FiCheckCircle, 
    FiArrowRight, FiBookmark, FiTrendingUp, FiCompass 
} from "react-icons/fi";
import SachService from "@/services/shop/sachServices";
import SachCard from "@/components/shop/sach/SachCard";
import BarcodeScannerModal from "@/components/shop/BarcodeScannerModal";
import API_CONFIG from "@/config/api";

const QUY_TRINH = [
    {
        buoc: "01",
        tieuDe: "Tra cứu & Đọc thử",
        moTa: "Tìm kiếm đầu sách yêu thích, xem tình trạng còn/hết và đọc thử trích đoạn trực tuyến.",
        icon: <FiBookOpen size={24} className="text-emerald-600" />
    },
    {
        buoc: "02",
        tieuDe: "Thêm giỏ / Đặt trước",
        moTa: "Tạo danh sách mượn hoặc ghi danh đặt trước vào hàng đợi thông minh nếu sách đang mượn hết.",
        icon: <FiBookmark size={24} className="text-amber-500" />
    },
    {
        buoc: "03",
        tieuDe: "Quét mã & Nhận sách",
        moTa: "Mở Thẻ thư viện mã QR cá nhân trên điện thoại để thủ thư quét mã xác nhận mượn siêu tốc.",
        icon: <FiCreditCard size={24} className="text-blue-500" />
    },
];

const TIEN_ICH_NOI_BAT = [
    {
        tieuDe: "Thẻ Thư Viện QR Cá Nhân",
        moTa: "Số hóa thẻ sinh viên dạng mã QR, quét nhận diện độc giả tại quầy không cần thẻ nhựa vật lý.",
        icon: <FiCreditCard size={26} className="text-emerald-600" />,
        link: "/thethuvien",
        nutText: "Xem thẻ của tôi",
        mauNen: "bg-emerald-50 border-emerald-100"
    },
    {
        tieuDe: "Gia Hạn Mượn 1-Click",
        moTa: "Tự động cộng thêm 7 ngày mượn ngay trên trang cá nhân mà không sợ bị quá hạn hay phạt tiền.",
        icon: <FiRefreshCw size={26} className="text-blue-600" />,
        link: "/phieumuon",
        nutText: "Xem phiếu mượn",
        mauNen: "bg-blue-50 border-blue-100"
    },
    {
        tieuDe: "Đọc Thử E-Reader Trực Tuyến",
        moTa: "Xem trước mục lục, trích đoạn sách với chế độ đọc Ban ngày, Giấy ngà Sepia dịu mắt & Ban đêm.",
        icon: <FiBookOpen size={26} className="text-purple-600" />,
        link: "/sach",
        nutText: "Đọc thử sách",
        mauNen: "bg-purple-50 border-purple-100"
    },
    {
        tieuDe: "Nhắc Hạn Trả Tự Động",
        moTa: "Hệ thống tự động quét lịch mượn và gửi email thông báo trước hạn trả giúp bạn luôn an tâm.",
        icon: <FiMail size={26} className="text-amber-600" />,
        link: "/phieumuon",
        nutText: "Lịch sử mượn",
        mauNen: "bg-amber-50 border-amber-100"
    }
];

export default function TrangChu() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [danhMuc, setDanhMuc] = useState([]);
    const [sachMoi, setSachMoi] = useState([]);
    const [sachGoiY, setSachGoiY] = useState([]);
    const [user, setUser] = useState(null);
    const [tong, setTong] = useState(0);
    const [loi, setLoi] = useState("");
    const [moQuetMa, setMoQuetMa] = useState(false);
    const [maQuetBanDau, setMaQuetBanDau] = useState("");

    useEffect(() => {
        (async () => {
            try {
                let u = null;
                try {
                    u = JSON.parse(localStorage.getItem("user") || "null");
                    setUser(u);
                } catch {}

                const docGiaParam = u?.docGiaId || u?.taiKhoanId || u?.id || "";
                const [dm, ds, resGoiY] = await Promise.all([
                    SachService.getDanhMuc(),
                    SachService.getSach(),
                    fetch(`${API_CONFIG.BASE_URL}/sach/goiY?docGiaId=${docGiaParam}`).then(r => r.ok ? r.json() : []).catch(() => [])
                ]);
                setDanhMuc(Array.isArray(dm) ? dm : (dm?.data || []));

                const danhSachSach = Array.isArray(ds) ? ds : (ds?.data || []);
                setSachMoi(danhSachSach.slice(0, 8));
                setTong(danhSachSach.length);
                setSachGoiY(Array.isArray(resGoiY) ? resGoiY.slice(0, 4) : []);
            } catch (err) {
                console.error("Lỗi tải trang chủ:", err);
                setLoi("Không tải được dữ liệu từ máy chủ. Vui lòng kiểm tra Backend.");
            }
        })();
    }, []);

    const timKiem = (e) => {
        e.preventDefault();
        const str = q.trim();
        if (!str) return;

        // Nếu quét mã thẻ độc giả hoặc mã bản sao sách
        if (str.toUpperCase().startsWith("THE-") || str.toUpperCase().startsWith("THE") || str.toUpperCase().startsWith("DG") || str.toUpperCase().startsWith("BS-")) {
            setMaQuetBanDau(str);
            setMoQuetMa(true);
            return;
        }

        router.push(`/sach?q=${encodeURIComponent(str)}`);
    };

    return (
        <div className="pb-16 space-y-12">
            {/* ============================================================== */}
            {/* HERO BANNER SECTION (GIAO DIỆN ĐẲNG CẤP & HIỆN ĐẠI) */}
            {/* ============================================================== */}
            <section className="container mx-auto px-4 pt-6">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white p-8 sm:p-14 md:p-16 shadow-2xl border border-emerald-500/20">
                    
                    {/* Hiệu ứng hào quang trang trí phía sau */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        {/* Huy hiệu Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Hệ Thống Thư Viện Số 4.0 • Công Nghệ Đột Phá</span>
                        </div>

                        {/* Tiêu đề chính */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Khám Phá Tri Thức <br />
                            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                                Mượn Sách Thông Minh
                            </span>
                        </h1>

                        <p className="mt-4 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                            Kho tài liệu phong phú, tra cứu tức thì, đọc thử trích đoạn trực tuyến, gia hạn 1-click & định danh mã QR siêu tốc.
                        </p>

                        {/* Thanh Tìm Kiếm & Quét Mã Vạch Thông Minh */}
                        <form onSubmit={timKiem} className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-xl p-2 border border-emerald-200/50">
                            <div className="pl-3 text-slate-400">
                                <FiSearch size={20} />
                            </div>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Nhập tên cuốn sách, tác giả, chuyên ngành hoặc mã thẻ..."
                                className="flex-1 px-3 py-3 text-slate-800 placeholder-slate-400 focus:outline-none text-xs sm:text-sm"
                            />
                            
                            <button
                                type="button"
                                onClick={() => {
                                    setMaQuetBanDau(q.trim());
                                    setMoQuetMa(true);
                                }}
                                title="Quét mã vạch hoặc mã QR bằng Camera"
                                className="px-3 py-2.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
                            >
                                <FiCamera size={18} />
                                <span className="hidden sm:inline">Quét QR/Mã</span>
                            </button>

                            <button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-xl transition text-xs sm:text-sm shadow-md shadow-emerald-600/30 whitespace-nowrap ml-1"
                            >
                                Tra Cứu
                            </button>
                        </form>

                        {/* Thống kê nhanh dạng thẻ con (Quick Metrics) */}
                        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-amber-300">
                                    {tong > 0 ? tong : "1,500"}+
                                </p>
                                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Đầu sách lưu hành</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-emerald-300">100%</p>
                                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Mượn trả số hóa</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-teal-300">1-Click</p>
                                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Tự động gia hạn</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-purple-300">QR Code</p>
                                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Thẻ độc giả điện tử</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal Quét Mã Vạch & QR Thư Viện */}
            <BarcodeScannerModal
                mo={moQuetMa}
                dong={() => {
                    setMoQuetMa(false);
                    setMaQuetBanDau("");
                }}
                maBanDau={maQuetBanDau}
            />

            {loi && (
                <div className="container mx-auto px-4">
                    <p className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold text-sm">
                        {loi}
                    </p>
                </div>
            )}

            {/* ============================================================== */}
            {/* GỢI Ý DÀNH RIÊNG CHO BẠN (AI RECOMMENDATION ENGINE) */}
            {/* ============================================================== */}
            {sachGoiY.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">✨</span>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        Gợi Ý Sách Dành Riêng Cho Bạn
                                    </h2>
                                    <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                        AI Match
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {user
                                        ? `Hệ thống phân tích thể loại yêu thích và lịch sử mượn của bạn đọc "${user.hoTen || user.tenDangNhap}"`
                                        : "Được tổng hợp từ các đầu sách thịnh hành và đánh giá 5 sao cao nhất tuần này"}
                                </p>
                            </div>
                            <Link
                                href="/sach"
                                className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs hover:text-emerald-800 bg-white hover:bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 transition shadow-xs whitespace-nowrap"
                            >
                                <span>Khám phá thêm</span>
                                <FiArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {sachGoiY.map((x) => (
                                <div key={x.id} className="relative group">
                                    <div className="mb-2">
                                        <span className="inline-flex items-center gap-1 bg-white text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs line-clamp-1">
                                            ✨ {x.lyDoGoiY}
                                        </span>
                                    </div>
                                    <SachCard sach={x} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================== */}
            {/* BẢNG CÁC TÍNH NĂNG ĐỘT PHÁ CỦA THƯ VIỆN SỐ */}
            {/* ============================================================== */}
            <section className="container mx-auto px-4">
                <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                        Tiện ích thế hệ mới
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                        Trải Nghiệm Mượn Sách Vượt Trội
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Áp dụng toàn diện số hóa vào quy trình quản lý mượn trả tại thư viện
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TIEN_ICH_NOI_BAT.map((item, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl border transition duration-200 flex flex-col justify-between ${item.mauNen} hover:shadow-md hover:-translate-y-1`}
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                                    {item.tieuDe}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.moTa}
                                </p>
                            </div>

                            <Link
                                href={item.link}
                                className="mt-5 inline-flex items-center gap-1.5 font-bold text-xs text-slate-800 hover:text-emerald-700 transition"
                            >
                                <span>{item.nutText}</span>
                                <FiArrowRight size={13} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============================================================== */}
            {/* DANH MỤC THỂ LOẠI SÁCH */}
            {/* ============================================================== */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Danh Mục Thể Loại
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Khám phá các chuyên ngành và chủ đề đa dạng</p>
                    </div>
                    <Link href="/danhmuc" className="text-emerald-700 font-bold text-xs hover:underline">
                        Tất cả thể loại →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {danhMuc.map((d) => (
                        <Link
                            key={d.id}
                            href={`/sach?danh_muc=${d.id}`}
                            className="group bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs hover:shadow-lg hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center text-xl transition duration-200 mb-2">
                                📚
                            </div>
                            <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition line-clamp-1">
                                {d.tenDanhMuc || d.ten_danh_muc}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                {d.moTa || d.mo_ta || "Kho tài liệu"}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ============================================================== */}
            {/* SÁCH MỚI NHẬP KHO */}
            {/* ============================================================== */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Sách Mới Nhập Kho
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Các ấn phẩm được bổ sung mới nhất vào thư viện</p>
                    </div>
                    <Link
                        href="/sach"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition"
                    >
                        <span>Xem tất cả kho sách ({tong})</span>
                        <FiArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {sachMoi.map((x) => (
                        <SachCard key={x.id} sach={x} />
                    ))}
                </div>
            </section>

            {/* ============================================================== */}
            {/* QUY TRÌNH MƯỢN SÁCH 3 BƯỚC */}
            {/* ============================================================== */}
            <section className="container mx-auto px-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                            Đơn giản & Tiện lợi
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                            Quy Trình Mượn Sách 3 Bước
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Tiết kiệm thời gian, trải nghiệm mượn trả dễ dàng như một ứng dụng hiện đại
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {QUY_TRINH.map((q, idx) => (
                            <div
                                key={idx}
                                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/60 flex flex-col items-center text-center group hover:bg-emerald-50/50 hover:border-emerald-200 transition"
                            >
                                <span className="absolute top-4 right-4 text-3xl font-black text-slate-200 group-hover:text-emerald-200/70 transition">
                                    {q.buoc}
                                </span>
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-4">
                                    {q.icon}
                                </div>
                                <h3 className="font-bold text-base text-slate-900 mb-1">
                                    {q.tieuDe}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {q.moTa}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

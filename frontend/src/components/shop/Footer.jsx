import Link from "next/link";
import { FiBookOpen, FiClock, FiMapPin, FiPhone, FiMail, FiCheckCircle, FiShield } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-4 py-12 lg:py-16 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                
                {/* Cột 1: Thông tin hệ thống */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                            <FiBookOpen size={20} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-white leading-none">
                                THƯ VIỆN SỐ
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                Digital Library System
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Hệ thống số hóa quản lý tài liệu và mượn trả sách thông minh. Tích hợp mã định danh QR cá nhân, đọc thử trực tuyến, gia hạn 1-click và phân tích gợi ý AI.
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                            <FiCheckCircle size={13} />
                            <span>Đồ Án Tốt Nghiệp 2026</span>
                        </span>
                    </div>
                </div>

                {/* Cột 2: Danh mục liên kết nhanh */}
                <div className="space-y-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                        Khám Phá Tài Liệu
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400">
                        <li>
                            <Link href="/sach" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                                <span>• Tra cứu kho sách trực tuyến</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/danhmuc" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                                <span>• Phân loại theo chuyên ngành</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/thethuvien" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                                <span>• Thẻ thư viện điện tử cá nhân</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/phieumuon" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                                <span>• Lịch sử mượn & Phiếu phạt</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/giomuon" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                                <span>• Giỏ mượn sách hiện tại</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Giờ phục vụ & Quy định */}
                <div className="space-y-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                        <FiClock className="text-emerald-400" />
                        <span>Thời Gian Phục Vụ</span>
                    </h3>
                    <div className="text-xs text-slate-400 space-y-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                            <p className="font-semibold text-slate-200">Thứ Hai – Thứ Sáu:</p>
                            <p className="text-emerald-400 font-mono">07:30 – 11:30 | 13:00 – 17:00</p>
                            <p className="font-semibold text-slate-200 pt-1">Thứ Bảy:</p>
                            <p className="text-amber-400 font-mono">08:00 – 11:30 (Buổi sáng)</p>
                            <p className="text-[11px] text-slate-500 pt-1">Hệ thống mượn trả trực tuyến & gia hạn hoạt động 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Cột 4: Thông tin liên hệ thư viện */}
                <div className="space-y-3">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                        Thông Tin Liên Hệ
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-400">
                        <li className="flex items-start gap-2.5">
                            <FiMapPin className="text-emerald-400 shrink-0 mt-0.5" size={15} />
                            <span>Tòa nhà Thư viện Trung tâm, Khuôn viên Đại học</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <FiPhone className="text-emerald-400 shrink-0" size={15} />
                            <span>Hotline: (028) 3899 xxxx</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <FiMail className="text-emerald-400 shrink-0" size={15} />
                            <span>thuvien@daihoc.edu.vn</span>
                        </li>
                        <li className="pt-2">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-[11px] py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
                            >
                                <FiShield size={12} className="text-emerald-400" />
                                <span>Cổng dành cho Thủ thư & Quản trị</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Dòng bản quyền dưới cùng */}
            <div className="border-t border-slate-900 py-5 text-center text-xs text-slate-500">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© 2026 Hệ Thống Quản Lý Thư Viện Số. Bảo lưu mọi quyền.</p>
                    <p className="text-slate-400">Ứng dụng phục vụ Học tập & Nghiên cứu Khoa học</p>
                </div>
            </div>
        </footer>
    );
}

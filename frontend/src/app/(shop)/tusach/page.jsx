"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    FiHeart, FiBookOpen, FiBookmark, FiCheckCircle, 
    FiTrash2, FiEdit3, FiArrowRight, FiSearch, 
    FiPlus, FiClock, FiLayers, FiAlertCircle 
} from "react-icons/fi";
import API_CONFIG from "@/config/api";
import { layDuongDanAnh } from "@/utils/format";

const TRANG_THAI_DOC = {
    YEU_THICH: { label: "Yêu thích", mau: "bg-rose-50 text-rose-700 border-rose-200", icon: "❤️" },
    DANG_DOC: { label: "Đang đọc dở", mau: "bg-blue-50 text-blue-700 border-blue-200", icon: "📖" },
    MUON_DOC: { label: "Muốn đọc sau", mau: "bg-amber-50 text-amber-700 border-amber-200", icon: "📌" },
    DA_DOC: { label: "Đã đọc xong", mau: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "✅" },
};

export default function TuSachPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [danhSach, setDanhSach] = useState([]);
    const [thongKe, setThongKe] = useState({ tong: 0, yeuThich: 0, muonDoc: 0, dangDoc: 0, daDoc: 0 });
    const [dangTai, setDangTai] = useState(true);
    const [tabHienTai, setTabHienTai] = useState("ALL");
    const [tuKhoa, setTuKhoa] = useState("");
    
    // Ghi chú modal
    const [suaGhiChuItem, setSuaGhiChuItem] = useState(null);
    const [ghiChuMoi, setGhiChuMoi] = useState("");

    const taiDuLieuTuSach = async (docGiaId) => {
        setDangTai(true);
        try {
            const [resDS, resTK] = await Promise.all([
                fetch(`${API_CONFIG.BASE_URL}/tuSach/docGia/${docGiaId}`).then(r => r.ok ? r.json() : []),
                fetch(`${API_CONFIG.BASE_URL}/tuSach/thongKe/${docGiaId}`).then(r => r.ok ? r.json() : { tong: 0 })
            ]);
            setDanhSach(Array.isArray(resDS) ? resDS : []);
            setThongKe(resTK);
        } catch (err) {
            console.error("Lỗi tải tủ sách:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        let u = null;
        try {
            u = JSON.parse(localStorage.getItem("user") || "null");
            setUser(u);
        } catch {}

        if (!u) {
            setDangTai(false);
            return;
        }

        const docGiaId = u.docGiaId || u.taiKhoanId || u.id;
        taiDuLieuTuSach(docGiaId);
    }, []);

    // Đổi trạng thái đọc sách
    const doiTrangThaiDoc = async (item, trangThaiMoi) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tuSach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docGiaId: user.docGiaId || user.taiKhoanId || user.id,
                    sachId: item.sachId,
                    trangThaiDoc: trangThaiMoi
                })
            });
            if (res.ok) {
                // Cập nhật state local
                setDanhSach(prev => prev.map(x => x.id === item.id ? { ...x, trangThaiDoc: trangThaiMoi } : x));
                // Cập nhật lại thống kê
                const docGiaId = user.docGiaId || user.taiKhoanId || user.id;
                fetch(`${API_CONFIG.BASE_URL}/tuSach/thongKe/${docGiaId}`)
                    .then(r => r.json())
                    .then(setThongKe)
                    .catch(() => {});
            }
        } catch (err) {
            alert("Lỗi khi đổi trạng thái: " + err.message);
        }
    };

    // Xóa sách khỏi tủ
    const xoaKhoiTu = async (item) => {
        if (!confirm(`Bạn có chắc muốn xóa cuốn "${item.tenSach}" khỏi tủ sách cá nhân?`)) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tuSach/${item.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setDanhSach(prev => prev.filter(x => x.id !== item.id));
                const docGiaId = user.docGiaId || user.taiKhoanId || user.id;
                fetch(`${API_CONFIG.BASE_URL}/tuSach/thongKe/${docGiaId}`)
                    .then(r => r.json())
                    .then(setThongKe)
                    .catch(() => {});
            }
        } catch (err) {
            alert("Lỗi khi xóa: " + err.message);
        }
    };

    // Lưu ghi chú cá nhân
    const luuGhiChu = async () => {
        if (!suaGhiChuItem) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tuSach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docGiaId: user.docGiaId || user.taiKhoanId || user.id,
                    sachId: suaGhiChuItem.sachId,
                    ghiChu: ghiChuMoi
                })
            });
            if (res.ok) {
                setDanhSach(prev => prev.map(x => x.id === suaGhiChuItem.id ? { ...x, ghiChu: ghiChuMoi } : x));
                setSuaGhiChuItem(null);
            }
        } catch (err) {
            alert("Lỗi lưu ghi chú: " + err.message);
        }
    };

    // Lọc danh sách theo Tab & Từ khóa
    const danhSachLoc = danhSach.filter(x => {
        const matchTab = tabHienTai === "ALL" || x.trangThaiDoc === tabHienTai;
        const matchSearch = !tuKhoa || 
            (x.tenSach && x.tenSach.toLowerCase().includes(tuKhoa.toLowerCase())) ||
            (x.tacGia && x.tacGia.toLowerCase().includes(tuKhoa.toLowerCase()));
        return matchTab && matchSearch;
    });

    if (!user && !dangTai) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-md">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                    ❤️
                </div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">Tủ Sách Yêu Thích Của Bạn</h1>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Vui lòng đăng nhập tài khoản độc giả để lưu các đầu sách yêu thích, theo dõi tiến độ đọc và ghi chú cảm nghĩ cá nhân.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
                >
                    <span>Đăng nhập ngay</span>
                    <FiArrowRight size={14} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-fadeIn">
            {/* Header Tiêu Đề & Lời Chào */}
            <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">📚</span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Tủ Sách Cá Nhân Của Bạn
                        </h1>
                    </div>
                    <p className="text-xs text-slate-600">
                        Độc giả: <span className="font-bold text-slate-800">{user?.hoTen || user?.tenDangNhap}</span> • Quản lý mục tiêu và tiến độ đọc sách mọi lúc mọi nơi
                    </p>
                </div>

                <Link
                    href="/sach"
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 shadow-xs transition"
                >
                    <FiPlus size={16} />
                    <span>Khám phá thêm sách</span>
                </Link>
            </div>

            {/* Thẻ Thống Kê Tiến Độ Đọc Sách */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                    onClick={() => setTabHienTai("ALL")}
                    className={`p-4 rounded-2xl border text-left transition ${
                        tabHienTai === "ALL" 
                            ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                >
                    <p className="text-[11px] font-bold opacity-75 uppercase">Tất cả trong tủ</p>
                    <p className="text-2xl font-black mt-1">{thongKe.tong || 0}</p>
                </button>

                <button
                    onClick={() => setTabHienTai("YEU_THICH")}
                    className={`p-4 rounded-2xl border text-left transition ${
                        tabHienTai === "YEU_THICH" 
                            ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20" 
                            : "bg-white border-slate-200 hover:border-rose-300 text-slate-700"
                    }`}
                >
                    <p className="text-[11px] font-bold opacity-75 uppercase flex items-center gap-1">
                        <span>❤️</span> Yêu thích
                    </p>
                    <p className="text-2xl font-black mt-1">{thongKe.yeuThich || 0}</p>
                </button>

                <button
                    onClick={() => setTabHienTai("DANG_DOC")}
                    className={`p-4 rounded-2xl border text-left transition ${
                        tabHienTai === "DANG_DOC" 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20" 
                            : "bg-white border-slate-200 hover:border-blue-300 text-slate-700"
                    }`}
                >
                    <p className="text-[11px] font-bold opacity-75 uppercase flex items-center gap-1">
                        <span>📖</span> Đang đọc dở
                    </p>
                    <p className="text-2xl font-black mt-1">{thongKe.dangDoc || 0}</p>
                </button>

                <button
                    onClick={() => setTabHienTai("MUON_DOC")}
                    className={`p-4 rounded-2xl border text-left transition ${
                        tabHienTai === "MUON_DOC" 
                            ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20" 
                            : "bg-white border-slate-200 hover:border-amber-300 text-slate-700"
                    }`}
                >
                    <p className="text-[11px] font-bold opacity-75 uppercase flex items-center gap-1">
                        <span>📌</span> Muốn đọc sau
                    </p>
                    <p className="text-2xl font-black mt-1">{thongKe.muonDoc || 0}</p>
                </button>

                <button
                    onClick={() => setTabHienTai("DA_DOC")}
                    className={`p-4 rounded-2xl border text-left transition col-span-2 sm:col-span-1 ${
                        tabHienTai === "DA_DOC" 
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                            : "bg-white border-slate-200 hover:border-emerald-300 text-slate-700"
                    }`}
                >
                    <p className="text-[11px] font-bold opacity-75 uppercase flex items-center gap-1">
                        <span>✅</span> Đã đọc xong
                    </p>
                    <p className="text-2xl font-black mt-1">{thongKe.daDoc || 0}</p>
                </button>
            </div>

            {/* Thanh Tìm Kiếm Trong Tủ Sách */}
            <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <input
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        placeholder="Tìm trong tủ sách theo tên sách, tác giả..."
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                    <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs font-semibold text-slate-500 pr-2">
                    Hiển thị {danhSachLoc.length} cuốn
                </span>
            </div>

            {/* Danh Sách Cuốn Sách */}
            {dangTai ? (
                <div className="py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3"></div>
                    <p className="text-xs text-slate-500 font-medium">Đang nạp tủ sách của bạn...</p>
                </div>
            ) : danhSachLoc.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
                    <div className="text-4xl mb-3">📖</div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">Tủ sách đang trống</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Bạn chưa thêm cuốn sách nào vào mục này. Hãy bấm vào biểu tượng trái tim ❤️ ở bất kỳ cuốn sách nào để lưu vào tủ cá nhân!
                    </p>
                    <Link
                        href="/sach"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                        <span>Khám phá kho sách thư viện</span>
                        <FiArrowRight size={14} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {danhSachLoc.map((item) => {
                        const st = TRANG_THAI_DOC[item.trangThaiDoc] || TRANG_THAI_DOC.YEU_THICH;
                        const anh = layDuongDanAnh(item.anhBia) || `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"><rect width="200" height="280" fill="#f1f5f9"/><text x="100" y="140" font-size="14" fill="#94a3b8" text-anchor="middle">📚</text></svg>`
                        )}`;

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 p-4 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex gap-4">
                                        {/* Ảnh bìa */}
                                        <Link href={`/sach/${item.sachId}`} className="shrink-0 w-24 h-32 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden block">
                                            <img
                                                src={anh}
                                                alt={item.tenSach}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </Link>

                                        {/* Thông tin */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/sach/${item.sachId}`}>
                                                <h3 className="font-bold text-sm text-slate-800 line-clamp-2 hover:text-emerald-700 transition leading-snug">
                                                    {item.tenSach}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-slate-500 mt-1 truncate">
                                                Tác giả: {item.tacGia || "Nhiều tác giả"}
                                            </p>

                                            {/* Bộ chọn trạng thái đọc sách */}
                                            <div className="mt-3">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                                    Trạng thái đọc:
                                                </label>
                                                <select
                                                    value={item.trangThaiDoc}
                                                    onChange={(e) => doiTrangThaiDoc(item, e.target.value)}
                                                    className={`w-full text-xs font-bold py-1.5 px-2 rounded-lg border outline-none cursor-pointer transition ${st.mau}`}
                                                >
                                                    <option value="YEU_THICH">❤️ Yêu thích</option>
                                                    <option value="DANG_DOC">📖 Đang đọc dở</option>
                                                    <option value="MUON_DOC">📌 Muốn đọc sau</option>
                                                    <option value="DA_DOC">✅ Đã đọc xong</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ghi chú cá nhân */}
                                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                                            <span className="font-bold uppercase flex items-center gap-1">
                                                <FiEdit3 size={11} /> Cảm nghĩ / Ghi chú
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSuaGhiChuItem(item);
                                                    setGhiChuMoi(item.ghiChu || "");
                                                }}
                                                className="text-emerald-700 font-semibold hover:underline"
                                            >
                                                {item.ghiChu ? "Sửa" : "+ Thêm"}
                                            </button>
                                        </div>
                                        <p className="text-slate-600 italic line-clamp-2">
                                            {item.ghiChu ? `"${item.ghiChu}"` : "Chưa có ghi chú nào..."}
                                        </p>
                                    </div>
                                </div>

                                {/* Hành động cuối card */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <Link
                                        href={`/sach/${item.sachId}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                    >
                                        <span>Chi tiết</span>
                                        <FiArrowRight size={13} />
                                    </Link>

                                    <button
                                        onClick={() => xoaKhoiTu(item)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                        title="Xóa khỏi tủ sách"
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Sửa Ghi Chú Cá Nhân */}
            {suaGhiChuItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-slate-900 text-base">
                                📝 Ghi Chú & Cảm Nghĩ
                            </h3>
                            <button
                                onClick={() => setSuaGhiChuItem(null)}
                                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                            Cuốn sách: <span className="font-bold text-slate-800">{suaGhiChuItem.tenSach}</span>
                        </p>

                        <textarea
                            value={ghiChuMoi}
                            onChange={(e) => setGhiChuMoi(e.target.value)}
                            placeholder="Nhập cảm nhận của bạn về cuốn sách, trang đang đọc dở hoặc bài học tâm đắc..."
                            rows={4}
                            className="w-full text-xs p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 leading-relaxed"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSuaGhiChuItem(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={luuGhiChu}
                                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20"
                            >
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

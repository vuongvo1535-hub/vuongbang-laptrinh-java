"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGioMuon from "@/hooks/useGioMuon";
import GioMuonService, { TOI_DA } from "@/services/shop/gioMuonServices";
import BookCover from "@/components/shop/sach/SachCover";
import API_CONFIG from "@/config/api";
import { FiTrash2, FiBook, FiCheckCircle, FiAlertCircle, FiArrowRight, FiUserCheck } from "react-icons/fi";

export default function GioMuonPage() {
    const router = useRouter();
    const { gio, soLuong } = useGioMuon();
    const [user, setUser] = useState(null);
    const [soNgayMuon, setSoNgayMuon] = useState(14);
    const [ghiChu, setGhiChu] = useState("");
    const [dangGui, setDangGui] = useState(false);
    const [ketQua, setKetQua] = useState(null);
    const [loi, setLoi] = useState("");

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) setUser(JSON.parse(raw));
        } catch {
            setUser(null);
        }
    }, []);

    const xuLyMuonSach = async () => {
        setLoi("");
        if (!user) {
            router.push("/login");
            return;
        }

        if (gio.length === 0) {
            setLoi("Giỏ mượn của bạn đang trống.");
            return;
        }

        setDangGui(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/phieuMuon/muon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docGiaId: user.docGiaId || user.taiKhoanId,
                    soNgayMuon: Number(soNgayMuon),
                    ghiChu: ghiChu.trim() || `Độc giả ${user.hoTen || user.tenDangNhap} gửi yêu cầu mượn trực tuyến`,
                    sachIds: gio.map((item) => item.id),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || data.error || "Gửi yêu cầu mượn sách thất bại.");
            }

            // Xóa sạch giỏ mượn sau khi thành công
            GioMuonService.xoaTatCa();
            setKetQua(data);
        } catch (err) {
            setLoi(err.message || "Không thể gửi yêu cầu mượn.");
        } finally {
            setDangGui(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[75vh]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Giỏ mượn sách</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Chọn sách và gửi yêu cầu mượn trực tuyến đến thư viện
                    </p>
                </div>
                <span className="text-sm font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    {soLuong}/{TOI_DA} cuốn
                </span>
            </div>

            {/* Thông báo kết quả mượn thành công */}
            {ketQua && (
                <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                        ✓
                    </div>
                    <h2 className="text-xl font-bold text-emerald-900">
                        Gửi yêu cầu mượn sách thành công!
                    </h2>
                    <p className="text-sm text-emerald-700 mt-1">
                        Mã phiếu mượn: <b className="font-mono text-base">{ketQua.maPhieu}</b>
                    </p>
                    <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto">
                        Thư viện đã tiếp nhận yêu cầu của bạn. Vui lòng đến quầy thư viện đọc mã phiếu hoặc xuất trình thẻ độc giả để nhận sách.
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                        <Link
                            href="/phieumuon"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition"
                        >
                            Xem phiếu mượn của tôi
                        </Link>
                        <Link
                            href="/sach"
                            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg border transition"
                        >
                            Tiếp tục tra cứu sách
                        </Link>
                    </div>
                </div>
            )}

            {/* Thông báo lỗi nếu có */}
            {loi && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-200">
                    <FiAlertCircle className="shrink-0 text-lg" />
                    <span>{loi}</span>
                </div>
            )}

            {/* Danh sách giỏ mượn */}
            {soLuong === 0 && !ketQua ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                    <div className="text-6xl mb-3">🧺</div>
                    <h3 className="text-lg font-bold text-gray-700">Giỏ mượn đang trống</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                        Bạn chưa chọn cuốn sách nào. Hãy duyệt qua danh mục sách để tìm những cuốn sách yêu thích!
                    </p>
                    <Link
                        href="/sach"
                        className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-sm text-sm"
                    >
                        <FiBook /> Tra cứu sách ngay
                    </Link>
                </div>
            ) : !ketQua && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột danh sách sách */}
                    <div className="lg:col-span-2 space-y-3">
                        {gio.map((x) => (
                            <div
                                key={x.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:border-emerald-300 transition"
                            >
                                {/* Ảnh bìa sách hiển thị thực tế */}
                                <div className="w-16 h-22 rounded-lg overflow-hidden bg-gray-50 border shrink-0">
                                    <BookCover
                                        anhBia={x.anh_bia}
                                        ten={x.ten_sach}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/sach/${x.id}`}
                                        className="font-bold text-gray-800 hover:text-emerald-700 line-clamp-1 text-base transition"
                                    >
                                        {x.ten_sach}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Tác giả: <span className="text-gray-700 font-medium">{x.tac_gia}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Danh mục: <span className="text-gray-700 font-medium">{x.ten_danh_muc}</span>
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-xs">
                                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                            Mã: {x.ma_sach}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                                            {x.vi_tri_ke || "Kệ A1"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => GioMuonService.xoa(x.id)}
                                    title="Xóa khỏi giỏ"
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-between items-center pt-2">
                            <button
                                onClick={() => GioMuonService.xoaTatCa()}
                                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition"
                            >
                                Xóa toàn bộ sách trong giỏ
                            </button>
                            <Link
                                href="/sach"
                                className="text-xs font-semibold text-emerald-600 hover:underline"
                            >
                                + Thêm sách khác vào giỏ
                            </Link>
                        </div>
                    </div>

                    {/* Cột thông tin mượn và gửi yêu cầu */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-fit space-y-4">
                        <h2 className="font-bold text-gray-800 text-base border-b pb-3">
                            Thông tin mượn sách
                        </h2>

                        {/* Thông tin người mượn */}
                        {user ? (
                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs space-y-1">
                                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                                    <FiUserCheck size={16} />
                                    <span>Độc giả mượn sách:</span>
                                </div>
                                <p className="text-gray-700 font-medium">{user.hoTen || user.tenDangNhap}</p>
                                <p className="text-gray-500">Mã thẻ/tài khoản: #{user.docGiaId || user.taiKhoanId}</p>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                                <p className="font-semibold text-amber-800">Bạn chưa đăng nhập</p>
                                <p className="text-amber-700 mt-1">Vui lòng đăng nhập để gửi yêu cầu mượn sách.</p>
                                <Link
                                    href="/login"
                                    className="inline-block mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        )}

                        {/* Thời hạn mượn */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Thời hạn mượn sách:
                            </label>
                            <select
                                value={soNgayMuon}
                                onChange={(e) => setSoNgayMuon(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            >
                                <option value={7}>7 ngày (1 tuần)</option>
                                <option value={14}>14 ngày (2 tuần - tiêu chuẩn)</option>
                                <option value={30}>30 ngày (1 tháng)</option>
                            </select>
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Ghi chú gửi thủ thư (nếu có):
                            </label>
                            <textarea
                                rows={2}
                                value={ghiChu}
                                onChange={(e) => setGhiChu(e.target.value)}
                                placeholder="Ghi chú thêm về thời gian nhận..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                        </div>

                        {/* Nút gửi mượn */}
                        <button
                            onClick={xuLyMuonSach}
                            disabled={dangGui || !user}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {dangGui ? "Đang gửi yêu cầu..." : `Xác nhận gửi mượn (${soLuong} cuốn)`}
                        </button>

                        <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                            * Theo quy định thư viện, bạn được mượn tối đa 5 cuốn mỗi lần. Hãy giữ gìn sách cẩn thận và trả đúng hạn nhé!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SachService from "@/services/shop/sachServices";
import GioMuonService from "@/services/shop/gioMuonServices";
import useGioMuon from "@/hooks/useGioMuon";
import SachCard from "@/components/shop/sach/SachCard";
import { dinhDangTien, layDuongDanAnh } from "@/utils/format";
import { FiBook, FiCheck, FiShoppingCart, FiMapPin, FiCalendar, FiGlobe, FiFileText, FiTag, FiStar, FiMessageSquare, FiSend, FiUser, FiBookmark, FiBookOpen, FiHeart } from "react-icons/fi";
import API_CONFIG from "@/config/api";
import BookReaderModal from "@/components/shop/sach/BookReaderModal";

const ANH_TRONG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <rect width="300" height="420" fill="#f8fafc"/>
        <rect x="30" y="40" width="240" height="340" rx="12" fill="#e2e8f0"/>
        <text x="150" y="215" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#64748b" text-anchor="middle">📚 Chưa có ảnh bìa</text>
    </svg>`
)}`;

export default function ChiTietSachPage() {
    const { id } = useParams();
    const router = useRouter();

    const [sach, setSach] = useState(null);
    const [lienQuan, setLienQuan] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");
    const [thongBao, setThongBao] = useState(null);
    const [chiSoAnh, setChiSoAnh] = useState(0);
    const [dangDatTruoc, setDangDatTruoc] = useState(false);
    const [daDatTruoc, setDaDatTruoc] = useState(false);
    const [trongTuSach, setTrongTuSach] = useState(false);
    const [hienDocThu, setHienDocThu] = useState(false);

    // Đặt trước sách
    const datTruocSach = async () => {
        let user = userHienTai;
        if (!user) {
            try {
                user = JSON.parse(localStorage.getItem("user") || "null");
            } catch {}
        }
        if (!user) {
            alert("Vui lòng đăng nhập tài khoản độc giả để đặt trước sách!");
            router.push("/login");
            return;
        }

        const tenCuonSach = sach?.ten_sach ?? sach?.tenSach ?? "cuốn sách này";
        if (!confirm(`Bạn có muốn đặt trước cuốn sách "${tenCuonSach}"? Khi có sách hoàn trả về thư viện, hệ thống sẽ ưu tiên giữ sách cho bạn.`)) return;

        setDangDatTruoc(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/datTruoc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sachId: Number(id),
                    docGiaId: user.docGiaId || user.taiKhoanId || user.id,
                    tenDocGia: user.hoTen || user.tenDangNhap || "Độc giả",
                    tenSach: tenCuonSach,
                    anhBia: sach?.anh_bia || sach?.anhBia || ""
                })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setDaDatTruoc(true);
                alert(`🎉 Đặt trước thành công! Cuốn sách "${tenCuonSach}" đã được ghi nhận vào hàng đợi của bạn. Bạn có thể theo dõi tại mục Phiếu mượn.`);
            } else {
                if (data.message && (data.message.includes("đã đặt trước") || data.message.includes("hàng đợi"))) {
                    setDaDatTruoc(true);
                }
                alert(data.message || "Không thể đặt trước cuốn sách này.");
            }
        } catch (err) {
            alert("Lỗi kết nối khi đặt trước: " + err.message);
        } finally {
            setDangDatTruoc(false);
        }
    };

    // Thêm / Bỏ sách trong Tủ sách cá nhân
    const toggleTuSach = async () => {
        let user = userHienTai;
        if (!user) {
            try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch {}
        }
        if (!user) {
            alert("Vui lòng đăng nhập tài khoản độc giả để lưu sách vào tủ cá nhân!");
            router.push("/login");
            return;
        }
        const docGiaId = user.docGiaId || user.taiKhoanId || user.id;
        const tenCuonSach = sach?.ten_sach ?? sach?.tenSach ?? "cuốn sách này";

        if (trongTuSach) {
            try {
                await fetch(`${API_CONFIG.BASE_URL}/tuSach/docGia/${docGiaId}/sach/${id}`, { method: "DELETE" });
                setTrongTuSach(false);
                alert(`Đã gỡ "${tenCuonSach}" khỏi Tủ sách cá nhân của bạn.`);
            } catch (err) {
                alert("Lỗi khi gỡ khỏi tủ: " + err.message);
            }
        } else {
            try {
                const res = await fetch(`${API_CONFIG.BASE_URL}/tuSach`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        docGiaId,
                        sachId: Number(id),
                        tenSach: tenCuonSach,
                        anhBia: sach?.anh_bia || sach?.anhBia || "",
                        trangThaiDoc: "YEU_THICH"
                    })
                });
                if (res.ok) {
                    setTrongTuSach(true);
                    alert(`❤️ Đã thêm "${tenCuonSach}" vào Tủ sách cá nhân thành công! Bạn có thể xem tại mục Tủ Sách.`);
                }
            } catch (err) {
                alert("Lỗi kết nối: " + err.message);
            }
        }
    };

    // Đánh giá & bình luận sao
    const [danhGiaData, setDanhGiaData] = useState({
        danhSach: [],
        diemTrungBinh: 5.0,
        tongDanhGia: 0,
        phanBo: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const [soSaoChon, setSoSaoChon] = useState(5);
    const [noiDungDanhGia, setNoiDungDanhGia] = useState("");
    const [dangGuiDanhGia, setDangGuiDanhGia] = useState(false);
    const [userHienTai, setUserHienTai] = useState(null);

    const taiDanhGia = async (sachId) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/danhGia/sach/${sachId}`);
            if (res.ok) {
                const data = await res.json();
                setDanhGiaData(data);
            }
        } catch (e) {
            console.error("Lỗi tải đánh giá:", e);
        }
    };

    const guiDanhGia = async (e) => {
        e.preventDefault();
        if (!noiDungDanhGia.trim()) {
            alert("Vui lòng nhập nội dung nhận xét của bạn");
            return;
        }
        setDangGuiDanhGia(true);
        try {
            const body = {
                sachId: Number(id),
                docGiaId: userHienTai?.docGiaId || userHienTai?.taiKhoanId || userHienTai?.id || 1,
                hoTen: userHienTai?.hoTen || userHienTai?.tenDangNhap || "Độc giả thư viện",
                soSao: soSaoChon,
                noiDung: noiDungDanhGia.trim()
            };
            const res = await fetch(`${API_CONFIG.BASE_URL}/danhGia`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setNoiDungDanhGia("");
                taiDanhGia(id);
                alert("Cảm ơn bạn đã gửi đánh giá và nhận xét cho cuốn sách!");
            } else {
                alert("Không thể gửi đánh giá. Vui lòng thử lại sau.");
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        } finally {
            setDangGuiDanhGia(false);
        }
    };

    const { gio } = useGioMuon();

    useEffect(() => {
        if (!id) return;
        let dangHoatDong = true;

        async function taiDuLieu() {
            try {
                const s = await SachService.getSachTheoId(id);
                if (!dangHoatDong) return;

                setSach(s);
                setChiSoAnh(0);

                if (s) {
                    const danhMucId = s.danh_muc_id ?? s.danhMucId;
                    if (danhMucId != null) {
                        const r = await SachService.getSach({ danhMucId });
                        if (!dangHoatDong) return;
                        const dsLienQuan = Array.isArray(r) ? r : (r?.data || []);
                        setLienQuan(
                            dsLienQuan
                                .filter((x) => String(x.id) !== String(s.id))
                                .slice(0, 4)
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi tải chi tiết sách:", error);
                if (dangHoatDong) setLoi("Không tải được thông tin sách. Vui lòng thử lại.");
            } finally {
                if (dangHoatDong) setDangTai(false);
            }
        }

        taiDuLieu();
        taiDanhGia(id);

        try {
            const rawUser = localStorage.getItem("user");
            if (rawUser) {
                const u = JSON.parse(rawUser);
                setUserHienTai(u);
                const docGiaId = u.docGiaId || u.taiKhoanId || u.id;
                if (docGiaId) {
                    fetch(`${API_CONFIG.BASE_URL}/datTruoc/docGia/${docGiaId}`)
                        .then(r => r.ok ? r.json() : [])
                        .then(ds => {
                            const tonTai = Array.isArray(ds) && ds.some(item => 
                                String(item.sachId) === String(id) && 
                                (item.trangThai === "CHO_CO_SACH" || item.trangThai === "DA_CO_SACH")
                            );
                            if (tonTai) setDaDatTruoc(true);
                        })
                        .catch(() => {});

                    fetch(`${API_CONFIG.BASE_URL}/tuSach/kiemTra?docGiaId=${docGiaId}&sachId=${id}`)
                        .then(r => r.ok ? r.json() : {})
                        .then(d => { if (d?.daCo) setTrongTuSach(true); })
                        .catch(() => {});
                }
            }
        } catch {}

        return () => {
            dangHoatDong = false;
        };
    }, [id]);

    const dsAnh = useMemo(() => {
        const anhBia = String(sach?.anh_bia ?? sach?.anhBia ?? "").trim();
        const maSach = String(sach?.ma_sach ?? sach?.maSach ?? "").trim();
        const ds = [];

        if (anhBia) {
            const duongDan = layDuongDanAnh(anhBia);
            if (duongDan) ds.push(duongDan);
        }

        if (maSach) {
            const duongDanMa = layDuongDanAnh(`${maSach}.jpg`);
            if (duongDanMa && !ds.includes(duongDanMa)) {
                ds.push(duongDanMa);
            }
        }

        ds.push(ANH_TRONG);
        return [...new Set(ds)];
    }, [sach]);

    if (dangTai) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3" />
                <p className="text-gray-500 text-sm">Đang tải thông tin chi tiết cuốn sách...</p>
            </div>
        );
    }

    if (loi || !sach) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-lg text-red-500 mb-4">{loi || "Không tìm thấy cuốn sách này!"}</p>
                <Link href="/sach" className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm">
                    ← Quay lại tra cứu sách
                </Link>
            </div>
        );
    }

    const duongDanAnh = dsAnh[Math.min(chiSoAnh, dsAnh.length - 1)] || ANH_TRONG;

    const tenSach = sach.tenSach || sach.ten_sach || "Sách thư viện";
    const maSach = sach.maSach || sach.ma_sach || (sach.id ? `DEMO00${sach.id}` : "-");
    const tacGia = Array.isArray(sach.tac_gia)
        ? sach.tac_gia.join(", ")
        : (sach.tacGia || sach.tac_gia || "Đang cập nhật");
    const tenDanhMuc = sach.tenDanhMuc || sach.ten_danh_muc || "Tổng hợp";
    const tenNhaXuatBan = sach.tenNhaXuatBan || sach.ten_nha_xuat_ban || "Nhà Xuất Bản Trẻ";
    const namXuatBan = sach.namXuatBan ?? sach.nam_xuat_ban ?? "2023";
    const ngonNgu = sach.ngonNgu || sach.ngon_ngu || "Tiếng Việt";
    const soTrang = sach.soTrang ?? sach.so_trang ?? 240;
    const giaTien = sach.giaTien ?? sach.gia_tien ?? 0;
    const viTriKe = sach.viTriKe || sach.vi_tri_ke || "Kệ A";
    const isbn = sach.isbn || "978-604-000000";
    const lanTaiBan = sach.lanTaiBan ?? sach.lan_tai_ban ?? 1;
    const moTa = sach.moTa || sach.mo_ta || "Tác phẩm giá trị được bảo quản và lưu hành phục vụ bạn đọc tại Thư viện.";

    const soBanSanSang = (sach.so_ban_san_sang !== undefined && Number(sach.so_ban_san_sang) > 0)
        ? Number(sach.so_ban_san_sang)
        : (sach.soBanSanSang !== undefined && Number(sach.soBanSanSang) > 0)
        ? Number(sach.soBanSanSang)
        : 4;
    const tongSoBan = (sach.tong_so_ban !== undefined && Number(sach.tong_so_ban) > 0)
        ? Number(sach.tong_so_ban)
        : (sach.tongSoBan !== undefined && Number(sach.tongSoBan) > 0)
        ? Number(sach.tongSoBan)
        : 5;
    const conSach = soBanSanSang > 0;

    const daTrongGio = (gio || []).some((x) => String(x.id) === String(sach.id));

    const themVaoGio = () => {
        setThongBao(GioMuonService.them({ ...sach, so_ban_san_sang: soBanSanSang }));
    };

    const dongThongTin = [
        { nhan: "Mã sách", giaTri: maSach, b: true, mau: "text-emerald-800 font-mono" },
        { nhan: "Tác giả", giaTri: tacGia, b: true },
        { nhan: "Thể loại", giaTri: tenDanhMuc },
        { nhan: "Số lượng trong kho", giaTri: `${tongSoBan} bản (${soBanSanSang} bản sẵn sàng)`, b: true, mau: conSach ? "text-emerald-700 font-bold" : "text-red-600 font-bold" },
        { nhan: "Tình trạng", giaTri: conSach ? "Còn sách sẵn sàng cho mượn" : "Tạm thời mượn hết", b: true, mau: conSach ? "text-green-700 font-semibold" : "text-red-600 font-semibold" },
        { nhan: "Nhà xuất bản", giaTri: tenNhaXuatBan },
        { nhan: "Năm xuất bản", giaTri: namXuatBan },
        { nhan: "Mã chuẩn ISBN", giaTri: isbn, mau: "font-mono text-gray-700" },
        { nhan: "Lần tái bản", giaTri: `Lần thứ ${lanTaiBan}` },
        { nhan: "Ngôn ngữ", giaTri: ngonNgu },
        { nhan: "Số trang", giaTri: `${soTrang} trang` },
        { nhan: "Giá trị sách", giaTri: dinhDangTien(giaTien), mau: "text-red-600 font-bold" },
        { nhan: "Vị trí lưu kho", giaTri: viTriKe, mau: "text-emerald-700 font-semibold" },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb */}
            <p className="text-xs text-gray-500 mb-6">
                <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
                {" / "}
                <Link href="/sach" className="hover:text-emerald-700">Tra cứu sách</Link>
                {" / "}
                <span className="text-gray-800 font-semibold truncate">{tenSach}</span>
            </p>

            {/* Chi tiết sách */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                {/* Cột Trái: Ảnh bìa */}
                <div className="md:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-xs aspect-[3/4] rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-3 shadow-md overflow-hidden relative">
                        <img
                            key={duongDanAnh}
                            src={duongDanAnh}
                            alt={tenSach}
                            className="w-full h-full object-contain rounded-xl"
                            onError={() => {
                                setChiSoAnh((i) => Math.min(i + 1, dsAnh.length - 1));
                            }}
                        />
                        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-white/90 font-mono font-bold text-gray-700 shadow-sm">
                            {maSach}
                        </span>
                    </div>

                    <div className="mt-4 w-full max-w-xs p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex justify-between items-center">
                        <span className="flex items-center gap-1 font-semibold">
                            <FiMapPin /> Vị trí: {viTriKe}
                        </span>
                        <span className="font-bold">
                            {conSach ? `Còn ${soBanSanSang}/${tongSoBan} cuốn sẵn sàng` : "Đã mượn hết"}
                        </span>
                    </div>

                    <button
                        onClick={() => setHienDocThu(true)}
                        className="mt-3 w-full max-w-xs py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center justify-center gap-2 shadow-xs"
                    >
                        <FiBookOpen size={16} />
                        <span>📖 Đọc thử trích đoạn sách</span>
                    </button>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                {tenDanhMuc}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                conSach ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {conSach ? "Sẵn sàng mượn" : "Tạm hết"}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                            {tenSach}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Tác giả: <span className="font-semibold text-emerald-900">{tacGia}</span>
                        </p>

                        {/* Điểm đánh giá sao */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <FiStar
                                        key={s}
                                        className={s <= Math.round(danhGiaData.diemTrungBinh) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                        size={16}
                                    />
                                ))}
                            </div>
                            <span className="font-bold text-sm text-gray-800">{danhGiaData.diemTrungBinh} / 5</span>
                            <span className="text-xs text-gray-400">({danhGiaData.tongDanhGia} nhận xét)</span>
                        </div>

                        {/* Bảng chi tiết thuộc tính sách */}
                        <div className="mt-6 border rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                            {dongThongTin.map((item, idx) => (
                                <div key={idx} className="flex px-4 py-2.5 bg-white hover:bg-gray-50 transition">
                                    <span className="w-1/3 text-gray-500 font-medium">{item.nhan}:</span>
                                    <span className={`w-2/3 ${item.mau || (item.b ? "font-bold text-gray-800" : "text-gray-700")}`}>
                                        {item.giaTri}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Mô tả sách */}
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-2">Giới thiệu tóm tắt nội dung:</h3>
                            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {moTa}
                            </p>
                        </div>
                    </div>

                    {/* Nút mượn sách */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={themVaoGio}
                                disabled={!conSach || daTrongGio}
                                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 ${
                                    daTrongGio
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : !conSach
                                        ? "bg-red-50 text-red-500 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                }`}
                            >
                                <FiShoppingCart size={18} />
                                {daTrongGio ? "Đã có trong giỏ mượn" : "Thêm vào giỏ mượn sách"}
                            </button>

                            {daDatTruoc ? (
                                <button
                                    disabled
                                    className="px-5 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-not-allowed shadow-xs"
                                    title="Bạn đã đặt trước cuốn sách này và đang trong hàng đợi nhận sách"
                                >
                                    <FiCheck size={18} className="text-emerald-600 stroke-[3]" />
                                    <span>✅ Đã đặt trước</span>
                                </button>
                            ) : (
                                <button
                                    onClick={datTruocSach}
                                    disabled={dangDatTruoc}
                                    className={`px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 ${
                                        !conSach
                                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                                            : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                                    }`}
                                    title="Đặt trước sách để giữ chỗ trong hàng đợi khi sách về"
                                >
                                    <FiBookmark size={18} />
                                    <span>{dangDatTruoc ? "Đang xử lý..." : !conSach ? "📌 Đặt trước sách (Hết bản sao)" : "📌 Đặt trước sách"}</span>
                                </button>
                            )}

                            <button
                                onClick={() => setHienDocThu(true)}
                                className="px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                                title="Đọc thử trích đoạn nội dung sách trực tuyến"
                            >
                                <FiBookOpen size={18} />
                                <span>📖 Đọc thử</span>
                            </button>

                            <button
                                onClick={toggleTuSach}
                                className={`px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition flex items-center gap-2 ${
                                    trongTuSach
                                        ? "bg-rose-50 text-rose-700 border border-rose-300"
                                        : "bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-300"
                                }`}
                                title={trongTuSach ? "Đã lưu trong tủ sách cá nhân (bấm để gỡ)" : "Thêm vào tủ sách cá nhân"}
                            >
                                <FiHeart size={18} className={trongTuSach ? "fill-rose-500 text-rose-500" : ""} />
                                <span>{trongTuSach ? "❤️ Đã lưu tủ sách" : "❤️ Lưu vào tủ sách"}</span>
                            </button>

                            <Link
                                href="/giomuon"
                                className="px-5 py-3 rounded-xl border border-gray-300 hover:border-emerald-600 text-gray-700 font-bold text-sm transition"
                            >
                                Mở giỏ mượn sách
                            </Link>
                        </div>

                        {thongBao && (
                            <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                                thongBao.ok ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                <span>{thongBao.thongBao}</span>
                                {thongBao.ok && (
                                    <Link href="/giomuon" className="underline font-bold text-emerald-900 ml-2">
                                        Đến giỏ mượn ngay →
                                    </Link>
                                )}
                            </div>
                        )}

                        {daDatTruoc && !thongBao && (
                            <div className="mt-3 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <FiCheck size={16} className="text-emerald-600" />
                                    Bạn đã đặt trước cuốn sách này và đang trong hàng đợi.
                                </span>
                                <Link href="/phieumuon" className="underline font-bold text-emerald-900 ml-2">
                                    Xem hàng đợi →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* KHU VỰC ĐÁNH GIÁ & NHẬN XÉT CỦA ĐỘC GIẢ (RATING & REVIEW) */}
            {/* ============================================================== */}
            <section className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FiMessageSquare className="text-emerald-600" />
                            <span>Đánh giá & Nhận xét từ Độc giả</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Chia sẻ cảm nhận về nội dung và chất lượng cuốn sách</p>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
                        <span className="text-3xl font-black text-amber-600">{danhGiaData.diemTrungBinh}</span>
                        <div>
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <FiStar key={s} className={s <= Math.round(danhGiaData.diemTrungBinh) ? "fill-amber-400 text-amber-400" : "text-gray-300"} size={14} />
                                ))}
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">{danhGiaData.tongDanhGia} lượt đánh giá</p>
                        </div>
                    </div>
                </div>

                {/* Form gửi đánh giá */}
                <form onSubmit={guiDanhGia} className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Gửi đánh giá của bạn:</h3>
                    
                    {/* Chọn số sao */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-medium">Chọn số sao:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => setSoSaoChon(s)}
                                    className="p-1 hover:scale-125 transition-transform"
                                >
                                    <FiStar size={22} className={s <= soSaoChon ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600 ml-1">
                            ({soSaoChon} sao - {soSaoChon === 5 ? "Tuyệt vời" : soSaoChon === 4 ? "Rất hay" : soSaoChon === 3 ? "Bình thường" : soSaoChon === 2 ? "Tạm được" : "Chưa hài lòng"})
                        </span>
                    </div>

                    {/* Nhập nội dung */}
                    <div>
                        <textarea
                            value={noiDungDanhGia}
                            onChange={(e) => setNoiDungDanhGia(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này để các độc giả khác cùng tham khảo..."
                            rows={3}
                            className="w-full p-3 text-xs text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Đăng với tên: <b className="text-emerald-700">{userHienTai?.hoTen || userHienTai?.tenDangNhap || "Độc giả yêu sách"}</b>
                        </span>
                        <button
                            type="submit"
                            disabled={dangGuiDanhGia}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <FiSend size={13} />
                            <span>{dangGuiDanhGia ? "Đang gửi..." : "Gửi nhận xét"}</span>
                        </button>
                    </div>
                </form>

                {/* Danh sách các bình luận */}
                <div className="mt-8 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700">Các nhận xét từ bạn đọc ({danhGiaData.danhSach?.length || 0}):</h3>
                    {danhGiaData.danhSach?.length === 0 ? (
                        <p className="text-xs text-gray-400 py-4 text-center">Chưa có nhận xét nào. Hãy là người đầu tiên để lại cảm nghĩ về cuốn sách này!</p>
                    ) : (
                        danhGiaData.danhSach.map((item) => (
                            <div key={item.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2 hover:bg-gray-50/50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                            {(item.hoTen || "DG").substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-gray-800">{item.hoTen || "Độc giả thư viện"}</p>
                                            <p className="text-[10px] text-gray-400">{item.ngayTao ? new Date(item.ngayTao).toLocaleDateString("vi-VN") : "Gần đây"}</p>
                                        </div>
                                    </div>

                                    <div className="flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <FiStar key={s} size={13} className={s <= (item.soSao || 5) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed pl-10.5">
                                    {item.noiDung}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Sách cùng thể loại liên quan */}
            {lienQuan.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <FiBook className="text-emerald-600" />
                        <span>Sách cùng thể loại {tenDanhMuc}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {lienQuan.map((x) => (
                            <SachCard key={x.id} sach={x} />
                        ))}
                    </div>
                </section>
            )}

            {/* Modal Đọc Thử Sách */}
            <BookReaderModal
                sachId={id}
                isOpen={hienDocThu}
                onClose={() => setHienDocThu(false)}
                onMuonSach={themVaoGio}
                daTrongGio={daTrongGio}
            />
        </div>
    );
}

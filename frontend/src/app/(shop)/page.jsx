"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";
import SachService from "@/services/shop/sachServices";
import SachCard from "@/components/shop/sach/SachCard";
import BarcodeScannerModal from "@/components/shop/BarcodeScannerModal";

const BUOC = [
    ["1", "Tra cứu", "Tìm sách theo tên, tác giả hoặc thể loại."],
    ["2", "Đặt trước", "Đặt trước khi sách đang được mượn hết."],
    ["3", "Đến thư viện", "Mang thẻ đến quầy để mượn và trả sách."],
];

export default function TrangChu() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [danhMuc, setDanhMuc] = useState([]);
    const [sachMoi, setSachMoi] = useState([]);
    const [tong, setTong] = useState(0);
    const [loi, setLoi] = useState("");
    const [moQuetMa, setMoQuetMa] = useState(false);
    const [maQuetBanDau, setMaQuetBanDau] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const [dm, ds] = await Promise.all([SachService.getDanhMuc(), SachService.getSach()]);
                setDanhMuc(Array.isArray(dm) ? dm : (dm?.data || []));

                const danhSachSach = Array.isArray(ds) ? ds : (ds?.data || []);
                setSachMoi(danhSachSach.slice(0, 8));
                setTong(danhSachSach.length);
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
        <>
            <section className="container mx-auto px-4 mt-6">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-10 md:p-16 text-center shadow-lg">
                    <h1 className="text-3xl md:text-5xl font-black">Khám phá kho sách của thư viện</h1>
                    <p className="mt-3 text-emerald-50">Tra cứu nhanh, biết ngay sách còn hay đã được mượn.</p>
                    <form onSubmit={timKiem} className="mt-6 max-w-xl mx-auto flex items-center bg-white rounded-xl shadow-md p-1.5 border border-emerald-300">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Nhập tên sách, tác giả hoặc mã thẻ..."
                            className="flex-1 px-4 py-2.5 text-gray-900 focus:outline-none text-sm md:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setMaQuetBanDau(q.trim());
                                setMoQuetMa(true);
                            }}
                            title="Quét mã vạch hoặc mã QR bằng Camera"
                            className="px-3.5 py-2.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
                        >
                            <FiCamera size={18} />
                            <span className="hidden sm:inline">Quét mã</span>
                        </button>
                        <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-5 py-2.5 rounded-lg transition text-sm md:text-base whitespace-nowrap ml-1">
                            Tìm sách
                        </button>
                    </form>
                    {tong > 0 && <p className="mt-4 text-sm text-emerald-100">Hiện có {tong} đầu sách đang lưu hành</p>}
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

            {loi && <p className="container mx-auto px-4 mt-6 text-red-600 font-medium">{loi}</p>}

            <section className="container mx-auto px-4 mt-10">
                <h2 className="text-2xl font-bold mb-4">Thể loại sách</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {danhMuc.map((d) => (
                        <Link
                            key={d.id}
                            href={`/sach?danh_muc=${d.id}`}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md p-5 text-center transition hover:-translate-y-1"
                        >
                            <div className="text-3xl">📚</div>
                            <div className="mt-2 font-bold text-gray-800">{d.tenDanhMuc || d.ten_danh_muc}</div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{d.moTa || d.mo_ta || "Sách chọn lọc"}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4 mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Sách mới nhập kho</h2>
                    <Link href="/sach" className="text-emerald-700 font-semibold hover:underline">
                        Xem tất cả →
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sachMoi.map((x) => (
                        <SachCard key={x.id} sach={x} />
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4 mt-12 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-center">Quy trình mượn sách</h2>
                <div className="grid md:grid-cols-3 gap-5">
                    {BUOC.map(([so, tieuDe, nd]) => (
                        <div key={so} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
                            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                                {so}
                            </div>
                            <h3 className="mt-3 font-bold text-gray-800">{tieuDe}</h3>
                            <p className="text-sm text-gray-500 mt-1">{nd}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

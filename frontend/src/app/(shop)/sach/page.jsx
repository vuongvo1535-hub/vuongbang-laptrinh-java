"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SachService from "@/services/shop/sachServices";
import SachCard from "@/components/shop/sach/SachCard";
import Pagination from "@/components/common/Pagination";
import { IMAGE_URL } from "@/config/api";

const SO_SACH_MOI_TRANG = 8;

function NoiDung() {
    const sp = useSearchParams();

    const [q, setQ] = useState(sp.get("q") || "");
    const [danhMucId, setDanhMucId] = useState(
        sp.get("danh_muc") || ""
    );
    const [sort, setSort] = useState("moi");
    const [trang, setTrang] = useState(1);

    const [ds, setDs] = useState([]);
    const [danhMuc, setDanhMuc] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loi, setLoi] = useState("");

    const gocAnh = `${IMAGE_URL.replace(/\/+$/, "")}/shop/images/sach`;

    // Tải danh mục sách.
    useEffect(() => {
        let huy = false;

        async function taiDanhMuc() {
            try {
                const data = await SachService.getDanhMuc();

                if (!huy) {
                    setDanhMuc(
                        Array.isArray(data)
                            ? data
                            : Array.isArray(data?.data)
                                ? data.data
                                : []
                    );
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);

                if (!huy) {
                    setDanhMuc([]);
                }
            }
        }

        taiDanhMuc();

        return () => {
            huy = true;
        };
    }, []);

    // Tải toàn bộ danh sách sách từ API.
    // Phân trang sẽ được xử lý ở frontend, không phân trang tại API.
    useEffect(() => {
        let huy = false;

        async function taiSach() {
            setDangTai(true);
            setLoi("");

            try {
                const ketQua = await SachService.getSach();

                if (huy) return;

                const danhSach = Array.isArray(ketQua)
                    ? ketQua
                    : Array.isArray(ketQua?.data)
                        ? ketQua.data
                        : Array.isArray(ketQua?.content)
                            ? ketQua.content
                            : [];

                setDs(
                    danhSach.map((sach) => {
                        const maSach = String(
                            sach.ma_sach ?? sach.maSach ?? ""
                        ).trim();

                        return {
                            ...sach,
                            duong_dan_anh: maSach
                                ? `${gocAnh}/${encodeURIComponent(maSach)}.jpg`
                                : `${gocAnh}/mac-dinh.jpg`,
                        };
                    })
                );
            } catch (error) {
                console.error("Lỗi tải sách:", error);

                if (!huy) {
                    setDs([]);
                    setLoi(
                        "Không tải được danh sách sách. Vui lòng kiểm tra API."
                    );
                }
            } finally {
                if (!huy) {
                    setDangTai(false);
                }
            }
        }

        taiSach();

        return () => {
            huy = true;
        };
    }, [gocAnh]);

    // Tìm kiếm, lọc theo danh mục và sắp xếp sách.
    const sachDaLoc = useMemo(() => {
        const boDau = (chuoi = "") =>
            String(chuoi)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D")
                .toLowerCase();

        const tuKhoa = boDau(q.trim());

        const ketQua = ds.filter((sach) => {
            const ten = sach.ten_sach ?? sach.tenSach ?? "";
            const ma = sach.ma_sach ?? sach.maSach ?? "";

            const tacGia = Array.isArray(sach.tac_gia)
                ? sach.tac_gia.join(" ")
                : Array.isArray(sach.tacGia)
                    ? sach.tacGia.join(" ")
                    : sach.tac_gia ?? sach.tacGia ?? "";

            const noiDungTimKiem = boDau(
                `${ten} ${ma} ${tacGia}`
            );

            const idDanhMuc =
                sach.danh_muc_id ??
                sach.danhMucId ??
                sach.danhMuc?.id ??
                sach.danh_muc?.id ??
                "";

            const dungTuKhoa =
                !tuKhoa || noiDungTimKiem.includes(tuKhoa);

            const dungDanhMuc =
                !danhMucId ||
                String(idDanhMuc) === String(danhMucId);

            return dungTuKhoa && dungDanhMuc;
        });

        if (sort === "ten") {
            ketQua.sort((a, b) =>
                (a.ten_sach ?? a.tenSach ?? "").localeCompare(
                    b.ten_sach ?? b.tenSach ?? "",
                    "vi"
                )
            );
        } else if (sort === "nam") {
            ketQua.sort(
                (a, b) =>
                    Number(b.nam_xuat_ban ?? b.namXuatBan ?? 0) -
                    Number(a.nam_xuat_ban ?? a.namXuatBan ?? 0)
            );
        } else {
            ketQua.sort(
                (a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)
            );
        }

        return ketQua;
    }, [ds, q, danhMucId, sort]);

    // Tính tổng số trang.
    const tongTrang = Math.max(
        1,
        Math.ceil(sachDaLoc.length / SO_SACH_MOI_TRANG)
    );

    // Nếu trang hiện tại vượt quá tổng số trang, quay về trang hợp lệ.
    useEffect(() => {
        if (trang > tongTrang) {
            setTrang(tongTrang);
        }
    }, [trang, tongTrang]);

    // Chỉ lấy 8 sách của trang đang xem.
    const sachHienThi = useMemo(() => {
        const batDau = (trang - 1) * SO_SACH_MOI_TRANG;

        return sachDaLoc.slice(
            batDau,
            batDau + SO_SACH_MOI_TRANG
        );
    }, [sachDaLoc, trang]);

    // Chuyển trang.
    function chuyenTrang(trangMoi) {
        if (
            trangMoi < 1 ||
            trangMoi > tongTrang ||
            trangMoi === trang
        ) {
            return;
        }

        setTrang(trangMoi);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Khi thay đổi tìm kiếm hoặc bộ lọc, trở về trang đầu.
    function doiBoLoc(setter, giaTri) {
        setter(giaTri);
        setTrang(1);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold text-nau-dam">
                Tra cứu sách
            </h1>

            {/* Tìm kiếm, lọc danh mục và sắp xếp */}
            <div className="mb-8 flex flex-wrap gap-3">
                <input
                    type="text"
                    value={q}
                    onChange={(e) => doiBoLoc(setQ, e.target.value)}
                    placeholder="🔍 Tên sách, tác giả, mã sách..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-cam-vang md:w-80"
                />

                <select
                    value={danhMucId}
                    onChange={(e) =>
                        doiBoLoc(setDanhMucId, e.target.value)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-cam-vang"
                >
                    <option value="">Tất cả thể loại</option>

                    {danhMuc.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.ten_danh_muc ??
                                d.tenDanhMuc ??
                                "Chưa có tên"}
                        </option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={(e) => doiBoLoc(setSort, e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-cam-vang"
                >
                    <option value="moi">Mới nhập</option>
                    <option value="ten">Tên A → Z</option>
                    <option value="nam">Năm xuất bản mới nhất</option>
                </select>
            </div>

            {/* Trạng thái tải dữ liệu */}
            {dangTai ? (
                <p className="py-20 text-center text-gray-500">
                    Đang tải danh sách sách...
                </p>
            ) : loi ? (
                <p className="py-20 text-center text-red-600">
                    {loi}
                </p>
            ) : sachDaLoc.length === 0 ? (
                <p className="py-20 text-center text-gray-500">
                    Không tìm thấy sách phù hợp.
                </p>
            ) : (
                <>
                    {/* Danh sách sách của trang hiện tại */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {sachHienThi.map((sach) => (
                            <SachCard
                                key={sach.id}
                                sach={sach}
                            />
                        ))}
                    </div>

                    {/* Thông tin số sách */}
                    <p className="mt-6 text-center text-sm text-nau-dam/70">
                        Hiển thị{" "}
                        {(trang - 1) * SO_SACH_MOI_TRANG + 1}
                        {" – "}
                        {Math.min(
                            trang * SO_SACH_MOI_TRANG,
                            sachDaLoc.length
                        )}
                        {" / "}
                        {sachDaLoc.length} sách
                    </p>

                    {/* Component phân trang có sẵn */}
                    {tongTrang > 1 && (
                        <Pagination
                            currentPage={trang}
                            pageCount={tongTrang}
                            onPageChange={chuyenTrang}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default function TraCuuSachPage() {
    return (
        <Suspense
            fallback={
                <p className="py-20 text-center text-gray-500">
                    Đang tải...
                </p>
            }
        >
            <NoiDung />
        </Suspense>
    );
}
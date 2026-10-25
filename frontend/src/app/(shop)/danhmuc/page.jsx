"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SachService from "@/services/shop/sachServices";
import { getDanhMucSachs } from "@/services/shop/danhMucSachServices";

export default function Page() {
    const [danhMucs, setDanhMucs] = useState([]);
    const [sachs, setSachs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function taiDuLieu() {
            try {
                const [dsDanhMuc, ketQuaSach] = await Promise.all([
                    getDanhMucSachs(),
                    SachService.getSach(),
                ]);

                if (ignore) return;

                // Nhận dữ liệu danh mục.
                setDanhMucs(
                    Array.isArray(dsDanhMuc)
                        ? dsDanhMuc
                        : Array.isArray(dsDanhMuc?.data)
                            ? dsDanhMuc.data
                            : []
                );

                // SachService.getSach() có thể trả về mảng trực tiếp
                // hoặc đối tượng có thuộc tính data.
                const danhSachSach = Array.isArray(ketQuaSach)
                    ? ketQuaSach
                    : Array.isArray(ketQuaSach?.data)
                        ? ketQuaSach.data
                        : Array.isArray(ketQuaSach?.content)
                            ? ketQuaSach.content
                            : [];

                setSachs(danhSachSach);

                console.log("Danh mục:", dsDanhMuc);
                console.log("Danh sách sách:", danhSachSach);
            } catch (err) {
                console.error("Lỗi tải danh mục và sách:", err);

                if (!ignore) {
                    setError("Không thể tải danh mục và sách. Vui lòng kiểm tra API.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        taiDuLieu();

        return () => {
            ignore = true;
        };
    }, []);

    // Đếm số sách thuộc từng danh mục.
    const soSachTheoDanhMuc = useMemo(() => {
        const dem = {};

        sachs.forEach((s) => {
            const idDanhMuc =
                s.danh_muc_id ??
                s.danhMucId ??
                s.danhMuc?.id ??
                s.danh_muc?.id ??
                s.danhMucSach?.id ??
                s.danhMucSach?.danhMuc?.id;

            if (idDanhMuc != null) {
                const id = String(idDanhMuc);
                dem[id] = (dem[id] || 0) + 1;
            }
        });

        return dem;
    }, [sachs]);

    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-nau-dam sm:text-4xl">
                    Danh mục sách
                </h1>

                <p className="mt-2 text-nau-dam/70">
                    Chọn một danh mục để xem các sách thuộc danh mục đó
                </p>
            </div>

            {loading ? (
                <p className="py-10 text-center text-nau-dam/50">
                    Đang tải danh mục...
                </p>
            ) : error ? (
                <p className="py-10 text-center text-red-600">
                    {error}
                </p>
            ) : danhMucs.length === 0 ? (
                <p className="py-10 text-center text-nau-dam/60">
                    Chưa có danh mục.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {danhMucs.map((dm) => {
                        const idDanhMuc = String(dm.id);

                        return (
                            <Link
                                key={dm.id}
                                href={`/sach?danh_muc=${encodeURIComponent(idDanhMuc)}`}
                                className="rounded-xl border border-cam-vang/30 bg-white p-5 transition hover:border-cam-vang hover:shadow-md"
                            >
                                <h2 className="text-lg font-bold text-nau-dam">
                                    {dm.tenDanhMuc ?? dm.ten_danh_muc ?? "Chưa có tên"}
                                </h2>

                                {(dm.moTa ?? dm.mo_ta) && (
                                    <p className="mt-1 text-sm text-nau-dam/70">
                                        {dm.moTa ?? dm.mo_ta}
                                    </p>
                                )}

                                <p className="mt-3 text-sm font-semibold text-cam-dam">
                                    {soSachTheoDanhMuc[idDanhMuc] || 0} sách →
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
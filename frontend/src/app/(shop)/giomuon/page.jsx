"use client";

import Link from "next/link";
import useGioMuon from "@/hooks/useGioMuon";
import GioMuonService, { TOI_DA } from "@/services/gioMuonServices";

export default function GioMuonPage() {
    const { gio, soLuong } = useGioMuon();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Giỏ mượn sách</h1>
                <span className="text-sm text-gray-500">{soLuong}/{TOI_DA} cuốn</span>
            </div>

            {soLuong === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                    <div className="text-5xl">🧺</div>
                    <p className="mt-3 text-gray-600">Giỏ mượn đang trống.</p>
                    <Link href="/sach" className="inline-block mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Tra cứu sách</Link>
                </div>
            ) : (
                <>
                    <ul className="space-y-3">
                        {gio.map((x) => (
                            <li key={x.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <Link href={`/sach/${x.id}`} className="font-bold hover:text-emerald-700 line-clamp-1">{x.ten_sach}</Link>
                                    <p className="text-sm text-gray-500">{x.tac_gia.join(", ")} · {x.ten_danh_muc}</p>
                                    <p className="text-sm text-gray-500">Mã {x.ma_sach} · Kệ {x.vi_tri_ke}</p>
                                </div>
                                <button onClick={() => GioMuonService.xoa(x.id)} className="text-red-600 font-semibold hover:underline">Xóa</button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <button onClick={() => GioMuonService.xoaTatCa()} className="text-gray-600 hover:underline">Xóa toàn bộ giỏ</button>
                        <button disabled title="Cần đăng nhập và kết nối Backend, sẽ làm sau"
                            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold opacity-50 cursor-not-allowed">
                            Gửi yêu cầu mượn ({soLuong} cuốn)
                        </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">Mỗi đầu sách mượn 1 bản. Sau khi gửi yêu cầu, hãy mang thẻ thư viện đến quầy để nhận sách.</p>
                </>
            )}
        </div>
    );
}

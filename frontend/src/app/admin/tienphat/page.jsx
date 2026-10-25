"use client";

import { useEffect, useState } from "react";
import { FiDollarSign, FiCheck, FiRefreshCw, FiExternalLink, FiX } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function TienPhatAdminPage() {
    const [dsPhat, setDsPhat] = useState([]);
    const [locTrangThai, setLocTrangThai] = useState("");
    const [dangTai, setDangTai] = useState(true);
    const [qrMoMo, setQrMoMo] = useState(null);
    const [dangMoQr, setDangMoQr] = useState(false);

    const taiDanhSach = async () => {
        setDangTai(true);
        try {
            const url = locTrangThai
                ? `${API_CONFIG.BASE_URL}/tienPhat?trangThai=${locTrangThai}`
                : `${API_CONFIG.BASE_URL}/tienPhat`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDsPhat(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Lỗi tải tiền phạt:", err);
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDanhSach();
    }, [locTrangThai]);

    const thuTienMat = async (id) => {
        if (!confirm("Xác nhận thu tiền mặt tại quầy cho khoản phạt này?")) return;
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/tienPhat/${id}/thanhToan?phuongThuc=TIEN_MAT`, {
                method: "POST",
            });
            if (res.ok) {
                alert("Đã ghi nhận thu tiền mặt thành công!");
                taiDanhSach();
            } else {
                alert("Thu tiền thất bại");
            }
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    const moMaMoMo = async (id) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${id}`);
            if (res.ok) {
                const data = await res.json();
                setQrMoMo(data);
                setDangMoQr(true);
            }
        } catch (err) {
            alert("Lỗi tạo mã QR: " + err.message);
        }
    };

    const xacNhanDaChuyenMoMo = async (id) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${id}/xacNhan`, {
                method: "POST",
            });
            if (res.ok) {
                alert("Đã xác nhận thanh toán MoMo thành công!");
                setDangMoQr(false);
                taiDanhSach();
            }
        } catch (err) {
            alert("Lỗi xác nhận: " + err.message);
        }
    };

    const dinhDangGia = (tien) => Number(tien || 0).toLocaleString("vi-VN") + " ₫";

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Tiền phạt thư viện</h1>
                    <p className="text-sm text-gray-500">Thu tiền phạt trễ hạn, hư hỏng và làm mất sách</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={locTrangThai}
                        onChange={(e) => setLocTrangThai(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
                        <option value="DA_THANH_TOAN">Đã thanh toán</option>
                    </select>

                    <button
                        onClick={taiDanhSach}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <FiRefreshCw size={16} /> Làm mới
                    </button>
                </div>
            </div>

            {dangTai ? (
                <div className="text-center py-12 text-gray-500">Đang tải danh sách tiền phạt...</div>
            ) : dsPhat.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    Không có khoản tiền phạt nào.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Mã CT Phiếu</th>
                                <th className="px-6 py-4">Lý do phạt</th>
                                <th className="px-6 py-4">Số tiền</th>
                                <th className="px-6 py-4">Ngày lập</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dsPhat.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-semibold text-gray-800">#{row.id}</td>
                                    <td className="px-6 py-4">Chi tiết mượn #{row.chiTietPhieuMuonId}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700">
                                            {row.lyDo === "QUA_HAN" ? "Trả trễ hạn" :
                                             row.lyDo === "HU_HONG" ? "Làm hư hại sách" :
                                             row.lyDo === "LAM_MAT" ? "Làm mất sách" : row.lyDo}
                                        </span>
                                        {row.ghiChu && <p className="text-xs text-gray-400">{row.ghiChu}</p>}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-red-600">
                                        {dinhDangGia(row.soTien)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {row.ngayLap ? new Date(row.ngayLap).toLocaleDateString("vi-VN") : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.trangThai === "DA_THANH_TOAN" ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                <FiCheck size={12} /> Đã thanh toán
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                Chưa thanh toán
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.trangThai === "CHUA_THANH_TOAN" ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => thuTienMat(row.id)}
                                                    className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                                >
                                                    Thu tiền mặt
                                                </button>
                                                <button
                                                    onClick={() => moMaMoMo(row.id)}
                                                    className="rounded bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700 transition"
                                                >
                                                    QR MoMo
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Hoàn thành</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Quét Mã MoMo */}
            {dangMoQr && qrMoMo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl relative text-center">
                        <button
                            onClick={() => setDangMoQr(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                            <FiDollarSign size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800">Quét mã QR MoMo</h3>
                        <p className="text-xs text-gray-500 mt-1">Độc giả mở app MoMo hoặc Ngân hàng để quét</p>

                        <div className="my-4 p-2 bg-gray-50 rounded-xl inline-block border">
                            <img
                                src={qrMoMo.qrUrl}
                                alt="Mã QR Thanh Toán"
                                className="w-56 h-56 mx-auto object-contain"
                            />
                        </div>

                        <div className="text-left bg-gray-50 p-3 rounded-lg text-xs space-y-1 text-gray-600 mb-4">
                            <p>Số tiền: <b className="text-red-600 text-sm">{dinhDangGia(qrMoMo.soTien)}</b></p>
                            <p>Người nhận: <b>{qrMoMo.tenNguoiNhan}</b></p>
                            <p>Nội dung: <b className="text-emerald-700">{qrMoMo.noiDung}</b></p>
                        </div>

                        <button
                            onClick={() => xacNhanDaChuyenMoMo(qrMoMo.tienPhatId)}
                            className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                        >
                            Xác nhận đã nhận được tiền
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiDollarSign, FiCheck, FiRefreshCw, FiExternalLink, FiX, FiMail, FiEdit2 } from "react-icons/fi";
import API_CONFIG from "@/config/api";

export default function TienPhatAdminPage() {
    const [dsPhat, setDsPhat] = useState([]);
    const [locTrangThai, setLocTrangThai] = useState("");
    const [dangTai, setDangTai] = useState(true);
    const [qrMoMo, setQrMoMo] = useState(null);
    const [dangMoQr, setDangMoQr] = useState(false);
    const [maGiaoDichGia, setMaGiaoDichGia] = useState("");
    const [emailNhanThongBao, setEmailNhanThongBao] = useState("");
    const [dangXacNhan, setDangXacNhan] = useState(false);

    // Modal chỉnh sửa số tiền phạt
    const [khoanPhatDangSua, setKhoanPhatDangSua] = useState(null);
    const [soTienMoi, setSoTienMoi] = useState("");
    const [ghiChuSua, setGhiChuSua] = useState("");
    const [dangLuuSua, setDangLuuSua] = useState(false);

    const sinhMaGia = () => "MOMO_ADMIN_" + Math.floor(100000000 + Math.random() * 900000000);

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

    const batDauSua = (row) => {
        setKhoanPhatDangSua(row);
        setSoTienMoi(row.soTien || 0);
        setGhiChuSua(row.ghiChu || "");
    };

    const luuSoTienMoi = async (e) => {
        e.preventDefault();
        if (!khoanPhatDangSua) return;
        const tien = Number(soTienMoi);
        if (isNaN(tien) || tien < 0) {
            alert("Vui lòng nhập số tiền phạt hợp lệ (>= 0)");
            return;
        }
        setDangLuuSua(true);
        try {
            const res = await fetch(
                `${API_CONFIG.BASE_URL}/tienPhat/${khoanPhatDangSua.id}/soTien?soTien=${tien}&ghiChu=${encodeURIComponent(ghiChuSua)}`,
                { method: "PUT" }
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Không thể cập nhật số tiền");
            }
            alert(`Đã cập nhật số tiền phạt thành ${tien.toLocaleString("vi-VN")} ₫ thành công!`);
            setKhoanPhatDangSua(null);
            taiDanhSach();
        } catch (err) {
            alert("Lỗi: " + err.message);
        } finally {
            setDangLuuSua(false);
        }
    };

    const moMaMoMo = async (id = 0) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${id}`);
            if (res.ok) {
                const data = await res.json();
                setQrMoMo(data);
            } else {
                setQrMoMo({
                    tienPhatId: id || 0,
                    soTien: 25000,
                    noiDung: "NOP_PHAT_DEMO",
                    qrUrl: "https://img.vietqr.io/image/MB-0987654321-compact2.jpg?amount=25000&addInfo=NOP_PHAT_DEMO&accountName=THU%20VIEN%20SO",
                    soDienThoaiMoMo: "0987654321",
                    tenNguoiNhan: "THU VIEN SO",
                });
            }
        } catch {
            setQrMoMo({
                tienPhatId: id || 0,
                soTien: 25000,
                noiDung: "NOP_PHAT_DEMO",
                qrUrl: "https://img.vietqr.io/image/MB-0987654321-compact2.jpg?amount=25000&addInfo=NOP_PHAT_DEMO&accountName=THU%20VIEN%20SO",
                soDienThoaiMoMo: "0987654321",
                tenNguoiNhan: "THU VIEN SO",
            });
        }
        setMaGiaoDichGia(sinhMaGia());
        setEmailNhanThongBao("");
        setDangMoQr(true);
    };

    const xacNhanDaChuyenMoMo = async (id) => {
        setDangXacNhan(true);
        try {
            const emailParam = encodeURIComponent(emailNhanThongBao || "");
            const targetId = (id && id !== 0 && String(id) !== "0") ? id : 0;
            const res = await fetch(`${API_CONFIG.BASE_URL}/payment/momo/${targetId}/xacNhan?maGiaoDich=${encodeURIComponent(maGiaoDichGia)}&emailNhan=${emailParam}`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                let msg = `Đã xác nhận thanh toán MoMo thành công! (Mã GD: ${data.maGiaoDich || maGiaoDichGia})`;
                if (data.emailSent) {
                    msg += `\nĐã gửi email biên lai tới: ${data.emailNhan}`;
                } else if (data.emailStatus) {
                    msg += `\nTrạng thái email: ${data.emailStatus}`;
                }
                alert(msg);
                setDangMoQr(false);
                taiDanhSach();
            } else {
                alert("Lỗi xác nhận: " + (data.message || "Không thể xác nhận"));
            }
        } catch (err) {
            alert("Lỗi xác nhận: " + err.message);
        } finally {
            setDangXacNhan(false);
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

                    <Link
                        href="/thanhtoan/momo"
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#a50064] to-[#d82d8b] px-3.5 py-2 text-sm font-semibold text-white hover:from-[#8d0055] shadow-sm transition"
                    >
                        <span>📱</span> Cổng MoMo (Tab mới)
                    </Link>

                    <button
                        onClick={() => moMaMoMo(0)}
                        className="flex items-center gap-2 rounded-lg bg-pink-50 text-[#a50064] border border-pink-200 px-3.5 py-2 text-sm font-semibold hover:bg-pink-100 shadow-sm transition"
                    >
                        <span>⚡</span> Mở QR Popup
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
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-red-600">{dinhDangGia(row.soTien)}</span>
                                            {row.trangThai === "CHUA_THANH_TOAN" && (
                                                <button
                                                    type="button"
                                                    onClick={() => batDauSua(row)}
                                                    title="Chỉnh sửa số tiền phạt"
                                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition font-medium"
                                                >
                                                    <FiEdit2 size={11} />
                                                    <span>Sửa</span>
                                                </button>
                                            )}
                                        </div>
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
                                            <div className="flex justify-center items-center gap-2">
                                                <span className="text-xs text-gray-400">Hoàn thành</span>
                                                <button
                                                    onClick={() => moMaMoMo(row.id)}
                                                    className="rounded bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 px-2 py-1 text-[11px] font-semibold transition"
                                                >
                                                    QR & Test lại
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Quét Mã MoMo & Giả Lập Gửi Gmail */}
            {dangMoQr && qrMoMo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative text-center my-6">
                        <button
                            onClick={() => setDangMoQr(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                            <FiDollarSign size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800">Quét mã QR MoMo</h3>
                        <p className="text-xs text-gray-500 mt-1">Độc giả quét mã hoặc thủ thư giả lập thanh toán</p>

                        <div className="my-3 p-2 bg-gray-50 rounded-xl inline-block border">
                            <img
                                src={qrMoMo.qrUrl}
                                alt="Mã QR Thanh Toán"
                                className="w-48 h-48 mx-auto object-contain"
                            />
                        </div>

                        <div className="text-left bg-gray-50 p-3 rounded-lg text-xs space-y-1 text-gray-600 mb-3 border">
                            <p>Số tiền: <b className="text-red-600 text-sm">{dinhDangGia(qrMoMo.soTien)}</b></p>
                            <p>Người nhận: <b>{qrMoMo.tenNguoiNhan}</b></p>
                            <p>Nội dung: <b className="text-emerald-700">{qrMoMo.noiDung}</b></p>
                        </div>

                        {/* Khung Giả lập MoMo & Gửi Gmail */}
                        <div className="text-left bg-pink-50/70 p-3 rounded-xl border border-pink-200 mb-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-pink-900 flex items-center gap-1">
                                    <span>🧪</span> Giả lập MoMo & Gửi Gmail
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMaGiaoDichGia(sinhMaGia())}
                                    className="text-[11px] text-pink-700 hover:text-pink-900 flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-pink-200"
                                >
                                    <FiRefreshCw size={10} /> Đổi mã giả
                                </button>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                    Mã giao dịch MoMo giả lập:
                                </label>
                                <input
                                    type="text"
                                    value={maGiaoDichGia}
                                    onChange={(e) => setMaGiaoDichGia(e.target.value)}
                                    className="w-full px-3 py-1.5 text-xs font-mono font-bold text-pink-700 bg-white rounded border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                    <FiMail size={12} className="text-pink-600" />
                                    <span>Gmail nhận thông báo biên lai:</span>
                                </label>
                                <input
                                    type="email"
                                    value={emailNhanThongBao}
                                    onChange={(e) => setEmailNhanThongBao(e.target.value)}
                                    placeholder="Để trống sẽ gửi theo email hồ sơ độc giả"
                                    className="w-full px-3 py-1.5 text-xs text-gray-800 bg-white rounded border border-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => xacNhanDaChuyenMoMo(qrMoMo.tienPhatId)}
                                disabled={dangXacNhan}
                                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-pink-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FiMail size={14} />
                                {dangXacNhan ? "Đang xử lý & gửi Gmail..." : "⚡ Giả lập quét MoMo & Gửi Gmail"}
                            </button>

                            <button
                                onClick={() => xacNhanDaChuyenMoMo(qrMoMo.tienPhatId)}
                                disabled={dangXacNhan}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition"
                            >
                                Xác nhận đã thu tiền tại quầy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chỉnh Sửa Số Tiền Phạt */}
            {khoanPhatDangSua && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b">
                            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <FiEdit2 className="text-orange-600" />
                                <span>Chỉnh sửa số tiền phạt #{khoanPhatDangSua.id}</span>
                            </h3>
                            <button
                                onClick={() => setKhoanPhatDangSua(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <form onSubmit={luuSoTienMoi} className="space-y-4 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 block">Lý do phạt:</span>
                                <span className="font-semibold text-gray-800">
                                    {khoanPhatDangSua.lyDo === "QUA_HAN" ? "Trả trễ hạn" :
                                     khoanPhatDangSua.lyDo === "HU_HONG" ? "Làm hư hại sách" :
                                     khoanPhatDangSua.lyDo === "LAM_MAT" ? "Làm mất sách" : khoanPhatDangSua.lyDo}
                                </span>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-1">
                                    Số tiền phạt mới (VNĐ) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="5000"
                                        value={soTienMoi}
                                        onChange={(e) => setSoTienMoi(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-orange-300 p-2.5 font-bold text-red-600 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">VNĐ</span>
                                </div>
                                {/* Nút chọn nhanh */}
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    <span className="text-[11px] text-gray-500 self-center">Chọn nhanh:</span>
                                    {[10000, 20000, 30000, 50000, 70000, 100000, 150000].map((muc) => (
                                        <button
                                            key={muc}
                                            type="button"
                                            onClick={() => setSoTienMoi(muc)}
                                            className="text-[11px] px-2 py-0.5 rounded border border-gray-300 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition"
                                        >
                                            {muc.toLocaleString("vi-VN")}đ
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Ghi chú điều chỉnh</label>
                                <input
                                    type="text"
                                    value={ghiChuSua}
                                    onChange={(e) => setGhiChuSua(e.target.value)}
                                    placeholder="Lý do điều chỉnh số tiền..."
                                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setKhoanPhatDangSua(null)}
                                    className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={dangLuuSua}
                                    className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 transition"
                                >
                                    {dangLuuSua ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

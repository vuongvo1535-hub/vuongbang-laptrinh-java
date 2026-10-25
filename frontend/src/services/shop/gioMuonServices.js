const KHOA = "gio_muon";
const SU_KIEN = "gio-muon-doi";
export const TOI_DA = 5; // khớp quy định: mỗi lần mượn tối đa 5 cuốn

function doc() {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KHOA)) || []; } catch { return []; }
}

function luu(ds) {
    localStorage.setItem(KHOA, JSON.stringify(ds));
    window.dispatchEvent(new Event(SU_KIEN));
    return ds;
}

const GioMuonService = {
    SU_KIEN,
    layGio: doc,
    coTrongGio: (id) => doc().some((x) => x.id === id),

    // Trả về { ok, thongBao } để giao diện hiển thị
    them(sach) {
        const ds = doc();
        if (ds.some((x) => x.id === sach.id)) return { ok: false, thongBao: "Sách đã có trong giỏ mượn." };
        if (sach.so_ban_san_sang <= 0) return { ok: false, thongBao: "Sách đã được mượn hết, hãy đặt trước." };
        if (ds.length >= TOI_DA) return { ok: false, thongBao: `Giỏ mượn chỉ chứa tối đa ${TOI_DA} cuốn.` };
        luu([...ds, {
            id: sach.id, ma_sach: sach.ma_sach, ten_sach: sach.ten_sach, tac_gia: sach.tac_gia,
            ten_danh_muc: sach.ten_danh_muc, vi_tri_ke: sach.vi_tri_ke, so_ban_san_sang: sach.so_ban_san_sang,
        }]);
        return { ok: true, thongBao: "Đã thêm vào giỏ mượn." };
    },

    xoa: (id) => luu(doc().filter((x) => x.id !== id)),
    xoaTatCa: () => luu([]),
};

export default GioMuonService;

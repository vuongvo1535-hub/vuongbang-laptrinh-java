const KHOA = "gio_muon";
const SU_KIEN = "gio-muon-doi";
export const TOI_DA = 5; // Khớp quy định: mỗi lần mượn tối đa 5 cuốn

function doc() {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(KHOA)) || [];
    } catch {
        return [];
    }
}

function luu(ds) {
    if (typeof window !== "undefined") {
        localStorage.setItem(KHOA, JSON.stringify(ds));
        window.dispatchEvent(new Event(SU_KIEN));
    }
    return ds;
}

const GioMuonService = {
    SU_KIEN,
    layGio: doc,
    coTrongGio: (id) => doc().some((x) => x.id === id),

    // Trả về { ok, thongBao } để giao diện hiển thị
    them(sach) {
        const ds = doc();
        if (ds.some((x) => x.id === sach.id)) {
            return { ok: false, thongBao: "Sách này đã có trong giỏ mượn." };
        }
        if (sach.so_ban_san_sang !== undefined && sach.so_ban_san_sang <= 0) {
            return { ok: false, thongBao: "Sách tạm thời đã được mượn hết." };
        }
        if (ds.length >= TOI_DA) {
            return { ok: false, thongBao: `Giỏ mượn chỉ được chứa tối đa ${TOI_DA} cuốn mỗi lần mượn.` };
        }

        const tacGiaStr = Array.isArray(sach.tac_gia)
            ? sach.tac_gia.join(", ")
            : (sach.tac_gia || sach.tacGia || "Đang cập nhật");

        const sachMoi = {
            id: sach.id,
            ma_sach: sach.ma_sach || sach.maSach || `MS${sach.id}`,
            ten_sach: sach.ten_sach || sach.tenSach || "Sách chưa đặt tên",
            anh_bia: sach.anh_bia || sach.anhBia || null,
            tac_gia: tacGiaStr,
            ten_danh_muc: sach.ten_danh_muc || sach.tenDanhMuc || "Tổng hợp",
            vi_tri_ke: sach.vi_tri_ke || sach.viTriKe || "Kệ A",
            so_ban_san_sang: sach.so_ban_san_sang ?? 1,
        };

        luu([...ds, sachMoi]);
        return { ok: true, thongBao: "Đã thêm sách vào giỏ mượn!" };
    },

    xoa: (id) => luu(doc().filter((x) => x.id !== id)),
    xoaTatCa: () => luu([]),
};

export default GioMuonService;

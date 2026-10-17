// Ham dung chung cho trang Them (create) va trang Sua ([id]) san pham

// Du lieu mac dinh cua form
export const FORM_MOI = {
    ten_san_pham: "",
    duong_dan: "",
    danh_muc_id: "",
    thuong_hieu_id: "",
    gia: "",
    gia_khuyen_mai: "",
    mo_ta_ngan: "",
    mo_ta_chi_tiet: "",
    hinh_anh_dai_dien: "",
    so_luong_ton: 0,
    luot_xem: 0,
    noi_bat: 0,
    trang_thai: 1,
};

// Doi san pham tu API thanh du lieu cho form (dung o trang Sua)
export function sanPhamSangForm(item) {
    return {
        ten_san_pham: item.ten_san_pham || "",
        duong_dan: item.duong_dan || "",
        danh_muc_id: item.danh_muc_id ?? "",
        thuong_hieu_id: item.thuong_hieu_id ?? "",
        gia: item.gia ?? "",
        gia_khuyen_mai: item.gia_khuyen_mai ?? "",
        mo_ta_ngan: item.mo_ta_ngan || "",
        mo_ta_chi_tiet: item.mo_ta_chi_tiet || "",
        hinh_anh_dai_dien: item.hinh_anh_dai_dien || "",
        so_luong_ton: item.so_luong_ton ?? 0,
        luot_xem: item.luot_xem ?? 0,
        noi_bat: item.noi_bat ? 1 : 0,
        trang_thai: item.trang_thai ? 1 : 0,
    };
}

// Chuan hoa du lieu form truoc khi gui API (doi chuoi thanh so)
export function chuanHoaSanPham(sanPham) {
    return {
        ...sanPham,
        danh_muc_id: Number(sanPham.danh_muc_id),
        thuong_hieu_id: Number(sanPham.thuong_hieu_id),
        gia: Number(sanPham.gia),
        gia_khuyen_mai: sanPham.gia_khuyen_mai
            ? Number(sanPham.gia_khuyen_mai)
            : null,
        so_luong_ton: Number(sanPham.so_luong_ton),
        luot_xem: Number(sanPham.luot_xem),
        noi_bat: Number(sanPham.noi_bat),
        trang_thai: Number(sanPham.trang_thai),
    };
}
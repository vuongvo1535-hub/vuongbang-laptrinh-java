// =====================================================
// FILE: format.js
// CHUC NANG: Chua cac ham dinh dang du lieu dung chung.
// =====================================================

// -----------------------------------------------------
// DINH DANG TIEN TE VIET NAM
// Vi du: 150000 -> 150.000 ₫
// -----------------------------------------------------
export function dinhDangTien(tien) {
    return Number(tien || 0).toLocaleString("vi-VN") + " ₫";
}

// -----------------------------------------------------
// DUONG DAN ANH BIA SACH
// Tra ve duong dan hop le de hien thi anh, hoac duong dan mac dinh
// -----------------------------------------------------
export function layDuongDanAnh(anhBia) {
    if (!anhBia) return null;
    const str = String(anhBia).trim();
    if (!str) return null;

    // Neu la link ngoai hoac base64
    if (/^(https?:|data:|\/\/)/i.test(str)) {
        return str;
    }

    // Neu bat dau bang /shop hoac /images hoac /uploads
    if (str.startsWith("/")) {
        return str;
    }

    // Neu co cau hinh NEXT_PUBLIC_IMAGE_URL
    const goc = process.env.NEXT_PUBLIC_IMAGE_URL;
    if (goc && /^https?:\/\//i.test(goc)) {
        const cleanGoc = goc.replace(/\/+$/, "");
        return `${cleanGoc}/${str.replace(/^\/+/, "")}`;
    }

    // Mac dinh thu muc sach trong frontend/public
    return `/shop/images/sach/${str.replace(/^\/+/, "")}`;
}

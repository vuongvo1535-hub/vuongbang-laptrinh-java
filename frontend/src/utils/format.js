
// =====================================================
// FILE: format.js
// CHUC NANG: Chua cac ham dinh dang du lieu dung chung.
// =====================================================

// -----------------------------------------------------
// DINH DANG TIEN TE VIET NAM
// Vi du: 1500000 -> 1.500.000 ₫
// -----------------------------------------------------
export function dinhDangTien(tien) {
    return Number(tien || 0).toLocaleString("vi-VN") + " ₫";
}

// -----------------------------------------------------
// DUONG DAN ANH BIA SACH
// Cot anh_bia co the rong hoac la ten file; ghep voi NEXT_PUBLIC_IMAGE_URL.
// Tra ve null neu khong co anh de giao dien hien khung mac dinh.
// -----------------------------------------------------
export function layDuongDanAnh(anhBia) {
    if (!anhBia) return null;
    if (/^https?:\/\//i.test(anhBia)) return anhBia;
    const goc = process.env.NEXT_PUBLIC_IMAGE_URL;
    return goc ? goc + anhBia : null;
}

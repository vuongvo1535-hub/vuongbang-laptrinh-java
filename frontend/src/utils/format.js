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
// Tra ve duong dan hop le de lay anh truc tiep tu backend
// -----------------------------------------------------
export function layDuongDanAnh(anhBia) {
    if (!anhBia) return null;
    const str = String(anhBia).trim();
    if (!str) return null;

    // Neu la link ngoai (http://, https://) hoac base64
    if (/^(https?:|data:|\/\/)/i.test(str)) {
        return str;
    }

    // Backend host goc (lay tu NEXT_PUBLIC_IMAGE_URL hoac mac dinh http://localhost:8080)
    const envUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    const gocBackend = (envUrl && /^https?:\/\//i.test(envUrl))
        ? envUrl.replace(/\/+$/, "")
        : "http://localhost:8080";

    const cleanStr = str.replace(/^\/+/, "");

    // Neu duong dan da co prefix shop/ hoac uploads/ hoac public/
    if (cleanStr.startsWith("shop/") || cleanStr.startsWith("uploads/") || cleanStr.startsWith("public/")) {
        return `${gocBackend}/${cleanStr}`;
    }

    // Neu bat dau bang images/
    if (cleanStr.startsWith("images/")) {
        return `${gocBackend}/shop/${cleanStr}`;
    }

    // Truong hop chi la ten file (vi du: DEMO001.jpg hoac ma sach DEMO001)
    const tenFile = cleanStr.includes(".") ? cleanStr : `${cleanStr}.jpg`;
    return `${gocBackend}/shop/images/sach/${tenFile}`;
}

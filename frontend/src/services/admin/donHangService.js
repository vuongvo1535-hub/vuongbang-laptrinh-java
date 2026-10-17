// =====================================================
// FILE: donHangService.js
// CHUC NANG: Goi API quan ly don hang tu Laravel
// =====================================================

// Import cau hinh API dung chung cua du an.
// BASE_URL thuong co gia tri: http://127.0.0.1:8000/api
import API_CONFIG from "@/config/api";

// Duong dan API don hang.
// Vi du: http://127.0.0.1:8000/api/donhang
const API_URL = `${API_CONFIG.BASE_URL}/donhang`;

// -----------------------------------------------------
// HAM 1: LAY DANH SACH DON HANG
// page: so trang can lay
// search: tu khoa tim kiem
// -----------------------------------------------------
export async function getDonHangs(page = 1, search = "") {
    // Tao tham so tren URL de Laravel nhan duoc.
    // Laravel controller hien tai dung tham so "tu_khoa".
    const params = new URLSearchParams({
        page: String(page),
        tu_khoa: search.trim(),
    });

    // Gui yeu cau GET den Laravel.
    const response = await fetch(
        `${API_URL}?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    // Neu HTTP status khong thanh cong thi bao loi.
    if (!response.ok) {
        throw new Error("Khong the lay danh sach don hang.");
    }

    // Chuyen JSON Laravel tra ve thanh du lieu JavaScript.
    return await response.json();
}

// -----------------------------------------------------
// HAM 2: LAY CHI TIET DON HANG THEO ID
// id: ID cua don hang can xem
// -----------------------------------------------------
export async function getDonHang(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Khong the lay chi tiet don hang.");
    }

    return await response.json();
}
// Lấy chi tiết một đơn hàng theo mã đơn hàng.
export async function getDonHangById(id) {
    return await getDonHang(id);
}
// -----------------------------------------------------
// HAM 3: CAP NHAT TRANG THAI DON HANG
// id: ID don hang
// trangThai: trang thai moi
// -----------------------------------------------------
export async function updateDonHang(id, trangThai) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        // Bao cho Laravel biet du lieu gui len la JSON.
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },

        // Chuyen trang thai thanh JSON de gui len API.
        body: JSON.stringify({
            trang_thai: trangThai,
        }),
    });

    // Doc phan noi dung Laravel tra ve.
    const ketQua = await response.json();

    // Laravel co the tra loi loi validation hoac loi nghiep vu.
    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the cap nhat don hang."
        );
    }

    return ketQua;
}
// =====================================================
// HAM 4: CAP NHAT TRANG THAI DON HANG
// id: Ma don hang can cap nhat
// trangThai: Trang thai moi
// =====================================================
export async function capNhatTrangThaiDonHang(id, trangThai) {
    // Gui yeu cau PUT den API Laravel.
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        // Khai bao du lieu gui len la JSON.
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },

        // Gui trang thai moi len Laravel.
        body: JSON.stringify({
            trang_thai: trangThai,
        }),
    });

    // Doc ket qua Laravel tra ve.
    const ketQua = await response.json();

    // Bao loi neu API khong cap nhat thanh cong.
    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the cap nhat trang thai don hang."
        );
    }

    // Tra ket qua cho trang quan ly don hang.
    return ketQua;
}
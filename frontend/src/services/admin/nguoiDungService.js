
// =====================================================
// FILE: nguoiDungService.js
// CHUC NANG: Goi API quan ly nguoi dung tu Laravel
// =====================================================

// Import cau hinh API dung chung cua du an.
import API_CONFIG from "@/config/api";

// Duong dan API nguoi dung.
const API_URL = `${API_CONFIG.BASE_URL}/nguoidung`;

// -----------------------------------------------------
// HAM 1: LAY DANH SACH NGUOI DUNG
// page: so trang can lay
// search: tu khoa tim kiem
// -----------------------------------------------------
export async function getNguoiDungs(page = 1, search = "") {
    const params = new URLSearchParams({
        page: String(page),
        tu_khoa: search.trim(),
    });

    const response = await fetch(
        `${API_URL}?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Khong the lay danh sach nguoi dung.");
    }

    return await response.json();
}

// -----------------------------------------------------
// HAM 2: LAY CHI TIET NGUOI DUNG THEO ID
// id: ID nguoi dung can xem
// -----------------------------------------------------
export async function getNguoiDung(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Khong the lay chi tiet nguoi dung.");
    }

    return await response.json();
}

// -----------------------------------------------------
// HAM 3: THEM NGUOI DUNG
// data: thong tin nguoi dung
// -----------------------------------------------------
export async function createNguoiDung(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    const ketQua = await response.json();

    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the them nguoi dung."
        );
    }

    return ketQua;
}

// -----------------------------------------------------
// HAM 4: CAP NHAT NGUOI DUNG
// id: ID nguoi dung
// data: thong tin can cap nhat
// -----------------------------------------------------
export async function updateNguoiDung(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    const ketQua = await response.json();

    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the cap nhat nguoi dung."
        );
    }

    return ketQua;
}

// -----------------------------------------------------
// HAM 5: CHUYEN NGUOI DUNG VAO THUNG RAC
// id: ID nguoi dung
// -----------------------------------------------------
export async function deleteNguoiDung(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });

    const ketQua = await response.json();

    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the xoa nguoi dung."
        );
    }

    return ketQua;
}

// -----------------------------------------------------
// HAM 6: LAY DANH SACH NGUOI DUNG TRONG THUNG RAC
// page: so trang can lay
// search: tu khoa tim kiem
// -----------------------------------------------------
export async function getNguoiDungThungRac(page = 1, search = "") {
    const params = new URLSearchParams({
        page: String(page),
        tu_khoa: search.trim(),
    });

    const response = await fetch(
        `${API_URL}/thungrac?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Khong the lay danh sach thung rac.");
    }

    return await response.json();
}

// -----------------------------------------------------
// HAM 7: KHOI PHUC NGUOI DUNG
// id: ID nguoi dung can khoi phuc
// -----------------------------------------------------
export async function restoreNguoiDung(id) {
    const response = await fetch(`${API_URL}/${id}/khoiphuc`, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });

    const ketQua = await response.json();

    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the khoi phuc nguoi dung."
        );
    }

    return ketQua;
}

// -----------------------------------------------------
// HAM 8: XOA VINH VIEN NGUOI DUNG
// id: ID nguoi dung can xoa vinh vien
// -----------------------------------------------------
export async function forceDeleteNguoiDung(id) {
    const response = await fetch(
        `${API_URL}/${id}/xoavinhvien`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const ketQua = await response.json();

    if (!response.ok) {
        throw new Error(
            ketQua.message || "Khong the xoa vinh vien nguoi dung."
        );
    }

    return ketQua;
}
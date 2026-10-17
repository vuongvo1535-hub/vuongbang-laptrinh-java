// File service dung de goi API thuong hieu tu Laravel

import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/thuonghieu`;

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

// Doc loi tu API (Laravel tra ve message va errors)
async function nemLoi(response, thongBaoMacDinh) {

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    const error = new Error(data.message || thongBaoMacDinh);

    // errors dang { ten_truong: ["thong bao"] } de hien duoi tung o nhap
    error.errors = data.errors || null;

    throw error;
}


// Lay danh sach thuong hieu co phan trang
export async function getThuongHieus(page = 1, perPage = 5) {

    const response = await fetch(
        `${API_URL}?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách thương hiệu");
    }

    return await response.json();
}


// Lay mot thuong hieu theo ID
export async function getThuongHieu(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không tìm thấy thương hiệu");
    }

    return await response.json();
}


// Them thuong hieu
export async function createThuongHieu(data) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể thêm thương hiệu");
    }

    return await response.json();
}


// Sua thuong hieu
export async function updateThuongHieu(id, data) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể sửa thương hiệu");
    }

    return await response.json();
}


// Xoa thuong hieu
export async function deleteThuongHieu(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa thương hiệu");
    }

    return await response.json();
}


// Lay danh sach thuong hieu trong thung rac (co phan trang)
export async function getThuongHieuThungRac(page = 1, perPage = 10) {

    const response = await fetch(
        `${API_URL}/thungrac?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách thùng rác");
    }

    return await response.json();
}


// Khoi phuc thuong hieu tu thung rac
export async function khoiPhucThuongHieu(id) {

    const response = await fetch(`${API_URL}/${id}/khoiphuc`, {
        method: "POST",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể khôi phục thương hiệu");
    }

    return await response.json();
}


// Xoa vinh vien thuong hieu khoi database
export async function xoaVinhVienThuongHieu(id) {

    const response = await fetch(`${API_URL}/${id}/xoavinhvien`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa vĩnh viễn thương hiệu");
    }

    return await response.json();
}
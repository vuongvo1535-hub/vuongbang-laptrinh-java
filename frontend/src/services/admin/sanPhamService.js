// File service dung de goi API thuong hieu tu Laravel

import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/sanpham`;

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


// Lay danh sach san pham co phan trang
export async function getSanPhams(page = 1, perPage = 5) {

    const response = await fetch(
        `${API_URL}?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách sản phẩm");
    }

    return await response.json();
}


// Lay mot san pham theo ID
export async function getSanPham(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không tìm thấy sản phẩm");
    }

    return await response.json();
}


export async function createSanPham(data) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể thêm sản phẩm");
    }

    return await response.json();
}

export async function updateSanPham(id, data) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể sửa sản phẩm");
    }

    return await response.json();
}

export async function deleteSanPham(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa sản phẩm");
    }

    return await response.json();
}


// Lay danh sach san pham trong thung rac (co phan trang)
export async function getSanPhamThungRac(page = 1, perPage = 10) {

    const response = await fetch(
        `${API_URL}/thungrac?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách thùng rác");
    }

    return await response.json();
}


// Khoi phuc san pham tu thung rac
export async function khoiPhucSanPham(id) {

    const response = await fetch(`${API_URL}/${id}/khoiphuc`, {
        method: "POST",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể khôi phục sản phẩm");
    }

    return await response.json();
}


// Xoa vinh vien san pham khoi database
export async function xoaVinhVienSanPham(id) {

    const response = await fetch(`${API_URL}/${id}/xoavinhvien`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa vĩnh viễn sản phẩm");
    }

    return await response.json();
}
// File service dung de goi API danh muc tu Laravel

import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/danhmuc`;

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


// Lay danh sach danh muc co phan trang
export async function getDanhMucs(page = 1, perPage = 5) {

    const response = await fetch(
        `${API_URL}?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách danh mục");
    }

    return await response.json();
}


// Lay mot danh muc theo ID
export async function getDanhMuc(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không tìm thấy danh mục");
    }

    return await response.json();
}


// Them danh muc
export async function createDanhMuc(data) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể thêm danh mục");
    }

    return await response.json();
}

export async function updateDanhMuc(id, data) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể sửa danh mục");
    }

    return await response.json();
}

export async function deleteDanhMuc(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa danh mục");
    }

    return await response.json();
}


// Lay danh sach danh muc trong thung rac (co phan trang)
export async function getDanhMucThungRac(page = 1, perPage = 10) {

    const response = await fetch(
        `${API_URL}/thungrac?page=${page}&per_page=${perPage}`,
        { headers: { "Accept": "application/json" } }
    );

    if (!response.ok) {
        await nemLoi(response, "Không thể lấy danh sách thùng rác");
    }

    return await response.json();
}


// Khoi phuc danh muc tu thung rac
export async function khoiPhucDanhMuc(id) {

    const response = await fetch(`${API_URL}/${id}/khoiphuc`, {
        method: "POST",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể khôi phục danh mục");
    }

    return await response.json();
}


// Xoa vinh vien danh muc khoi database
export async function xoaVinhVienDanhMuc(id) {

    const response = await fetch(`${API_URL}/${id}/xoavinhvien`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
        await nemLoi(response, "Không thể xóa vĩnh viễn danh mục");
    }

    return await response.json();
}
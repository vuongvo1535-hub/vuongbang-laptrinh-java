
// Lấy địa chỉ API từ file cấu hình hiện có.
import API_CONFIG from "@/config/api";

// Đường dẫn gốc của API quản trị bài viết.
const API_URL = `${API_CONFIG.BASE_URL}/admin/baiviet`;

// Hàm gọi API dùng chung cho các chức năng bài viết.
async function goiAPI(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Đọc dữ liệu JSON Laravel trả về.
    const data = await response.json();

    // Báo lỗi nếu API trả về mã trạng thái không thành công.
    if (!response.ok) {
        throw new Error(
            data.message || "Có lỗi xảy ra khi xử lý bài viết."
        );
    }

    return data;
}

// Lấy danh sách bài viết theo trang và từ khóa.
export function getBaiViets(page = 1, tuKhoa = "") {
    const params = new URLSearchParams({
        page: String(page),
        tu_khoa: tuKhoa,
    });

    return goiAPI(`${API_URL}?${params.toString()}`);
}

// Lấy danh sách chủ đề bài viết.
export function getChuDeBaiViets() {
    return goiAPI(`${API_URL}/chu-de`);
}

// Lấy chi tiết một bài viết.
export function getBaiViet(id) {
    return goiAPI(`${API_URL}/${id}`);
}

// Thêm bài viết mới.
export function themBaiViet(data) {
    return goiAPI(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Cập nhật bài viết.
export function capNhatBaiViet(id, data) {
    return goiAPI(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Chuyển bài viết vào thùng rác.
export function xoaBaiViet(id) {
    return goiAPI(`${API_URL}/${id}`, {
        method: "DELETE",
    });
}

// Lấy danh sách bài viết trong thùng rác.
export function getThungRacBaiViet(page = 1) {
    return goiAPI(`${API_URL}/thungrac?page=${page}`);
}

// Khôi phục bài viết từ thùng rác.
export function khoiPhucBaiViet(id) {
    return goiAPI(`${API_URL}/${id}/khoi-phuc`, {
        method: "POST",
    });
}

// Xóa vĩnh viễn bài viết.
export function xoaVinhVienBaiViet(id) {
    return goiAPI(`${API_URL}/${id}/xoa-vinh-vien`, {
        method: "DELETE",
    });
}
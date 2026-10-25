import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/docGia`;

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

function chuanHoaDocGia(item) {
    if (!item) return item;
    return {
        ...item,
        name: item.hoTen || item.name || "",
        ho_ten: item.hoTen || item.name || "",
        email: item.email || "",
        phone: item.soDienThoai || item.phone || "-",
        dia_chi: item.diaChi || item.dia_chi || "",
        role: "DOC_GIA",
        status: item.trangThai === "HOAT_DONG" ? "active" : "blocked",
        created_at: item.ngayDangKy,
    };
}

// Lấy danh sách độc giả
export async function getNguoiDungs(page = 1, search = "") {
    try {
        const url = search ? `${API_URL}?tuKhoa=${encodeURIComponent(search)}` : API_URL;
        const response = await fetch(url, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Không thể lấy danh sách độc giả");
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : (data.data || []);
        const formatted = rawList.map(chuanHoaDocGia);

        const perPage = 10;
        const total = formatted.length;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const startIndex = (page - 1) * perPage;
        const pagedData = formatted.slice(startIndex, startIndex + perPage);

        return {
            data: pagedData,
            total: total,
            last_page: lastPage,
            meta: { last_page: lastPage },
            current_page: page,
        };
    } catch (err) {
        console.error("Lỗi getNguoiDungs:", err);
        return { data: [], total: 0, last_page: 1, meta: { last_page: 1 } };
    }
}

// Lấy một độc giả theo ID
export async function getNguoiDung(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không tìm thấy độc giả");
    }
    const data = await response.json();
    return chuanHoaDocGia(data);
}

// Thêm độc giả
export async function createNguoiDung(data) {
    const payload = {
        maDocGia: data.maDocGia || ("DG" + Date.now().toString().slice(-6)),
        hoTen: data.hoTen || data.name,
        email: data.email,
        soDienThoai: data.soDienThoai || data.phone,
        diaChi: data.diaChi,
        ngayDangKy: new Date().toISOString().split("T")[0],
        trangThai: "HOAT_DONG",
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể thêm độc giả");
    }
    return await response.json();
}

// Sửa độc giả
export async function updateNguoiDung(id, data) {
    const payload = {
        id: Number(id),
        maDocGia: data.maDocGia,
        hoTen: data.hoTen || data.name,
        email: data.email,
        soDienThoai: data.soDienThoai || data.phone,
        diaChi: data.diaChi,
        ngayDangKy: data.ngayDangKy,
        trangThai: data.trangThai || "HOAT_DONG",
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể sửa thông tin độc giả");
    }
    return await response.json();
}

// Xóa độc giả
export async function deleteNguoiDung(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không thể xóa độc giả (có thể đang có phiếu mượn)");
    }
    return await response.json();
}

import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/danhMuc`;

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

function chuanHoaDanhMuc(item) {
    if (!item) return item;
    return {
        ...item,
        ten_danh_muc: item.tenDanhMuc || item.ten_danh_muc || "",
        mo_ta: item.moTa || item.mo_ta || "",
        duong_dan: "/" + (item.tenDanhMuc || item.ten_danh_muc || "").toLowerCase().replace(/\s+/g, "-"),
        danh_muc_cha_id: item.danhMucChaId ?? item.danh_muc_cha_id ?? null,
        thu_tu: item.id || 1,
        trang_thai: 1,
    };
}

// Lấy danh sách danh mục có phân trang
export async function getDanhMucs(page = 1, perPage = 10) {
    try {
        const response = await fetch(API_URL, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Không thể lấy danh sách danh mục");
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : (data.data || []);
        const formatted = rawList.map(chuanHoaDanhMuc);

        const total = formatted.length;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const startIndex = (page - 1) * perPage;
        const pagedData = formatted.slice(startIndex, startIndex + perPage);

        return {
            data: pagedData,
            total: total,
            last_page: lastPage,
            current_page: page,
        };
    } catch (err) {
        console.error("Lỗi getDanhMucs:", err);
        return { data: [], total: 0, last_page: 1 };
    }
}

// Lấy một danh mục theo ID
export async function getDanhMuc(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không tìm thấy danh mục");
    }
    const data = await response.json();
    return chuanHoaDanhMuc(data);
}

// Thêm danh mục
export async function createDanhMuc(data) {
    const payload = {
        tenDanhMuc: data.tenDanhMuc || data.ten_danh_muc,
        moTa: data.moTa || data.mo_ta || "",
        danhMucChaId: data.danhMucChaId || data.danh_muc_cha_id || null,
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể thêm danh mục");
    }
    return await response.json();
}

// Sửa danh mục
export async function updateDanhMuc(id, data) {
    const payload = {
        id: Number(id),
        tenDanhMuc: data.tenDanhMuc || data.ten_danh_muc,
        moTa: data.moTa || data.mo_ta || "",
        danhMucChaId: data.danhMucChaId || data.danh_muc_cha_id || null,
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể sửa danh mục");
    }
    return await response.json();
}

// Xóa danh mục
export async function deleteDanhMuc(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không thể xóa danh mục (đang có sách thuộc danh mục này)");
    }
    return await response.json();
}

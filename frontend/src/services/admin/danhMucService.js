import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/danhMuc`;

const defaultDanhMucs = [
    { id: 1, ten_danh_muc: "Lập trình", tenDanhMuc: "Lập trình", mo_ta: "Sách lập trình và phát triển phần mềm" },
    { id: 2, ten_danh_muc: "Cơ sở dữ liệu", tenDanhMuc: "Cơ sở dữ liệu", mo_ta: "Thiết kế và quản trị CSDL" },
    { id: 3, ten_danh_muc: "Văn học", tenDanhMuc: "Văn học", mo_ta: "Tác phẩm văn học trong và ngoài nước" },
    { id: 4, ten_danh_muc: "Kỹ năng", tenDanhMuc: "Kỹ năng", mo_ta: "Kỹ năng học tập và phát triển bản thân" },
    { id: 5, ten_danh_muc: "Kinh tế - Kinh doanh", tenDanhMuc: "Kinh tế - Kinh doanh", mo_ta: "Sách kinh tế, quản trị" },
    { id: 6, ten_danh_muc: "Ngoại ngữ", tenDanhMuc: "Ngoại ngữ", mo_ta: "Sách học ngoại ngữ" },
    { id: 7, ten_danh_muc: "Khoa học", tenDanhMuc: "Khoa học", mo_ta: "Khám phá tự nhiên và vật lý" },
    { id: 8, ten_danh_muc: "Tâm lý học", tenDanhMuc: "Tâm lý học", mo_ta: "Tâm lý và hành vi con người" },
    { id: 9, ten_danh_muc: "Giáo dục", tenDanhMuc: "Giáo dục", mo_ta: "Phương pháp giáo dục và nuôi dạy trẻ" },
    { id: 10, ten_danh_muc: "Sức khỏe", tenDanhMuc: "Sức khỏe", mo_ta: "Dinh dưỡng và chăm sóc sức khỏe" },
    { id: 11, ten_danh_muc: "Công nghệ thông tin", tenDanhMuc: "Công nghệ thông tin", mo_ta: "AI, mạng và bảo mật" },
    { id: 12, ten_danh_muc: "Lịch sử - Khám phá", tenDanhMuc: "Lịch sử - Khám phá", mo_ta: "Lịch sử và nhân loại" },
];

function chuanHoaDanhMuc(item) {
    if (!item) return null;
    const ten = item.tenDanhMuc || item.ten_danh_muc || "";
    return {
        ...item,
        ten_danh_muc: ten,
        tenDanhMuc: ten,
        mo_ta: item.moTa || item.mo_ta || "",
        danh_muc_cha_id: item.danhMucChaId ?? item.danh_muc_cha_id ?? null,
        thu_tu: item.id || 1,
        trang_thai: 1,
    };
}

// Lấy danh sách danh mục có phân trang
export async function getDanhMucs(page = 1, perPage = 15) {
    try {
        const response = await fetch(API_URL, {
            headers: { Accept: "application/json" }
        });

        if (response.ok) {
            const data = await response.json();
            const rawList = Array.isArray(data) ? data : (data.data || []);
            const formatted = rawList.map(chuanHoaDanhMuc).filter(Boolean);
            if (formatted.length > 0) {
                const total = formatted.length;
                const lastPage = Math.max(1, Math.ceil(total / perPage));
                const startIndex = (page - 1) * perPage;
                return {
                    data: formatted.slice(startIndex, startIndex + perPage),
                    total,
                    last_page: lastPage,
                    current_page: page,
                };
            }
        }
    } catch (err) {
        console.warn("Lỗi getDanhMucs:", err);
    }

    return {
        data: defaultDanhMucs,
        total: defaultDanhMucs.length,
        last_page: 1,
        current_page: 1,
    };
}

// Lấy một danh mục theo ID
export async function getDanhMuc(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { Accept: "application/json" }
        });
        if (response.ok) {
            const data = await response.json();
            return chuanHoaDanhMuc(data);
        }
    } catch {}
    return defaultDanhMucs.find((x) => x.id === Number(id)) || defaultDanhMucs[0];
}

export async function createDanhMuc(data) {
    const payload = {
        tenDanhMuc: data.ten_danh_muc || data.tenDanhMuc,
        moTa: data.mo_ta || data.moTa,
        danhMucChaId: data.danh_muc_cha_id || null,
    };
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Không thể thêm danh mục");
    return await response.json();
}

export async function updateDanhMuc(id, data) {
    const payload = {
        id: Number(id),
        tenDanhMuc: data.ten_danh_muc || data.tenDanhMuc,
        moTa: data.mo_ta || data.moTa,
        danhMucChaId: data.danh_muc_cha_id || null,
    };
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Không thể sửa danh mục");
    return await response.json();
}

export async function deleteDanhMuc(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Không thể xóa danh mục");
    return await response.json();
}

import API_CONFIG from "@/config/api";

const API_URL_NXB = `${API_CONFIG.BASE_URL}/nhaXuatBan`;
const API_URL_TH = `${API_CONFIG.BASE_URL}/thuonghieu`;

const defaultThuongHieus = [
    { id: 1, ten_thuong_hieu: "Nhà Xuất Bản Trẻ", tenNhaXuatBan: "Nhà Xuất Bản Trẻ", dia_chi: "TP. Hồ Chí Minh" },
    { id: 2, ten_thuong_hieu: "Nhà Xuất Bản Giáo Dục Việt Nam", tenNhaXuatBan: "Nhà Xuất Bản Giáo Dục Việt Nam", dia_chi: "Hà Nội" },
    { id: 3, ten_thuong_hieu: "Nhà Xuất Bản Tổng Hợp TP.HCM", tenNhaXuatBan: "Nhà Xuất Bản Tổng Hợp TP.HCM", dia_chi: "TP. Hồ Chí Minh" },
];

function chuanHoa(item) {
    if (!item) return null;
    const ten = item.tenNhaXuatBan || item.ten_nha_xuat_ban || item.ten_thuong_hieu || item.tenThuongHieu || "NXB";
    return {
        ...item,
        ten_thuong_hieu: ten,
        tenNhaXuatBan: ten,
        dia_chi: item.diaChi || item.dia_chi || "",
        so_dien_thoai: item.soDienThoai || item.so_dien_thoai || "",
        email: item.email || "",
    };
}

// Lấy danh sách thương hiệu / nhà xuất bản có phân trang
export async function getThuongHieus(page = 1, perPage = 10) {
    try {
        let res = await fetch(API_URL_NXB, { headers: { Accept: "application/json" } });
        if (!res.ok) {
            res = await fetch(`${API_URL_TH}?page=${page}&per_page=${perPage}`, { headers: { Accept: "application/json" } });
        }

        if (res.ok) {
            const json = await res.json();
            const rawList = Array.isArray(json) ? json : (json.data || []);
            const formatted = rawList.map(chuanHoa).filter(Boolean);
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
        console.warn("Lỗi tải thương hiệu/NXB:", err);
    }

    // Dự phòng dữ liệu mẫu nếu API chưa có
    return {
        data: defaultThuongHieus,
        total: defaultThuongHieus.length,
        last_page: 1,
        current_page: 1,
    };
}

// Lấy 1 thương hiệu / nhà xuất bản theo ID
export async function getThuongHieu(id) {
    try {
        const res = await fetch(`${API_URL_NXB}/${id}`);
        if (res.ok) {
            const data = await res.json();
            return chuanHoa(data);
        }
    } catch {}
    return defaultThuongHieus.find((x) => x.id === Number(id)) || defaultThuongHieus[0];
}

export async function createThuongHieu(data) {
    const payload = {
        tenNhaXuatBan: data.ten_thuong_hieu || data.tenNhaXuatBan,
        diaChi: data.dia_chi || data.diaChi,
        soDienThoai: data.so_dien_thoai || data.soDienThoai,
        email: data.email,
    };
    const res = await fetch(API_URL_NXB, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Không thể thêm nhà xuất bản");
    return await res.json();
}

export async function updateThuongHieu(id, data) {
    const payload = {
        id: Number(id),
        tenNhaXuatBan: data.ten_thuong_hieu || data.tenNhaXuatBan,
        diaChi: data.dia_chi || data.diaChi,
        soDienThoai: data.so_dien_thoai || data.soDienThoai,
        email: data.email,
    };
    const res = await fetch(`${API_URL_NXB}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Không thể cập nhật nhà xuất bản");
    return await res.json();
}

export async function deleteThuongHieu(id) {
    const res = await fetch(`${API_URL_NXB}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Không thể xóa nhà xuất bản");
    return await res.json();
}

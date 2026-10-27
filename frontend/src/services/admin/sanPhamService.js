import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/sach`;

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

function chuanHoaDuLieu(item) {
    if (!item) return item;
    return {
        ...item,
        ten_san_pham: item.tenSach || item.ten_san_pham || "",
        tenSach: item.tenSach || item.ten_san_pham || "",
        ma_san_pham: item.maSach || item.ma_san_pham || `DEMO00${item.id}`,
        maSach: item.maSach || item.ma_san_pham || `DEMO00${item.id}`,
        duong_dan: item.maSach || item.ma_san_pham || `DEMO00${item.id}`,
        danh_muc_id: item.danhMucId || item.danh_muc_id || "",
        danhMucId: item.danhMucId || item.danh_muc_id || "",
        thuong_hieu_id: item.nhaXuatBanId || item.thuong_hieu_id || "",
        nhaXuatBanId: item.nhaXuatBanId || item.thuong_hieu_id || "",
        gia: item.giaTien ?? item.gia ?? 0,
        giaTien: item.giaTien ?? item.gia ?? 0,
        gia_khuyen_mai: "",
        hinh_anh_dai_dien: item.anhBia || item.hinh_anh_dai_dien || "",
        anhBia: item.anhBia || item.hinh_anh_dai_dien || "",
        trang_thai: item.trangThai === "DANG_LUU_HANH" || item.trang_thai === 1 ? 1 : 0,
        so_luong_ton: item.soTrang || 5,
        mo_ta_ngan: item.moTa || item.mo_ta || "",
        mo_ta_chi_tiet: item.moTa || item.mo_ta || "",
    };
}

// Lấy danh sách sách có phân trang
export async function getSanPhams(page = 1, perPage = 10) {
    try {
        const response = await fetch(API_URL, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Không thể lấy danh sách sách");
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : (data.data || []);
        const formatted = rawList.map(chuanHoaDuLieu);

        // Phân trang đơn giản ở frontend
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
        console.error("Lỗi getSanPhams:", err);
        return { data: [], total: 0, last_page: 1 };
    }
}

// Lấy một sách theo ID
export async function getSanPham(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không tìm thấy sách");
    }
    const data = await response.json();
    return chuanHoaDuLieu(data);
}

// Thêm sách mới
export async function createSanPham(data) {
    const payload = {
        maSach: data.maSach || data.ma_san_pham || ("MS" + Date.now().toString().slice(-6)),
        tenSach: data.tenSach || data.ten_san_pham,
        danhMucId: data.danhMucId || data.danh_muc_id || 1,
        nhaXuatBanId: data.nhaXuatBanId || data.nha_xuat_ban_id || 1,
        isbn: data.isbn || null,
        namXuatBan: data.namXuatBan || data.nam_xuat_ban || 2024,
        lanTaiBan: 1,
        ngonNgu: "Tiếng Việt",
        moTa: data.moTa || data.mo_ta || "",
        giaTien: data.giaTien || data.gia || 0,
        soTrang: data.soTrang || 200,
        anhBia: data.anhBia || data.hinh_anh_dai_dien || "",
        trangThai: "DANG_LUU_HANH"
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể thêm sách");
    }
    return await response.json();
}

// Sửa sách
export async function updateSanPham(id, data) {
    const payload = {
        id: Number(id),
        maSach: data.maSach || data.ma_san_pham,
        tenSach: data.tenSach || data.ten_san_pham,
        danhMucId: data.danhMucId || data.danh_muc_id || 1,
        nhaXuatBanId: data.nhaXuatBanId || data.nha_xuat_ban_id || 1,
        isbn: data.isbn,
        namXuatBan: data.namXuatBan || data.nam_xuat_ban,
        lanTaiBan: 1,
        ngonNgu: "Tiếng Việt",
        moTa: data.moTa || data.mo_ta,
        giaTien: data.giaTien || data.gia,
        soTrang: data.soTrang,
        anhBia: data.anhBia || data.hinh_anh_dai_dien,
        trangThai: data.trangThai || "DANG_LUU_HANH"
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể sửa sách");
    }
    return await response.json();
}

// Xóa sách
export async function deleteSanPham(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Không thể xóa sách (có thể đang có bản sao hoặc phiếu mượn tham chiếu)");
    }
    return await response.json();
}

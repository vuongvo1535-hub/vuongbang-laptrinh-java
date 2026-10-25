import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/phieuMuon`;

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

function chuanHoaPhieuMuon(item) {
    if (!item) return item;
    return {
        ...item,
        ma_don_hang: item.maPhieu || ("PM-" + item.id),
        ten_nguoi_nhan: `Độc giả #${item.docGiaId}`,
        so_dien_thoai: "-",
        trang_thai: item.trangThai || "DANG_MUON",
        ngay_tao: item.ngayMuon,
        tong_tien: 0,
    };
}

// Lấy danh sách phiếu mượn
export async function getDonHangs(page = 1, search = "") {
    try {
        const response = await fetch(API_URL, {
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Không thể lấy danh sách phiếu mượn");
        }

        const data = await response.json();
        const rawList = Array.isArray(data) ? data : (data.data || []);
        let formatted = rawList.map(chuanHoaPhieuMuon);

        if (search.trim()) {
            formatted = formatted.filter((x) =>
                (x.ma_don_hang || "").toLowerCase().includes(search.toLowerCase()) ||
                String(x.docGiaId).includes(search)
            );
        }

        const perPage = 10;
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
        console.error("Lỗi getDonHangs:", err);
        return { data: [], total: 0, last_page: 1 };
    }
}

// Lấy chi tiết phiếu mượn
export async function getDonHang(id) {
    const [resPhieu, resChiTiet] = await Promise.all([
        fetch(`${API_URL}/${id}`, { headers: { "Accept": "application/json" } }),
        fetch(`${API_URL}/${id}/chiTiet`, { headers: { "Accept": "application/json" } })
    ]);

    if (!resPhieu.ok) {
        throw new Error("Không tìm thấy phiếu mượn");
    }

    const phieu = await resPhieu.json();
    let chiTiet = [];
    if (resChiTiet.ok) {
        chiTiet = await resChiTiet.json();
    }

    return {
        ...chuanHoaPhieuMuon(phieu),
        chi_tiet_don_hang: Array.isArray(chiTiet) ? chiTiet : [],
    };
}

// Cập nhật trạng thái phiếu mượn
export async function capNhatTrangThaiDonHang(id, trangThaiMoi) {
    const phieuHienTai = await (await fetch(`${API_URL}/${id}`)).json();
    const payload = {
        ...phieuHienTai,
        trangThai: trangThaiMoi,
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái phiếu mượn");
    }
    return await response.json();
}

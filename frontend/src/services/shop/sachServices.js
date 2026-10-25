import axiosClient from "@/lib/axiosClient";
import API_CONFIG from "@/config/api";
import { sachMau, danhMucMau } from "@/data/sach";

const boDau = (t = "") =>
    String(t)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .toLowerCase();

// Lấy danh sách sách
async function getSach({ q = "", danhMucId = "", sort = "moi" } = {}) {
    if (API_CONFIG.USE_MOCK) {
        let ds = sachMau.filter(
            (sach) =>
                (!danhMucId || Number(sach.danh_muc_id) === Number(danhMucId)) &&
                (!q.trim() ||
                    boDau(`${sach.ten_sach || ""} ${(sach.tac_gia || []).toString()} ${sach.ma_sach || ""}`)
                        .includes(boDau(q.trim())))
        );

        if (sort === "ten") {
            ds = [...ds].sort((a, b) => (a.ten_sach || "").localeCompare(b.ten_sach || "", "vi"));
        } else if (sort === "nam") {
            ds = [...ds].sort((a, b) => (b.nam_xuat_ban || 0) - (a.nam_xuat_ban || 0));
        } else {
            ds = [...ds].sort((a, b) => b.id - a.id);
        }
        return ds;
    }

    try {
        const res = await axiosClient.get("/sach");
        const data = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.content)
                    ? res.data.content
                    : [];
        return data;
    } catch (err) {
        console.error("Lỗi getSach:", err);
        return [];
    }
}

// Lấy chi tiết sách theo ID (kết hợp cả thông tin tác giả, NXB, số bản sao sẵn sàng)
async function getSachTheoId(id) {
    if (API_CONFIG.USE_MOCK) {
        return sachMau.find((sach) => sach.id === Number(id)) || null;
    }

    try {
        const [resSach, resChiTiet] = await Promise.all([
            axiosClient.get(`/sach/${id}`),
            axiosClient.get(`/sach/${id}/chiTiet`).catch(() => null)
        ]);

        const sach = resSach.data?.data ?? resSach.data ?? null;
        if (!sach) return null;

        const chiTiet = resChiTiet?.data || {};

        return {
            ...sach,
            ten_danh_muc: chiTiet.tenDanhMuc || sach.tenDanhMuc || "Tổng hợp",
            ten_nha_xuat_ban: chiTiet.tenNhaXuatBan || sach.tenNhaXuatBan || "NXB Giáo Dục",
            tac_gia: chiTiet.tacGia ? chiTiet.tacGia.map(tg => tg.tenTacGia).join(", ") : (sach.tacGia || "Nhiều tác giả"),
            tong_so_ban: chiTiet.tongSoBan ?? 5,
            so_ban_san_sang: chiTiet.soBanSanSang ?? 3,
        };
    } catch (err) {
        console.error("Lỗi getSachTheoId:", err);
        return null;
    }
}

// Lấy danh sách danh mục
async function getDanhMuc() {
    if (API_CONFIG.USE_MOCK) {
        return danhMucMau;
    }

    try {
        const res = await axiosClient.get("/danhMuc");
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
    } catch (err) {
        console.error("Lỗi getDanhMuc:", err);
        return [];
    }
}

const SachService = {
    getSach,
    getSachTheoId,
    getDanhMuc,
};

export default SachService;

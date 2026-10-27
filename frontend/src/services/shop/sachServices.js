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
        return data.map((s) => ({
            ...s,
            ten_sach: s.tenSach || s.ten_sach || "Sách thư viện",
            tenSach: s.tenSach || s.ten_sach || "Sách thư viện",
            ma_sach: s.maSach || s.ma_sach || `DEMO00${s.id}`,
            maSach: s.maSach || s.ma_sach || `DEMO00${s.id}`,
            anh_bia: s.anhBia || s.anh_bia || null,
            anhBia: s.anhBia || s.anh_bia || null,
            nam_xuat_ban: s.namXuatBan ?? s.nam_xuat_ban,
            namXuatBan: s.namXuatBan ?? s.nam_xuat_ban,
            gia_tien: s.giaTien ?? s.gia_tien ?? 0,
            giaTien: s.giaTien ?? s.gia_tien ?? 0,
            ngon_ngu: s.ngonNgu || s.ngon_ngu || "Tiếng Việt",
            ngonNgu: s.ngonNgu || s.ngon_ngu || "Tiếng Việt",
            trang_thai: s.trangThai || s.trang_thai || "DANG_LUU_HANH",
            trangThai: s.trangThai || s.trang_thai || "DANG_LUU_HANH",
        }));
    } catch (err) {
        console.error("Lỗi getSach:", err);
        return sachMau;
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

        const raw = resSach.data?.data ?? resSach.data ?? null;
        if (!raw) return null;

        const chiTiet = resChiTiet?.data || {};

        const tenSach = raw.tenSach || raw.ten_sach || "Sách thư viện";
        const maSach = raw.maSach || raw.ma_sach || `DEMO00${raw.id || id}`;
        const anhBia = raw.anhBia || raw.anh_bia || null;
        const isbn = raw.isbn || "978-604-000000";
        const namXuatBan = raw.namXuatBan ?? raw.nam_xuat_ban ?? 2023;
        const lanTaiBan = raw.lanTaiBan ?? raw.lan_tai_ban ?? 1;
        const ngonNgu = raw.ngonNgu || raw.ngon_ngu || "Tiếng Việt";
        const soTrang = raw.soTrang ?? raw.so_trang ?? 240;
        const giaTien = raw.giaTien ?? raw.gia_tien ?? 85000;
        const moTa = raw.moTa || raw.mo_ta || "Tác phẩm tiêu biểu có giá trị văn học và tri thức, hiện được lưu trữ và phục vụ bạn đọc tại thư viện.";

        const tenDanhMuc = chiTiet.tenDanhMuc || raw.tenDanhMuc || raw.ten_danh_muc || "Văn học & Kỹ năng";
        const tenNhaXuatBan = chiTiet.tenNhaXuatBan || raw.tenNhaXuatBan || raw.ten_nha_xuat_ban || "Nhà Xuất Bản Trẻ";

        let tacGia = "Tác giả thư viện";
        if (Array.isArray(chiTiet.tacGia) && chiTiet.tacGia.length > 0) {
            tacGia = chiTiet.tacGia.map(tg => tg.tenTacGia || tg.ten_tac_gia).join(", ");
        } else if (raw.tacGia || raw.tac_gia) {
            tacGia = Array.isArray(raw.tac_gia) ? raw.tac_gia.join(", ") : (raw.tacGia || raw.tac_gia);
        }

        const tongSoBan = (chiTiet.tongSoBan !== undefined && Number(chiTiet.tongSoBan) > 0) ? Number(chiTiet.tongSoBan) : 5;
        const soBanSanSang = (chiTiet.soBanSanSang !== undefined && Number(chiTiet.soBanSanSang) > 0) ? Number(chiTiet.soBanSanSang) : Math.max(tongSoBan - 1, 4);
        const viTriKe = raw.viTriKe || raw.vi_tri_ke || `Kệ K${((Number(id) || 1) % 5) + 1}-A`;

        return {
            ...raw,
            id: raw.id || id,
            ten_sach: tenSach,
            tenSach: tenSach,
            ma_sach: maSach,
            maSach: maSach,
            anh_bia: anhBia,
            anhBia: anhBia,
            isbn,
            nam_xuat_ban: namXuatBan,
            namXuatBan,
            lan_tai_ban: lanTaiBan,
            lanTaiBan,
            ngon_ngu: ngonNgu,
            ngonNgu,
            so_trang: soTrang,
            soTrang,
            gia_tien: giaTien,
            giaTien,
            mo_ta: moTa,
            moTa,
            ten_danh_muc: tenDanhMuc,
            tenDanhMuc,
            ten_nha_xuat_ban: tenNhaXuatBan,
            tenNhaXuatBan,
            tac_gia: tacGia,
            tacGia,
            tong_so_ban: tongSoBan,
            tongSoBan,
            so_ban_san_sang: soBanSanSang,
            soBanSanSang,
            vi_tri_ke: viTriKe,
            viTriKe,
        };
    } catch (err) {
        console.error("Lỗi getSachTheoId:", err);
        return sachMau.find((s) => s.id === Number(id)) || null;
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
        return danhMucMau;
    } catch (err) {
        console.error("Lỗi getDanhMuc:", err);
        return danhMucMau;
    }
}

const SachService = {
    getSach,
    getSachTheoId,
    getDanhMuc,
};

export default SachService;

// Dữ liệu mẫu khớp với file quan_ly_thu_vien_day_du.sql (dùng khi USE_MOCK = true)
export const danhMucMau = [
    { id: 1, ten_danh_muc: "Lập trình", mo_ta: "Sách lập trình và phát triển phần mềm", icon: "💻" },
    { id: 2, ten_danh_muc: "Cơ sở dữ liệu", mo_ta: "Thiết kế và quản trị cơ sở dữ liệu", icon: "🗄️" },
    { id: 3, ten_danh_muc: "Văn học", mo_ta: "Tác phẩm văn học trong và ngoài nước", icon: "📖" },
    { id: 4, ten_danh_muc: "Kỹ năng", mo_ta: "Kỹ năng học tập và phát triển bản thân", icon: "🎯" },
];

const s = (id, ma_sach, ten_sach, danh_muc_id, tac_gia, nxb, nam, ngon_ngu, so_trang, gia, mo_ta, san_sang, tong, ke) => ({
    id, ma_sach, ten_sach, danh_muc_id,
    ten_danh_muc: danhMucMau.find((d) => d.id === danh_muc_id).ten_danh_muc,
    tac_gia, ten_nha_xuat_ban: nxb, nam_xuat_ban: nam, ngon_ngu, so_trang, gia_tien: gia, mo_ta,
    anh_bia: null, so_ban_san_sang: san_sang, tong_ban_sao: tong, vi_tri_ke: ke,
});

export const sachMau = [
    s(1, "S001", "Lập trình Java cơ bản", 1, ["Nguyễn Văn A"], "Nhà Xuất Bản Giáo Dục Việt Nam", 2023, "Tiếng Việt", 320, 95000, "Nhập môn lập trình Java.", 1, 2, "A1-01"),
    s(2, "S002", "Lập trình hướng đối tượng", 1, ["Nguyễn Văn A"], "Nhà Xuất Bản Giáo Dục Việt Nam", 2022, "Tiếng Việt", 350, 110000, "Các nguyên lý lập trình hướng đối tượng.", 2, 2, "A1-02"),
    s(3, "S003", "Cơ sở dữ liệu MySQL", 2, ["Trần Thị B"], "Nhà Xuất Bản Giáo Dục Việt Nam", 2024, "Tiếng Việt", 280, 125000, "Thiết kế và truy vấn cơ sở dữ liệu.", 0, 2, "B1-01"),
    s(4, "S004", "Clean Code", 1, ["Robert C. Martin"], "Nhà Xuất Bản Trẻ", 2008, "Tiếng Anh", 464, 250000, "Nguyên tắc viết mã nguồn dễ đọc và bảo trì.", 1, 1, "A2-01"),
    s(5, "S005", "Dế Mèn phiêu lưu ký", 3, ["Tô Hoài"], "Nhà Xuất Bản Trẻ", 2020, "Tiếng Việt", 144, 75000, "Tác phẩm văn học Việt Nam.", 0, 1, "C1-01"),
    s(6, "S006", "Tôi thấy hoa vàng trên cỏ xanh", 3, ["Nguyễn Nhật Ánh"], "Nhà Xuất Bản Tổng Hợp TP.HCM", 2019, "Tiếng Việt", 378, 98000, "Tiểu thuyết của Nguyễn Nhật Ánh.", 1, 1, "C1-02"),
    s(7, "S007", "Kỹ năng tự học", 4, ["Nguyễn Văn A"], "Nhà Xuất Bản Tổng Hợp TP.HCM", 2021, "Tiếng Việt", 210, 88000, "Phương pháp học tập và tự học.", 1, 1, "D1-01"),
    s(8, "S008", "Thiết kế hệ thống thông tin", 2, ["Trần Thị B"], "Nhà Xuất Bản Giáo Dục Việt Nam", 2024, "Tiếng Việt", 300, 135000, "Cơ sở phân tích và thiết kế hệ thống.", 2, 2, "B1-02"),
];

-- ============================================================
-- CƠ SỞ DỮ LIỆU QUẢN LÝ THƯ VIỆN (BẢN ĐẦY ĐỦ)
-- Tương thích MySQL 8.0+ và MariaDB 10.4+ (XAMPP)
--
-- Gồm 15 bảng nghiệp vụ (giữ nguyên tên bảng, tên cột, khóa ngoại
-- của file quan_ly_thu_vien.sql gốc) và 1 bảng kỹ thuật
-- personal_access_tokens cho Laravel Sanctum (đăng nhập bằng token).
--
-- CÁCH DÙNG: import vào máy chủ MySQL/MariaDB. File này KHÔNG xóa bảng
-- hay dữ liệu đang có (không có DROP TABLE). Dữ liệu mẫu chỉ nên
-- nạp vào database mới, còn trống.
--
-- Tài khoản mẫu (mật khẩu đã băm bcrypt, tương thích Hash::check của Laravel):
--   admin     / demo_admin   (QUAN_TRI)
--   thuthu01  / demo_thuthu  (THU_THU)
--   docgia01..03 / demo_docgia (DOC_GIA)
-- Hãy đổi mật khẩu trước khi dùng thật.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+07:00';

CREATE DATABASE IF NOT EXISTS quan_ly_thu_vien
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_thu_vien;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- PHẦN 1. CẤU TRÚC BẢNG
-- ============================================================

-- 1. Tài khoản đăng nhập
CREATE TABLE IF NOT EXISTS tai_khoan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã băm bcrypt',
    vai_tro ENUM('QUAN_TRI','THU_THU','DOC_GIA') NOT NULL DEFAULT 'DOC_GIA',
    trang_thai ENUM('HOAT_DONG','KHOA') NOT NULL DEFAULT 'HOAT_DONG',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Nhân viên thư viện
CREATE TABLE IF NOT EXISTS nhan_vien (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tai_khoan_id BIGINT UNSIGNED NULL UNIQUE,
    ma_nhan_vien VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    dia_chi VARCHAR(255),
    chuc_vu ENUM('QUAN_TRI','THU_THU') NOT NULL DEFAULT 'THU_THU',
    trang_thai ENUM('DANG_LAM','NGHI_VIEC') NOT NULL DEFAULT 'DANG_LAM',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nhan_vien_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Độc giả
CREATE TABLE IF NOT EXISTS doc_gia (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tai_khoan_id BIGINT UNSIGNED NULL UNIQUE,
    ma_doc_gia VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh ENUM('NAM','NU','KHAC') DEFAULT 'KHAC',
    so_dien_thoai VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    dia_chi VARCHAR(255),
    ngay_dang_ky DATE NOT NULL,
    trang_thai ENUM('HOAT_DONG','BI_KHOA') NOT NULL DEFAULT 'HOAT_DONG',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_gia_tai_khoan FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Thẻ thư viện
CREATE TABLE IF NOT EXISTS the_thu_vien (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doc_gia_id BIGINT UNSIGNED NOT NULL UNIQUE,
    so_the VARCHAR(30) NOT NULL UNIQUE,
    ngay_cap DATE NOT NULL,
    ngay_het_han DATE NOT NULL,
    trang_thai ENUM('CON_HAN','HET_HAN','BI_KHOA') NOT NULL DEFAULT 'CON_HAN',
    CONSTRAINT fk_the_doc_gia FOREIGN KEY (doc_gia_id) REFERENCES doc_gia(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Danh mục sách
CREATE TABLE IF NOT EXISTS danh_muc (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_danh_muc VARCHAR(100) NOT NULL UNIQUE,
    mo_ta VARCHAR(500),
    danh_muc_cha_id BIGINT UNSIGNED NULL,
    CONSTRAINT fk_danh_muc_cha FOREIGN KEY (danh_muc_cha_id) REFERENCES danh_muc(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tác giả
CREATE TABLE IF NOT EXISTS tac_gia (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_tac_gia VARCHAR(120) NOT NULL,
    ngay_sinh DATE NULL,
    quoc_tich VARCHAR(80),
    tieu_su TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Nhà xuất bản
CREATE TABLE IF NOT EXISTS nha_xuat_ban (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_nha_xuat_ban VARCHAR(150) NOT NULL UNIQUE,
    dia_chi VARCHAR(255),
    so_dien_thoai VARCHAR(20),
    email VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Sách (đầu sách)
CREATE TABLE IF NOT EXISTS sach (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_sach VARCHAR(30) NOT NULL UNIQUE,
    ten_sach VARCHAR(200) NOT NULL,
    danh_muc_id BIGINT UNSIGNED NOT NULL,
    nha_xuat_ban_id BIGINT UNSIGNED NULL,
    isbn VARCHAR(20) UNIQUE,
    nam_xuat_ban YEAR,
    lan_tai_ban INT UNSIGNED NOT NULL DEFAULT 1,
    ngon_ngu VARCHAR(50) DEFAULT 'Tiếng Việt',
    mo_ta TEXT,
    gia_tien DECIMAL(12,2) NOT NULL DEFAULT 0,
    so_trang INT UNSIGNED,
    anh_bia VARCHAR(255),
    trang_thai ENUM('DANG_LUU_HANH','NGUNG_LUU_HANH') NOT NULL DEFAULT 'DANG_LUU_HANH',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sach_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sach_nxb FOREIGN KEY (nha_xuat_ban_id) REFERENCES nha_xuat_ban(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Quan hệ nhiều-nhiều giữa sách và tác giả
CREATE TABLE IF NOT EXISTS sach_tac_gia (
    sach_id BIGINT UNSIGNED NOT NULL,
    tac_gia_id BIGINT UNSIGNED NOT NULL,
    vai_tro VARCHAR(50) NOT NULL DEFAULT 'Tác giả',
    PRIMARY KEY (sach_id, tac_gia_id),
    CONSTRAINT fk_stg_sach FOREIGN KEY (sach_id) REFERENCES sach(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_stg_tac_gia FOREIGN KEY (tac_gia_id) REFERENCES tac_gia(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bản sao vật lý của từng đầu sách
CREATE TABLE IF NOT EXISTS ban_sao_sach (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sach_id BIGINT UNSIGNED NOT NULL,
    ma_vach VARCHAR(40) NOT NULL UNIQUE,
    vi_tri_ke VARCHAR(50),
    tinh_trang ENUM('TOT','CU','HU_HONG','MAT') NOT NULL DEFAULT 'TOT',
    trang_thai ENUM('SAN_SANG','DANG_MUON','DA_DAT_TRUOC','THANH_LY') NOT NULL DEFAULT 'SAN_SANG',
    ngay_nhap DATE,
    CONSTRAINT fk_ban_sao_sach FOREIGN KEY (sach_id) REFERENCES sach(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Phiếu mượn
CREATE TABLE IF NOT EXISTS phieu_muon (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_phieu VARCHAR(30) NOT NULL UNIQUE,
    doc_gia_id BIGINT UNSIGNED NOT NULL,
    nhan_vien_id BIGINT UNSIGNED NULL,
    ngay_muon DATETIME NOT NULL,
    ghi_chu VARCHAR(500),
    trang_thai ENUM('DANG_MUON','DA_TRA_MOT_PHAN','DA_TRA','QUA_HAN','DA_HUY') NOT NULL DEFAULT 'DANG_MUON',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_phieu_doc_gia FOREIGN KEY (doc_gia_id) REFERENCES doc_gia(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_phieu_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Chi tiết phiếu mượn: mỗi dòng là một bản sao sách được mượn
CREATE TABLE IF NOT EXISTS chi_tiet_phieu_muon (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phieu_muon_id BIGINT UNSIGNED NOT NULL,
    ban_sao_sach_id BIGINT UNSIGNED NOT NULL,
    ngay_hen_tra DATE NOT NULL,
    ngay_tra_thuc_te DATETIME NULL,
    tinh_trang_luc_muon ENUM('TOT','CU','HU_HONG') NOT NULL DEFAULT 'TOT',
    tinh_trang_luc_tra ENUM('TOT','CU','HU_HONG','MAT') NULL,
    trang_thai ENUM('DANG_MUON','DA_TRA','MAT','HU_HONG') NOT NULL DEFAULT 'DANG_MUON',
    ghi_chu VARCHAR(500),
    CONSTRAINT uq_chi_tiet_phieu_ban_sao UNIQUE (phieu_muon_id, ban_sao_sach_id),
    CONSTRAINT fk_ctpm_phieu FOREIGN KEY (phieu_muon_id) REFERENCES phieu_muon(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ctpm_ban_sao FOREIGN KEY (ban_sao_sach_id) REFERENCES ban_sao_sach(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Tiền phạt
CREATE TABLE IF NOT EXISTS tien_phat (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chi_tiet_phieu_muon_id BIGINT UNSIGNED NOT NULL,
    nhan_vien_id BIGINT UNSIGNED NULL,
    ly_do ENUM('QUA_HAN','HU_HONG','LAM_MAT','KHAC') NOT NULL,
    so_tien DECIMAL(12,2) NOT NULL DEFAULT 0,
    ngay_lap DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trang_thai ENUM('CHUA_THANH_TOAN','DA_THANH_TOAN','MIEN_GIAM') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
    ghi_chu VARCHAR(500),
    CONSTRAINT fk_tien_phat_chi_tiet FOREIGN KEY (chi_tiet_phieu_muon_id) REFERENCES chi_tiet_phieu_muon(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_tien_phat_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES nhan_vien(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Chi tiết các lần thanh toán tiền phạt
CREATE TABLE IF NOT EXISTS chi_tiet_tien_phat (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tien_phat_id BIGINT UNSIGNED NOT NULL,
    so_tien DECIMAL(12,2) NOT NULL,
    ngay_thanh_toan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    phuong_thuc ENUM('TIEN_MAT','CHUYEN_KHOAN','THE') NOT NULL DEFAULT 'TIEN_MAT',
    ghi_chu VARCHAR(255),
    CONSTRAINT fk_cttp_tien_phat FOREIGN KEY (tien_phat_id) REFERENCES tien_phat(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Đặt trước sách
CREATE TABLE IF NOT EXISTS dat_truoc_sach (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doc_gia_id BIGINT UNSIGNED NOT NULL,
    sach_id BIGINT UNSIGNED NOT NULL,
    ngay_dat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_het_han DATETIME NULL,
    trang_thai ENUM('CHO_XU_LY','DA_SAN_SANG','DA_NHAN','DA_HUY','HET_HAN') NOT NULL DEFAULT 'CHO_XU_LY',
    ghi_chu VARCHAR(500),
    CONSTRAINT fk_dat_truoc_doc_gia FOREIGN KEY (doc_gia_id) REFERENCES doc_gia(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_dat_truoc_sach FOREIGN KEY (sach_id) REFERENCES sach(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Token đăng nhập API (bảng chuẩn của Laravel Sanctum, giữ nguyên tên)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name TEXT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    KEY personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id),
    KEY personal_access_tokens_expires_at_index (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- PHẦN 2. DỮ LIỆU MẪU (có dấu tiếng Việt)
-- ============================================================

INSERT INTO tai_khoan (id, ten_dang_nhap, mat_khau, vai_tro, trang_thai) VALUES
(1, 'admin',    '$2y$12$TFhubh2I0.6bRALEr96vne1UEemMd12BveY71IdHSyuPjKhulnQ0u', 'QUAN_TRI', 'HOAT_DONG'),
(2, 'thuthu01', '$2y$12$c6pApX.qQYox3pPgj3K5gubRL1.TgHCeOkHuH5MwbwulBYVfMHTsm', 'THU_THU',  'HOAT_DONG'),
(3, 'docgia01', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA',  'HOAT_DONG'),
(4, 'docgia02', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA',  'HOAT_DONG'),
(5, 'docgia03', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA',  'HOAT_DONG');

INSERT INTO nhan_vien (id, tai_khoan_id, ma_nhan_vien, ho_ten, so_dien_thoai, email, dia_chi, chuc_vu, trang_thai) VALUES
(1, 1, 'NV001', 'Nguyễn Văn An',  '0901000001', 'an.admin@example.com',     'Quận 1, TP. Hồ Chí Minh',  'QUAN_TRI', 'DANG_LAM'),
(2, 2, 'NV002', 'Trần Thị Bình',  '0901000002', 'binh.thuthu@example.com',  'Thủ Đức, TP. Hồ Chí Minh', 'THU_THU',  'DANG_LAM');

INSERT INTO doc_gia (id, tai_khoan_id, ma_doc_gia, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ngay_dang_ky, trang_thai) VALUES
(1, 3, 'DG001', 'Lê Minh Châu',   '2003-04-15', 'NU',  '0912000001', 'chau@example.com', 'Thủ Đức, TP. Hồ Chí Minh',    '2026-01-10', 'HOAT_DONG'),
(2, 4, 'DG002', 'Phạm Quốc Huy',  '2002-11-20', 'NAM', '0912000002', 'huy@example.com',  'Gò Vấp, TP. Hồ Chí Minh',     '2026-02-05', 'HOAT_DONG'),
(3, 5, 'DG003', 'Võ Ngọc Mai',    '2004-08-09', 'NU',  '0912000003', 'mai@example.com',  'Bình Thạnh, TP. Hồ Chí Minh', '2026-03-12', 'HOAT_DONG');

INSERT INTO the_thu_vien (id, doc_gia_id, so_the, ngay_cap, ngay_het_han, trang_thai) VALUES
(1, 1, 'THE0001', '2026-01-10', '2027-01-10', 'CON_HAN'),
(2, 2, 'THE0002', '2026-02-05', '2027-02-05', 'CON_HAN'),
(3, 3, 'THE0003', '2026-03-12', '2027-03-12', 'CON_HAN');

INSERT INTO danh_muc (id, ten_danh_muc, mo_ta, danh_muc_cha_id) VALUES
(1, 'Lập trình',      'Sách lập trình và phát triển phần mềm',            NULL),
(2, 'Cơ sở dữ liệu',  'Sách về thiết kế và quản trị cơ sở dữ liệu',       NULL),
(3, 'Văn học',        'Tác phẩm văn học trong và ngoài nước',             NULL),
(4, 'Kỹ năng',        'Sách kỹ năng học tập và phát triển bản thân',      NULL);

INSERT INTO tac_gia (id, ten_tac_gia, ngay_sinh, quoc_tich, tieu_su) VALUES
(1, 'Nguyễn Văn A',      '1980-01-01', 'Việt Nam', 'Tác giả sách công nghệ.'),
(2, 'Trần Thị B',        '1975-05-12', 'Việt Nam', 'Tác giả sách cơ sở dữ liệu.'),
(3, 'Robert C. Martin',  '1952-12-05', 'Hoa Kỳ',   'Tác giả sách về kỹ thuật phần mềm.'),
(4, 'Tô Hoài',           '1920-09-27', 'Việt Nam', 'Nhà văn Việt Nam.'),
(5, 'Nguyễn Nhật Ánh',   '1955-05-07', 'Việt Nam', 'Nhà văn Việt Nam.');

INSERT INTO nha_xuat_ban (id, ten_nha_xuat_ban, dia_chi, so_dien_thoai, email) VALUES
(1, 'Nhà Xuất Bản Trẻ',                'TP. Hồ Chí Minh', '02811110001', 'lienhe@nxbtre.example'),
(2, 'Nhà Xuất Bản Giáo Dục Việt Nam',  'Hà Nội',          '02411110002', 'lienhe@nxbgd.example'),
(3, 'Nhà Xuất Bản Tổng Hợp TP.HCM',    'TP. Hồ Chí Minh', '02811110003', 'lienhe@tonghop.example');

INSERT INTO sach (id, ma_sach, ten_sach, danh_muc_id, nha_xuat_ban_id, isbn, nam_xuat_ban, lan_tai_ban, ngon_ngu, mo_ta, gia_tien, so_trang, trang_thai) VALUES
(1, 'S001', 'Lập trình Java cơ bản',              1, 2, '9780000000001', 2023, 2,  'Tiếng Việt', 'Nhập môn lập trình Java.',                          95000,  320, 'DANG_LUU_HANH'),
(2, 'S002', 'Lập trình hướng đối tượng',          1, 2, '9780000000002', 2022, 1,  'Tiếng Việt', 'Các nguyên lý lập trình hướng đối tượng.',          110000, 350, 'DANG_LUU_HANH'),
(3, 'S003', 'Cơ sở dữ liệu MySQL',                2, 2, '9780000000003', 2024, 1,  'Tiếng Việt', 'Thiết kế và truy vấn cơ sở dữ liệu.',               125000, 280, 'DANG_LUU_HANH'),
(4, 'S004', 'Clean Code',                         1, 1, '9780000000004', 2008, 1,  'Tiếng Anh',  'Nguyên tắc viết mã nguồn dễ đọc và bảo trì.',        250000, 464, 'DANG_LUU_HANH'),
(5, 'S005', 'Dế Mèn phiêu lưu ký',                3, 1, '9780000000005', 2020, 10, 'Tiếng Việt', 'Tác phẩm văn học Việt Nam.',                        75000,  144, 'DANG_LUU_HANH'),
(6, 'S006', 'Tôi thấy hoa vàng trên cỏ xanh',     3, 3, '9780000000006', 2019, 15, 'Tiếng Việt', 'Tiểu thuyết của Nguyễn Nhật Ánh.',                  98000,  378, 'DANG_LUU_HANH'),
(7, 'S007', 'Kỹ năng tự học',                     4, 3, '9780000000007', 2021, 3,  'Tiếng Việt', 'Phương pháp học tập và tự học.',                    88000,  210, 'DANG_LUU_HANH'),
(8, 'S008', 'Thiết kế hệ thống thông tin',        2, 2, '9780000000008', 2024, 1,  'Tiếng Việt', 'Cơ sở phân tích và thiết kế hệ thống.',             135000, 300, 'DANG_LUU_HANH');

INSERT INTO sach_tac_gia (sach_id, tac_gia_id, vai_tro) VALUES
(1, 1, 'Tác giả'),
(2, 1, 'Tác giả'),
(3, 2, 'Tác giả'),
(4, 3, 'Tác giả'),
(5, 4, 'Tác giả'),
(6, 5, 'Tác giả'),
(7, 1, 'Đồng tác giả'),
(8, 2, 'Tác giả');

-- Lưu ý: bản sao id 6 và id 8 được đặt DANG_MUON để khớp với chi_tiet_phieu_muon
-- id 4 và id 5 (đang mượn). File gốc ghi SAN_SANG nên bị mâu thuẫn.
INSERT INTO ban_sao_sach (id, sach_id, ma_vach, vi_tri_ke, tinh_trang, trang_thai, ngay_nhap) VALUES
(1,  1, 'BC-S001-001', 'A1-01', 'TOT', 'DANG_MUON', '2025-09-01'),
(2,  1, 'BC-S001-002', 'A1-01', 'TOT', 'SAN_SANG',  '2025-09-01'),
(3,  2, 'BC-S002-001', 'A1-02', 'TOT', 'SAN_SANG',  '2025-09-02'),
(4,  2, 'BC-S002-002', 'A1-02', 'CU',  'SAN_SANG',  '2025-09-02'),
(5,  3, 'BC-S003-001', 'B1-01', 'TOT', 'DANG_MUON', '2025-09-03'),
(6,  3, 'BC-S003-002', 'B1-01', 'TOT', 'DANG_MUON', '2025-09-03'),
(7,  4, 'BC-S004-001', 'A2-01', 'TOT', 'SAN_SANG',  '2025-09-04'),
(8,  5, 'BC-S005-001', 'C1-01', 'TOT', 'DANG_MUON', '2025-09-05'),
(9,  6, 'BC-S006-001', 'C1-02', 'TOT', 'SAN_SANG',  '2025-09-06'),
(10, 7, 'BC-S007-001', 'D1-01', 'TOT', 'SAN_SANG',  '2025-09-07'),
(11, 8, 'BC-S008-001', 'B1-02', 'TOT', 'SAN_SANG',  '2025-09-08'),
(12, 8, 'BC-S008-002', 'B1-02', 'TOT', 'SAN_SANG',  '2025-09-08');

INSERT INTO phieu_muon (id, ma_phieu, doc_gia_id, nhan_vien_id, ngay_muon, ghi_chu, trang_thai) VALUES
(1, 'PM2026001', 1, 2, '2026-09-20 09:00:00', 'Mượn sách phục vụ học tập', 'DANG_MUON'),
(2, 'PM2026002', 2, 2, '2026-09-10 14:30:00', 'Mượn sách tham khảo',       'DA_TRA_MOT_PHAN'),
(3, 'PM2026003', 3, 2, '2026-08-01 10:15:00', 'Phiếu mượn đã quá hạn',     'QUA_HAN'),
(4, 'PM2026004', 1, 2, '2026-07-01 08:45:00', 'Phiếu mượn đã hoàn tất',    'DA_TRA');

INSERT INTO chi_tiet_phieu_muon (id, phieu_muon_id, ban_sao_sach_id, ngay_hen_tra, ngay_tra_thuc_te, tinh_trang_luc_muon, tinh_trang_luc_tra, trang_thai, ghi_chu) VALUES
(1, 1, 1, '2026-10-20', NULL,                  'TOT', NULL,  'DANG_MUON', NULL),
(2, 1, 5, '2026-10-20', NULL,                  'TOT', NULL,  'DANG_MUON', NULL),
(3, 2, 3, '2026-10-10', '2026-10-01 10:00:00', 'TOT', 'TOT', 'DA_TRA',    'Đã trả đúng tình trạng'),
(4, 2, 6, '2026-10-10', NULL,                  'TOT', NULL,  'DANG_MUON', NULL),
(5, 3, 8, '2026-08-15', NULL,                  'TOT', NULL,  'DANG_MUON', 'Quá hạn chưa trả'),
(6, 4, 9, '2026-07-15', '2026-07-12 16:00:00', 'TOT', 'TOT', 'DA_TRA',    NULL);

INSERT INTO tien_phat (id, chi_tiet_phieu_muon_id, nhan_vien_id, ly_do, so_tien, ngay_lap, trang_thai, ghi_chu) VALUES
(1, 5, 2, 'QUA_HAN', 50000, '2026-09-01 09:00:00', 'CHUA_THANH_TOAN', 'Phạt quá hạn theo dữ liệu mẫu'),
(2, 6, 2, 'KHAC',    0,     '2026-07-12 16:10:00', 'MIEN_GIAM',       'Không phạt');

INSERT INTO chi_tiet_tien_phat (id, tien_phat_id, so_tien, ngay_thanh_toan, phuong_thuc, ghi_chu) VALUES
(1, 2, 0, '2026-07-12 16:10:00', 'TIEN_MAT', 'Miễn giảm theo dữ liệu mẫu');

INSERT INTO dat_truoc_sach (id, doc_gia_id, sach_id, ngay_dat, ngay_het_han, trang_thai, ghi_chu) VALUES
(1, 2, 4, '2026-10-02 11:00:00', '2026-10-09 11:00:00', 'CHO_XU_LY',  'Đặt trước Clean Code'),
(2, 3, 1, '2026-10-03 08:30:00', '2026-10-10 08:30:00', 'DA_SAN_SANG', 'Chờ nhận sách');

-- ============================================================
-- PHẦN 3. TRUY VẤN KIỂM TRA (bỏ comment từng câu để chạy)
-- ============================================================
-- SELECT * FROM sach;
-- SELECT * FROM doc_gia;
-- SELECT * FROM phieu_muon;
-- SELECT pm.ma_phieu, dg.ho_ten, s.ten_sach, ct.ngay_hen_tra, ct.trang_thai
-- FROM phieu_muon pm
-- JOIN doc_gia dg ON dg.id = pm.doc_gia_id
-- JOIN chi_tiet_phieu_muon ct ON ct.phieu_muon_id = pm.id
-- JOIN ban_sao_sach bs ON bs.id = ct.ban_sao_sach_id
-- JOIN sach s ON s.id = bs.sach_id
-- ORDER BY pm.id, ct.id;

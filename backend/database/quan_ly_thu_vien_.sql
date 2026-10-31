-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 25, 2026 lúc 07:22 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quan_ly_thu_vien`
--

CREATE DATABASE IF NOT EXISTS `quan_ly_thu_vien` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `quan_ly_thu_vien`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ban_sao_sach`
--

CREATE TABLE `ban_sao_sach` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sach_id` bigint(20) UNSIGNED NOT NULL,
  `ma_vach` varchar(40) NOT NULL,
  `vi_tri_ke` varchar(50) DEFAULT NULL,
  `tinh_trang` enum('TOT','CU','HU_HONG','MAT') NOT NULL DEFAULT 'TOT',
  `trang_thai` enum('SAN_SANG','DANG_MUON','DA_DAT_TRUOC','THANH_LY') NOT NULL DEFAULT 'SAN_SANG',
  `ngay_nhap` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ban_sao_sach`
--

INSERT INTO `ban_sao_sach` (`id`, `sach_id`, `ma_vach`, `vi_tri_ke`, `tinh_trang`, `trang_thai`, `ngay_nhap`) VALUES
(1, 1, 'BC001-1', 'Kệ K1-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(2, 1, 'BC001-2', 'Kệ K1-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(3, 2, 'BC002-1', 'Kệ K1-B', 'TOT', 'SAN_SANG', '2026-01-15'),
(4, 2, 'BC002-2', 'Kệ K1-B', 'TOT', 'SAN_SANG', '2026-01-15'),
(5, 3, 'BC003-1', 'Kệ K2-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(6, 4, 'BC004-1', 'Kệ K2-B', 'TOT', 'SAN_SANG', '2026-01-15'),
(7, 5, 'BC005-1', 'Kệ K3-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(8, 6, 'BC006-1', 'Kệ K3-B', 'TOT', 'SAN_SANG', '2026-01-15'),
(9, 7, 'BC007-1', 'Kệ K4-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(10, 8, 'BC008-1', 'Kệ K4-B', 'TOT', 'SAN_SANG', '2026-01-15'),
(11, 9, 'BC009-1', 'Kệ K5-A', 'TOT', 'SAN_SANG', '2026-01-15'),
(12, 10, 'BC010-1', 'Kệ K5-B', 'TOT', 'SAN_SANG', '2026-01-15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_phieu_muon`
--

CREATE TABLE `chi_tiet_phieu_muon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phieu_muon_id` bigint(20) UNSIGNED NOT NULL,
  `ban_sao_sach_id` bigint(20) UNSIGNED NOT NULL,
  `ngay_hen_tra` date NOT NULL,
  `ngay_tra_thuc_te` datetime DEFAULT NULL,
  `tinh_trang_luc_muon` enum('TOT','CU','HU_HONG') NOT NULL DEFAULT 'TOT',
  `tinh_trang_luc_tra` enum('TOT','CU','HU_HONG','MAT') DEFAULT NULL,
  `trang_thai` enum('DANG_MUON','DA_TRA','MAT','HU_HONG') NOT NULL DEFAULT 'DANG_MUON',
  `ghi_chu` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_phieu_muon`
--

INSERT INTO `chi_tiet_phieu_muon` (`id`, `phieu_muon_id`, `ban_sao_sach_id`, `ngay_hen_tra`, `ngay_tra_thuc_te`, `tinh_trang_luc_muon`, `tinh_trang_luc_tra`, `trang_thai`, `ghi_chu`) VALUES
(1, 1, 1, '2026-10-24', NULL, 'TOT', NULL, 'DANG_MUON', 'Trễ hạn 1 ngày'),
(2, 2, 3, '2026-11-05', NULL, 'TOT', NULL, 'DANG_MUON', 'Đang mượn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_tien_phat`
--

CREATE TABLE `chi_tiet_tien_phat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tien_phat_id` bigint(20) UNSIGNED NOT NULL,
  `so_tien` decimal(12,2) NOT NULL,
  `ngay_thanh_toan` datetime NOT NULL DEFAULT current_timestamp(),
  `phuong_thuc` enum('TIEN_MAT','CHUYEN_KHOAN','THE') NOT NULL DEFAULT 'TIEN_MAT',
  `ghi_chu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_tien_phat`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

CREATE TABLE `danh_muc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_danh_muc` varchar(100) NOT NULL,
  `mo_ta` varchar(500) DEFAULT NULL,
  `danh_muc_cha_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc`
--

INSERT INTO `danh_muc` (`id`, `ten_danh_muc`, `mo_ta`, `danh_muc_cha_id`) VALUES
(1, 'Lập trình', 'Sách lập trình và phát triển phần mềm', NULL),
(2, 'Cơ sở dữ liệu', 'Sách về thiết kế và quản trị cơ sở dữ liệu', NULL),
(3, 'Văn học', 'Tác phẩm văn học trong và ngoài nước', NULL),
(4, 'Kỹ năng', 'Sách kỹ năng học tập và phát triển bản thân', NULL),
(5, 'Kinh tế - Kinh doanh', 'Sách về kinh tế, marketing, quản trị và khởi nghiệp', NULL),
(6, 'Ngoại ngữ', 'Sách học tiếng Anh và ngoại ngữ', NULL),
(7, 'Khoa học', 'Sách khoa học, vật lý và khám phá tự nhiên', NULL),
(8, 'Tâm lý học', 'Sách về tâm lý và hành vi con người', NULL),
(9, 'Giáo dục - Nuôi dạy con', 'Sách về giáo dục và phương pháp nuôi dạy trẻ', NULL),
(10, 'Sức khỏe - Dinh dưỡng', 'Sách về sức khỏe và chế độ dinh dưỡng', NULL),
(11, 'Công nghệ thông tin', 'Sách về AI, an toàn thông tin, mạng máy tính và công nghệ', NULL),
(12, 'Lịch sử - Khám phá', 'Sách về lịch sử loài người và khám phá thế giới', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dat_truoc_sach`
--

CREATE TABLE `dat_truoc_sach` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doc_gia_id` bigint(20) UNSIGNED NOT NULL,
  `sach_id` bigint(20) UNSIGNED NOT NULL,
  `ngay_dat` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_het_han` datetime DEFAULT NULL,
  `trang_thai` enum('CHO_XU_LY','DA_SAN_SANG','DA_NHAN','DA_HUY','HET_HAN') NOT NULL DEFAULT 'CHO_XU_LY',
  `ghi_chu` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `dat_truoc_sach`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doc_gia`
--

CREATE TABLE `doc_gia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tai_khoan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ma_doc_gia` varchar(20) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('NAM','NU','KHAC') DEFAULT 'KHAC',
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `ngay_dang_ky` date NOT NULL,
  `trang_thai` enum('HOAT_DONG','BI_KHOA') NOT NULL DEFAULT 'HOAT_DONG',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `doc_gia`
--

INSERT INTO `doc_gia` (`id`, `tai_khoan_id`, `ma_doc_gia`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `so_dien_thoai`, `email`, `dia_chi`, `ngay_dang_ky`, `trang_thai`, `ngay_tao`) VALUES
(1, 3, 'DG001', 'Lê Minh Châu', '2003-04-15', 'NU', '0912000001', 'chau@example.com', 'Thủ Đức, TP. Hồ Chí Minh', '2026-01-10', 'HOAT_DONG', '2026-10-22 14:57:00'),
(2, 4, 'DG002', 'Phạm Quốc Huy', '2002-11-20', 'NAM', '0912000002', 'huy@example.com', 'Gò Vấp, TP. Hồ Chí Minh', '2026-02-05', 'HOAT_DONG', '2026-10-22 14:57:00'),
(3, 5, 'DG003', 'Võ Ngọc Mai', '2004-08-09', 'NU', '0912000003', 'mai@example.com', 'Bình Thạnh, TP. Hồ Chí Minh', '2026-03-12', 'HOAT_DONG', '2026-10-22 14:57:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tai_khoan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ma_nhan_vien` varchar(20) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `chuc_vu` enum('QUAN_TRI','THU_THU') NOT NULL DEFAULT 'THU_THU',
  `trang_thai` enum('DANG_LAM','NGHI_VIEC') NOT NULL DEFAULT 'DANG_LAM',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`id`, `tai_khoan_id`, `ma_nhan_vien`, `ho_ten`, `so_dien_thoai`, `email`, `dia_chi`, `chuc_vu`, `trang_thai`, `ngay_tao`) VALUES
(1, 1, 'NV001', 'Nguyễn Văn An', '0901000001', 'an.admin@example.com', 'Quận 1, TP. Hồ Chí Minh', 'QUAN_TRI', 'DANG_LAM', '2026-10-22 14:57:00'),
(2, 2, 'NV002', 'Trần Thị Bình', '0901000002', 'binh.thuthu@example.com', 'Thủ Đức, TP. Hồ Chí Minh', 'THU_THU', 'DANG_LAM', '2026-10-22 14:57:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nha_xuat_ban`
--

CREATE TABLE `nha_xuat_ban` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_nha_xuat_ban` varchar(150) NOT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nha_xuat_ban`
--

INSERT INTO `nha_xuat_ban` (`id`, `ten_nha_xuat_ban`, `dia_chi`, `so_dien_thoai`, `email`) VALUES
(1, 'Nhà Xuất Bản Trẻ', 'TP. Hồ Chí Minh', '02811110001', 'lienhe@nxbtre.example'),
(2, 'Nhà Xuất Bản Giáo Dục Việt Nam', 'Hà Nội', '02411110002', 'lienhe@nxbgd.example'),
(3, 'Nhà Xuất Bản Tổng Hợp TP.HCM', 'TP. Hồ Chí Minh', '02811110003', 'lienhe@tonghop.example');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_muon`
--

CREATE TABLE `phieu_muon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_phieu` varchar(30) NOT NULL,
  `doc_gia_id` bigint(20) UNSIGNED NOT NULL,
  `nhan_vien_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ngay_muon` datetime NOT NULL,
  `ghi_chu` varchar(500) DEFAULT NULL,
  `trang_thai` enum('DANG_MUON','DA_TRA_MOT_PHAN','DA_TRA','QUA_HAN','DA_HUY') NOT NULL DEFAULT 'DANG_MUON',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_muon`
--

INSERT INTO `phieu_muon` (`id`, `ma_phieu`, `doc_gia_id`, `nhan_vien_id`, `ngay_muon`, `ghi_chu`, `trang_thai`, `ngay_tao`) VALUES
(1, 'PM-20261020-001', 1, 2, '2026-10-10 09:00:00', 'Mượn sách học tập', 'QUA_HAN', '2026-10-10 09:00:00'),
(2, 'PM-20261022-002', 2, 2, '2026-10-22 14:00:00', 'Mượn sách văn học', 'DANG_MUON', '2026-10-22 14:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sach`
--

CREATE TABLE `sach` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_sach` varchar(30) NOT NULL,
  `ten_sach` varchar(200) NOT NULL,
  `danh_muc_id` bigint(20) UNSIGNED NOT NULL,
  `nha_xuat_ban_id` bigint(20) UNSIGNED DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `nam_xuat_ban` year(4) DEFAULT NULL,
  `lan_tai_ban` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `ngon_ngu` varchar(50) DEFAULT 'Tiếng Việt',
  `mo_ta` text DEFAULT NULL,
  `gia_tien` decimal(12,2) NOT NULL DEFAULT 0.00,
  `so_trang` int(10) UNSIGNED DEFAULT NULL,
  `anh_bia` varchar(255) DEFAULT NULL,
  `trang_thai` enum('DANG_LUU_HANH','NGUNG_LUU_HANH') NOT NULL DEFAULT 'DANG_LUU_HANH',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sach`
--

INSERT INTO `sach` (`id`, `ma_sach`, `ten_sach`, `danh_muc_id`, `nha_xuat_ban_id`, `isbn`, `nam_xuat_ban`, `lan_tai_ban`, `ngon_ngu`, `mo_ta`, `gia_tien`, `so_trang`, `anh_bia`, `trang_thai`, `ngay_tao`) VALUES
(1, 'DEMO001', 'Đắc Nhân Tâm', 4, 3, '9786040000019', '2020', 1, 'Tiếng Việt', 'Nghệ thuật giao tiếp và ứng xử trong cuộc sống', 85000.00, 320, 'DEMO001.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(2, 'DEMO002', 'Nhà Giả Kim', 3, 1, '9786040000026', '2021', 1, 'Tiếng Việt', 'Tiểu thuyết về hành trình theo đuổi ước mơ', 79000.00, 228, 'DEMO002.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(3, 'DEMO003', 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 4, 3, '9786040000033', '2020', 1, 'Tiếng Việt', 'Sách về học tập và phát triển bản thân', 75000.00, 285, 'DEMO003.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(4, 'DEMO004', 'Tôi Tài Giỏi, Bạn Cũng Thế', 4, 3, '9786040000040', '2022', 1, 'Tiếng Việt', 'Phương pháp học tập và rèn luyện tư duy', 110000.00, 300, 'DEMO004.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(5, 'DEMO005', 'Đời Ngắn Đừng Ngủ Dài', 4, 3, '9786040000057', '2021', 1, 'Tiếng Việt', 'Những bài học giúp sống tích cực hơn', 68000.00, 228, 'DEMO005.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(6, 'DEMO006', 'Đi Tìm Lẽ Sống', 4, 3, '9786040000064', '2020', 1, 'Tiếng Việt', 'Suy ngẫm về ý nghĩa và mục đích cuộc sống', 85000.00, 224, 'DEMO006.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(7, 'DEMO007', 'Không Gia Đình', 3, 1, '9786040000071', '2019', 1, 'Tiếng Việt', 'Tác phẩm văn học kể về hành trình của một cậu bé', 95000.00, 600, 'DEMO007.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(8, 'DEMO008', 'Dế Mèn Phiêu Lưu Ký', 3, 1, '9786040000088', '2020', 1, 'Tiếng Việt', 'Tác phẩm văn học thiếu nhi Việt Nam', 55000.00, 180, 'DEMO008.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(9, 'DEMO009', 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 3, 1, '9786040000095', '2021', 1, 'Tiếng Việt', 'Tác phẩm về tuổi thơ và ký ức', 70000.00, 208, 'DEMO009.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(10, 'DEMO010', 'Mắt Biếc', 3, 1, '9786040000101', '2020', 1, 'Tiếng Việt', 'Tiểu thuyết tình cảm của Nguyễn Nhật Ánh', 90000.00, 300, 'DEMO010.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(11, 'DEMO011', 'Tắt Đèn', 3, 1, '9786040000118', '2019', 1, 'Tiếng Việt', 'Tác phẩm văn học hiện thực Việt Nam', 60000.00, 200, 'DEMO011.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(12, 'DEMO012', 'Lão Hạc', 3, 1, '9786040000125', '2020', 1, 'Tiếng Việt', 'Truyện ngắn tiêu biểu của Nam Cao', 35000.00, 120, 'DEMO012.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(13, 'DEMO013', 'Số Đỏ', 3, 1, '9786040000132', '2021', 1, 'Tiếng Việt', 'Tiểu thuyết trào phúng của Vũ Trọng Phụng', 75000.00, 280, 'DEMO013.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(14, 'DEMO014', 'Vợ Nhặt', 3, 1, '9786040000149', '2020', 1, 'Tiếng Việt', 'Tác phẩm văn học về con người trong nạn đói', 40000.00, 150, 'DEMO014.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(15, 'DEMO015', 'Chí Phèo', 3, 1, '9786040000156', '2019', 1, 'Tiếng Việt', 'Truyện ngắn về số phận người nông dân', 38000.00, 130, 'DEMO015.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(16, 'DEMO016', 'Lập Trình C Cơ Bản', 1, 2, '9786040000163', '2022', 1, 'Tiếng Việt', 'Giới thiệu cú pháp và kiến thức lập trình C', 120000.00, 350, 'DEMO016.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(17, 'DEMO017', 'Cấu Trúc Dữ Liệu Và Giải Thuật', 1, 2, '9786040000170', '2022', 1, 'Tiếng Việt', 'Các cấu trúc dữ liệu và thuật toán cơ bản', 145000.00, 420, 'DEMO017.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(18, 'DEMO018', 'Giáo Trình Cơ Sở Dữ Liệu', 2, 2, '9786040000187', '2021', 1, 'Tiếng Việt', 'Kiến thức thiết kế và truy vấn cơ sở dữ liệu', 130000.00, 380, 'DEMO018.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(19, 'DEMO019', 'Lập Trình Java Cơ Bản', 1, 2, '9786040000194', '2023', 1, 'Tiếng Việt', 'Hướng dẫn lập trình Java cho người mới', 135000.00, 400, 'DEMO019.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(20, 'DEMO020', 'Lập Trình Python Cho Người Mới Bắt Đầu', 1, 2, '9786040000200', '2023', 1, 'Tiếng Việt', 'Học Python qua ví dụ thực hành', 125000.00, 360, 'DEMO020.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(21, 'DEMO021', 'Phân Tích Và Thiết Kế Hệ Thống', 1, 2, '9786040000217', '2022', 1, 'Tiếng Việt', 'Phương pháp phân tích và thiết kế hệ thống thông tin', 140000.00, 390, 'DEMO021.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(22, 'DEMO022', 'Phát Triển Ứng Dụng Web', 1, 2, '9786040000224', '2023', 1, 'Tiếng Việt', 'Kiến thức nền tảng xây dựng ứng dụng web', 150000.00, 450, 'DEMO022.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(23, 'DEMO023', 'Nhập Môn Trí Tuệ Nhân Tạo', 11, 2, '9786040000231', '2023', 1, 'Tiếng Việt', 'Tổng quan về trí tuệ nhân tạo và ứng dụng', 160000.00, 400, 'DEMO023.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(24, 'DEMO024', 'An Toàn Thông Tin Cơ Bản', 11, 2, '9786040000248', '2022', 1, 'Tiếng Việt', 'Kiến thức bảo vệ dữ liệu và hệ thống máy tính', 125000.00, 320, 'DEMO024.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(25, 'DEMO025', 'Mạng Máy Tính', 11, 2, '9786040000255', '2021', 1, 'Tiếng Việt', 'Nguyên lý mạng máy tính và giao thức mạng', 135000.00, 380, 'DEMO025.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(26, 'DEMO026', 'Tư Duy Nhanh Và Chậm', 8, 3, '9786040000262', '2021', 1, 'Tiếng Việt', 'Khám phá cách con người suy nghĩ và ra quyết định', 150000.00, 600, 'DEMO026.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(27, 'DEMO027', '7 Thói Quen Hiệu Quả', 4, 3, '9786040000279', '2020', 1, 'Tiếng Việt', 'Các nguyên tắc rèn luyện bản thân và làm việc hiệu quả', 135000.00, 450, 'DEMO027.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(28, 'DEMO028', 'Nghĩ Giàu Và Làm Giàu', 5, 3, '9786040000286', '2020', 1, 'Tiếng Việt', 'Tư duy thành công và phát triển tài chính cá nhân', 90000.00, 320, 'DEMO028.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(29, 'DEMO029', 'Người Giàu Có Nhất Thành Babylon', 5, 3, '9786040000293', '2021', 1, 'Tiếng Việt', 'Bài học quản lý tiền bạc và tích lũy tài sản', 65000.00, 220, 'DEMO029.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(30, 'DEMO030', 'Khởi Nghiệp Tinh Gọn', 5, 3, '9786040000309', '2022', 1, 'Tiếng Việt', 'Phương pháp xây dựng và kiểm chứng ý tưởng kinh doanh', 125000.00, 300, 'DEMO030.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(31, 'DEMO031', 'Marketing Căn Bản', 5, 3, '9786040000316', '2022', 1, 'Tiếng Việt', 'Những nguyên lý marketing dành cho người mới', 110000.00, 350, 'DEMO031.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(32, 'DEMO032', 'Quản Trị Học', 5, 3, '9786040000323', '2021', 1, 'Tiếng Việt', 'Kiến thức nền tảng về quản trị tổ chức', 130000.00, 400, 'DEMO032.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(33, 'DEMO033', 'Kinh Tế Vi Mô', 5, 3, '9786040000330', '2022', 1, 'Tiếng Việt', 'Các nguyên lý kinh tế vi mô cơ bản', 120000.00, 360, 'DEMO033.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(34, 'DEMO034', 'Kinh Tế Vĩ Mô', 5, 3, '9786040000347', '2022', 1, 'Tiếng Việt', 'Tổng quan kinh tế vĩ mô và chính sách kinh tế', 125000.00, 370, 'DEMO034.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(35, 'DEMO035', 'Tiếng Anh Giao Tiếp Hằng Ngày', 6, 2, '9786040000354', '2023', 1, 'Tiếng Việt', 'Mẫu câu tiếng Anh giao tiếp thông dụng', 80000.00, 250, 'DEMO035.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(36, 'DEMO036', 'Ngữ Pháp Tiếng Anh Cơ Bản', 6, 2, '9786040000361', '2022', 1, 'Tiếng Việt', 'Tổng hợp ngữ pháp tiếng Anh cơ bản', 90000.00, 300, 'DEMO036.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(37, 'DEMO037', 'Từ Vựng Tiếng Anh Theo Chủ Đề', 6, 2, '9786040000378', '2023', 1, 'Tiếng Việt', 'Từ vựng tiếng Anh theo các chủ đề thường gặp', 75000.00, 240, 'DEMO037.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(38, 'DEMO038', 'Oxford Word Skills Basic', 6, 2, '9786040000385', '2021', 1, 'Tiếng Anh', 'Tài liệu học từ vựng tiếng Anh trình độ cơ bản', 180000.00, 256, 'DEMO038.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(39, 'DEMO039', 'English Grammar in Use', 6, 2, '9786040000392', '2021', 1, 'Tiếng Anh', 'Sách luyện ngữ pháp tiếng Anh', 220000.00, 390, 'DEMO039.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(40, 'DEMO040', 'Lược Sử Thời Gian', 7, 1, '9786040000408', '2020', 1, 'Tiếng Việt', 'Khám phá những câu hỏi lớn về vũ trụ và thời gian', 115000.00, 280, 'DEMO040.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(41, 'DEMO041', 'Vũ Trụ Trong Vỏ Hạt Dẻ', 7, 1, '9786040000415', '2021', 1, 'Tiếng Việt', 'Giới thiệu các ý tưởng vật lý hiện đại', 140000.00, 250, 'DEMO041.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(42, 'DEMO042', 'Sapiens: Lược Sử Loài Người', 12, 1, '9786040000422', '2021', 1, 'Tiếng Việt', 'Hành trình lịch sử phát triển của loài người', 180000.00, 550, 'DEMO042.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(43, 'DEMO043', 'Lược Sử Vạn Vật', 12, 1, '9786040000439', '2020', 1, 'Tiếng Việt', 'Khám phá lịch sử hình thành thế giới tự nhiên', 160000.00, 500, 'DEMO043.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(44, 'DEMO044', 'Bí Mật Của Nước', 7, 1, '9786040000446', '2020', 1, 'Tiếng Việt', 'Tìm hiểu về nước và vai trò của nước trong đời sống', 95000.00, 240, 'DEMO044.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(45, 'DEMO045', 'Tâm Lý Học Đám Đông', 8, 3, '9786040000453', '2021', 1, 'Tiếng Việt', 'Nghiên cứu hành vi con người trong đám đông', 85000.00, 280, 'DEMO045.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(46, 'DEMO046', 'Nuôi Dạy Con Bằng Yêu Thương', 9, 3, '9786040000460', '2022', 1, 'Tiếng Việt', 'Gợi ý phương pháp nuôi dạy con tích cực', 95000.00, 280, 'DEMO046.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(47, 'DEMO047', 'Ăn Uống Lành Mạnh', 10, 3, '9786040000477', '2023', 1, 'Tiếng Việt', 'Kiến thức cơ bản về dinh dưỡng và thói quen ăn uống', 90000.00, 260, 'DEMO047.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(48, 'DEMO048', 'Thiết Kế UX/UI Cơ Bản', 11, 2, '9786040000484', '2023', 1, 'Tiếng Việt', 'Nguyên tắc thiết kế giao diện và trải nghiệm người dùng', 145000.00, 360, 'DEMO048.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(49, 'DEMO049', 'Học Git Và GitHub', 1, 2, '9786040000491', '2023', 1, 'Tiếng Việt', 'Hướng dẫn quản lý mã nguồn bằng Git và GitHub', 85000.00, 220, 'DEMO049.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28'),
(50, 'DEMO050', 'Nhập Môn Điện Toán Đám Mây', 11, 2, '9786040000507', '2023', 1, 'Tiếng Việt', 'Tổng quan về dịch vụ và kiến trúc điện toán đám mây', 150000.00, 380, 'DEMO050.jpg', 'DANG_LUU_HANH', '2026-10-23 01:50:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sach_tac_gia`
--

CREATE TABLE `sach_tac_gia` (
  `sach_id` bigint(20) UNSIGNED NOT NULL,
  `tac_gia_id` bigint(20) UNSIGNED NOT NULL,
  `vai_tro` varchar(50) NOT NULL DEFAULT 'Tác giả'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sach_tac_gia`
--

INSERT INTO `sach_tac_gia` (`sach_id`, `tac_gia_id`, `vai_tro`) VALUES
(1, 6, 'Tác giả'),
(2, 7, 'Tác giả'),
(3, 8, 'Tác giả'),
(4, 9, 'Tác giả'),
(5, 10, 'Tác giả'),
(6, 11, 'Tác giả'),
(7, 12, 'Tác giả'),
(8, 4, 'Tác giả'),
(9, 5, 'Tác giả'),
(10, 5, 'Tác giả'),
(11, 13, 'Tác giả'),
(12, 14, 'Tác giả'),
(13, 15, 'Tác giả'),
(14, 16, 'Tác giả'),
(15, 14, 'Tác giả'),
(16, 1, 'Tác giả'),
(17, 1, 'Tác giả'),
(18, 2, 'Tác giả'),
(19, 1, 'Tác giả'),
(20, 1, 'Tác giả'),
(21, 2, 'Tác giả'),
(22, 1, 'Tác giả'),
(23, 1, 'Tác giả'),
(24, 1, 'Tác giả'),
(25, 1, 'Tác giả'),
(26, 17, 'Tác giả'),
(27, 18, 'Tác giả'),
(28, 19, 'Tác giả'),
(29, 20, 'Tác giả'),
(30, 21, 'Tác giả'),
(31, 22, 'Tác giả'),
(32, 24, 'Tác giả'),
(33, 23, 'Tác giả'),
(34, 23, 'Tác giả'),
(35, 25, 'Tác giả'),
(36, 25, 'Tác giả'),
(37, 25, 'Tác giả'),
(38, 26, 'Tác giả'),
(38, 27, 'Đồng tác giả'),
(39, 28, 'Tác giả'),
(40, 29, 'Tác giả'),
(41, 29, 'Tác giả'),
(42, 30, 'Tác giả'),
(43, 31, 'Tác giả'),
(44, 32, 'Tác giả'),
(45, 33, 'Tác giả'),
(46, 34, 'Tác giả'),
(47, 34, 'Tác giả'),
(48, 1, 'Tác giả'),
(49, 1, 'Tác giả'),
(50, 1, 'Tác giả');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tac_gia`
--

CREATE TABLE `tac_gia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_tac_gia` varchar(120) NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `quoc_tich` varchar(80) DEFAULT NULL,
  `tieu_su` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tac_gia`
--

INSERT INTO `tac_gia` (`id`, `ten_tac_gia`, `ngay_sinh`, `quoc_tich`, `tieu_su`) VALUES
(1, 'Nguyễn Văn A', '1980-01-01', 'Việt Nam', 'Tác giả sách công nghệ.'),
(2, 'Trần Thị B', '1975-05-12', 'Việt Nam', 'Tác giả sách cơ sở dữ liệu.'),
(3, 'Robert C. Martin', '1952-12-05', 'Hoa Kỳ', 'Tác giả sách về kỹ thuật phần mềm.'),
(4, 'Tô Hoài', '1920-09-27', 'Việt Nam', 'Nhà văn Việt Nam.'),
(5, 'Nguyễn Nhật Ánh', '1955-05-07', 'Việt Nam', 'Nhà văn Việt Nam.'),
(6, 'Dale Carnegie', '1888-11-24', 'Hoa Kỳ', 'Nhà văn và diễn giả người Mỹ, chuyên về kỹ năng giao tiếp.'),
(7, 'Paulo Coelho', '1947-08-24', 'Brazil', 'Nhà văn người Brazil, tác giả tiểu thuyết Nhà Giả Kim.'),
(8, 'Rosie Nguyễn', NULL, 'Việt Nam', 'Tác giả sách kỹ năng và phát triển bản thân.'),
(9, 'Adam Khoo', NULL, 'Singapore', 'Doanh nhân và tác giả sách phát triển bản thân.'),
(10, 'Robin Sharma', '1964-06-16', 'Canada', 'Tác giả và diễn giả về lãnh đạo, phát triển bản thân.'),
(11, 'Viktor E. Frankl', '1905-03-26', 'Áo', 'Bác sĩ tâm thần, nhà sáng lập liệu pháp ý nghĩa.'),
(12, 'Hector Malot', '1830-05-20', 'Pháp', 'Nhà văn Pháp, tác giả tiểu thuyết Không Gia Đình.'),
(13, 'Ngô Tất Tố', '1893-04-20', 'Việt Nam', 'Nhà văn hiện thực Việt Nam, tác giả Tắt Đèn.'),
(14, 'Nam Cao', '1915-10-29', 'Việt Nam', 'Nhà văn hiện thực Việt Nam, tác giả Lão Hạc, Chí Phèo.'),
(15, 'Vũ Trọng Phụng', '1912-10-20', 'Việt Nam', 'Nhà văn trào phúng Việt Nam, tác giả Số Đỏ.'),
(16, 'Kim Lân', '1920-08-01', 'Việt Nam', 'Nhà văn Việt Nam, tác giả truyện ngắn Vợ Nhặt.'),
(17, 'Daniel Kahneman', '1934-03-05', 'Israel - Hoa Kỳ', 'Nhà tâm lý học, đoạt giải Nobel Kinh tế năm 2002.'),
(18, 'Stephen R. Covey', '1932-10-24', 'Hoa Kỳ', 'Tác giả và nhà tư vấn quản lý người Mỹ.'),
(19, 'Napoleon Hill', '1883-10-26', 'Hoa Kỳ', 'Tác giả sách về tư duy thành công người Mỹ.'),
(20, 'George S. Clason', '1874-11-07', 'Hoa Kỳ', 'Tác giả sách về quản lý tài chính cá nhân người Mỹ.'),
(21, 'Eric Ries', '1978-09-22', 'Hoa Kỳ', 'Doanh nhân và tác giả phương pháp khởi nghiệp tinh gọn.'),
(22, 'Philip Kotler', '1931-05-27', 'Hoa Kỳ', 'Giáo sư marketing, được xem là cha đẻ marketing hiện đại.'),
(23, 'N. Gregory Mankiw', '1958-02-03', 'Hoa Kỳ', 'Giáo sư kinh tế Đại học Harvard.'),
(24, 'Lê Văn C', '1982-03-15', 'Việt Nam', 'Tác giả giáo trình kinh tế - quản trị (dữ liệu mẫu).'),
(25, 'Phạm Thị D', '1985-07-20', 'Việt Nam', 'Tác giả sách học ngoại ngữ (dữ liệu mẫu).'),
(26, 'Ruth Gairns', NULL, 'Anh', 'Tác giả sách giảng dạy từ vựng tiếng Anh.'),
(27, 'Stuart Redman', NULL, 'Anh', 'Tác giả sách giảng dạy từ vựng tiếng Anh.'),
(28, 'Raymond Murphy', NULL, 'Anh', 'Tác giả bộ sách ngữ pháp tiếng Anh nổi tiếng.'),
(29, 'Stephen Hawking', '1942-01-08', 'Anh', 'Nhà vật lý lý thuyết và tác giả sách khoa học phổ thông.'),
(30, 'Yuval Noah Harari', '1976-02-24', 'Israel', 'Nhà sử học và tác giả sách về lịch sử loài người.'),
(31, 'Bill Bryson', '1951-12-08', 'Hoa Kỳ', 'Nhà văn chuyên viết sách du ký và khoa học phổ thông.'),
(32, 'Masaru Emoto', '1943-07-22', 'Nhật Bản', 'Tác giả người Nhật nổi tiếng với các nghiên cứu về nước.'),
(33, 'Gustave Le Bon', '1841-05-07', 'Pháp', 'Nhà tâm lý học xã hội người Pháp.'),
(34, 'Hoàng Văn E', '1978-11-02', 'Việt Nam', 'Tác giả sách giáo dục và sức khỏe (dữ liệu mẫu).');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_dang_nhap` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL COMMENT 'Mật khẩu đã băm bcrypt',
  `vai_tro` enum('QUAN_TRI','THU_THU','DOC_GIA') NOT NULL DEFAULT 'DOC_GIA',
  `trang_thai` enum('HOAT_DONG','KHOA') NOT NULL DEFAULT 'HOAT_DONG',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tai_khoan`
--

INSERT INTO `tai_khoan` (`id`, `ten_dang_nhap`, `mat_khau`, `vai_tro`, `trang_thai`, `ngay_tao`) VALUES
(1, 'admin', '$2y$12$TFhubh2I0.6bRALEr96vne1UEemMd12BveY71IdHSyuPjKhulnQ0u', 'QUAN_TRI', 'HOAT_DONG', '2026-10-22 14:57:00'),
(2, 'thuthu01', '$2y$12$c6pApX.qQYox3pPgj3K5gubRL1.TgHCeOkHuH5MwbwulBYVfMHTsm', 'THU_THU', 'HOAT_DONG', '2026-10-22 14:57:00'),
(3, 'docgia01', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA', 'HOAT_DONG', '2026-10-22 14:57:00'),
(4, 'docgia02', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA', 'HOAT_DONG', '2026-10-22 14:57:00'),
(5, 'docgia03', '$2y$12$9vqRoDIcDtJ.9tLYXOYO7uNWu7g2m6tz1MXVJO8eDUM7nH92UHM5O', 'DOC_GIA', 'HOAT_DONG', '2026-10-22 14:57:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `the_thu_vien`
--

CREATE TABLE `the_thu_vien` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doc_gia_id` bigint(20) UNSIGNED NOT NULL,
  `so_the` varchar(30) NOT NULL,
  `ngay_cap` date NOT NULL,
  `ngay_het_han` date NOT NULL,
  `trang_thai` enum('CON_HAN','HET_HAN','BI_KHOA') NOT NULL DEFAULT 'CON_HAN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `the_thu_vien`
--

INSERT INTO `the_thu_vien` (`id`, `doc_gia_id`, `so_the`, `ngay_cap`, `ngay_het_han`, `trang_thai`) VALUES
(1, 1, 'THE0001', '2026-01-10', '2027-01-10', 'CON_HAN'),
(2, 2, 'THE0002', '2026-02-05', '2027-02-05', 'CON_HAN'),
(3, 3, 'THE0003', '2026-03-12', '2027-03-12', 'CON_HAN');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tien_phat`
--

CREATE TABLE `tien_phat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chi_tiet_phieu_muon_id` bigint(20) UNSIGNED NOT NULL,
  `nhan_vien_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ly_do` enum('QUA_HAN','HU_HONG','LAM_MAT','KHAC') NOT NULL,
  `so_tien` decimal(12,2) NOT NULL DEFAULT 0.00,
  `ngay_lap` datetime NOT NULL DEFAULT current_timestamp(),
  `trang_thai` enum('CHUA_THANH_TOAN','DA_THANH_TOAN','MIEN_GIAM') NOT NULL DEFAULT 'CHUA_THANH_TOAN',
  `ghi_chu` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tien_phat`
--

INSERT INTO `tien_phat` (`id`, `chi_tiet_phieu_muon_id`, `nhan_vien_id`, `ly_do`, `so_tien`, `ngay_lap`, `trang_thai`, `ghi_chu`) VALUES
(1, 1, 2, 'QUA_HAN', 25000.00, '2026-10-25 08:00:00', 'CHUA_THANH_TOAN', 'Nộp phạt trễ hạn sách Đắc Nhân Tâm (25.000đ)'),
(2, 1, 2, 'HU_HONG', 50000.00, '2026-10-25 08:30:00', 'CHUA_THANH_TOAN', 'Phí bồi thường trang sách rách nhẹ (50.000đ)');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ban_sao_sach`
--
ALTER TABLE `ban_sao_sach`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_vach` (`ma_vach`),
  ADD KEY `fk_ban_sao_sach` (`sach_id`);

--
-- Chỉ mục cho bảng `chi_tiet_phieu_muon`
--
ALTER TABLE `chi_tiet_phieu_muon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_chi_tiet_phieu_ban_sao` (`phieu_muon_id`,`ban_sao_sach_id`),
  ADD KEY `fk_ctpm_ban_sao` (`ban_sao_sach_id`);

--
-- Chỉ mục cho bảng `chi_tiet_tien_phat`
--
ALTER TABLE `chi_tiet_tien_phat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cttp_tien_phat` (`tien_phat_id`);

--
-- Chỉ mục cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`),
  ADD KEY `fk_danh_muc_cha` (`danh_muc_cha_id`);

--
-- Chỉ mục cho bảng `dat_truoc_sach`
--
ALTER TABLE `dat_truoc_sach`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dat_truoc_doc_gia` (`doc_gia_id`),
  ADD KEY `fk_dat_truoc_sach` (`sach_id`);

--
-- Chỉ mục cho bảng `doc_gia`
--
ALTER TABLE `doc_gia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_doc_gia` (`ma_doc_gia`),
  ADD UNIQUE KEY `tai_khoan_id` (`tai_khoan_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_nhan_vien` (`ma_nhan_vien`),
  ADD UNIQUE KEY `tai_khoan_id` (`tai_khoan_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `nha_xuat_ban`
--
ALTER TABLE `nha_xuat_ban`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_nha_xuat_ban` (`ten_nha_xuat_ban`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `phieu_muon`
--
ALTER TABLE `phieu_muon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_phieu` (`ma_phieu`),
  ADD KEY `fk_phieu_doc_gia` (`doc_gia_id`),
  ADD KEY `fk_phieu_nhan_vien` (`nhan_vien_id`);

--
-- Chỉ mục cho bảng `sach`
--
ALTER TABLE `sach`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_sach` (`ma_sach`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `fk_sach_danh_muc` (`danh_muc_id`),
  ADD KEY `fk_sach_nxb` (`nha_xuat_ban_id`);

--
-- Chỉ mục cho bảng `sach_tac_gia`
--
ALTER TABLE `sach_tac_gia`
  ADD PRIMARY KEY (`sach_id`,`tac_gia_id`),
  ADD KEY `fk_stg_tac_gia` (`tac_gia_id`);

--
-- Chỉ mục cho bảng `tac_gia`
--
ALTER TABLE `tac_gia`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`);

--
-- Chỉ mục cho bảng `the_thu_vien`
--
ALTER TABLE `the_thu_vien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doc_gia_id` (`doc_gia_id`),
  ADD UNIQUE KEY `so_the` (`so_the`);

--
-- Chỉ mục cho bảng `tien_phat`
--
ALTER TABLE `tien_phat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tien_phat_chi_tiet` (`chi_tiet_phieu_muon_id`),
  ADD KEY `fk_tien_phat_nhan_vien` (`nhan_vien_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ban_sao_sach`
--
ALTER TABLE `ban_sao_sach`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_phieu_muon`
--
ALTER TABLE `chi_tiet_phieu_muon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chi_tiet_tien_phat`
--
ALTER TABLE `chi_tiet_tien_phat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `dat_truoc_sach`
--
ALTER TABLE `dat_truoc_sach`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `doc_gia`
--
ALTER TABLE `doc_gia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `nha_xuat_ban`
--
ALTER TABLE `nha_xuat_ban`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phieu_muon`
--
ALTER TABLE `phieu_muon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `sach`
--
ALTER TABLE `sach`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `tac_gia`
--
ALTER TABLE `tac_gia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `the_thu_vien`
--
ALTER TABLE `the_thu_vien`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `tien_phat`
--
ALTER TABLE `tien_phat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ban_sao_sach`
--
ALTER TABLE `ban_sao_sach`
  ADD CONSTRAINT `fk_ban_sao_sach` FOREIGN KEY (`sach_id`) REFERENCES `sach` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chi_tiet_phieu_muon`
--
ALTER TABLE `chi_tiet_phieu_muon`
  ADD CONSTRAINT `fk_ctpm_ban_sao` FOREIGN KEY (`ban_sao_sach_id`) REFERENCES `ban_sao_sach` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctpm_phieu` FOREIGN KEY (`phieu_muon_id`) REFERENCES `phieu_muon` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `chi_tiet_tien_phat`
--
ALTER TABLE `chi_tiet_tien_phat`
  ADD CONSTRAINT `fk_cttp_tien_phat` FOREIGN KEY (`tien_phat_id`) REFERENCES `tien_phat` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD CONSTRAINT `fk_danh_muc_cha` FOREIGN KEY (`danh_muc_cha_id`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dat_truoc_sach`
--
ALTER TABLE `dat_truoc_sach`
  ADD CONSTRAINT `fk_dat_truoc_doc_gia` FOREIGN KEY (`doc_gia_id`) REFERENCES `doc_gia` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dat_truoc_sach` FOREIGN KEY (`sach_id`) REFERENCES `sach` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `doc_gia`
--
ALTER TABLE `doc_gia`
  ADD CONSTRAINT `fk_doc_gia_tai_khoan` FOREIGN KEY (`tai_khoan_id`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD CONSTRAINT `fk_nhan_vien_tai_khoan` FOREIGN KEY (`tai_khoan_id`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phieu_muon`
--
ALTER TABLE `phieu_muon`
  ADD CONSTRAINT `fk_phieu_doc_gia` FOREIGN KEY (`doc_gia_id`) REFERENCES `doc_gia` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phieu_nhan_vien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sach`
--
ALTER TABLE `sach`
  ADD CONSTRAINT `fk_sach_danh_muc` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sach_nxb` FOREIGN KEY (`nha_xuat_ban_id`) REFERENCES `nha_xuat_ban` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sach_tac_gia`
--
ALTER TABLE `sach_tac_gia`
  ADD CONSTRAINT `fk_stg_sach` FOREIGN KEY (`sach_id`) REFERENCES `sach` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_stg_tac_gia` FOREIGN KEY (`tac_gia_id`) REFERENCES `tac_gia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `the_thu_vien`
--
ALTER TABLE `the_thu_vien`
  ADD CONSTRAINT `fk_the_doc_gia` FOREIGN KEY (`doc_gia_id`) REFERENCES `doc_gia` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tien_phat`
--
ALTER TABLE `tien_phat`
  ADD CONSTRAINT `fk_tien_phat_chi_tiet` FOREIGN KEY (`chi_tiet_phieu_muon_id`) REFERENCES `chi_tiet_phieu_muon` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tien_phat_nhan_vien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- ========================================================
-- BẢNG ĐẶT TRƯỚC SÁCH KHI HẾT BẢN SAO TRÊN KỆ
-- ========================================================
CREATE TABLE IF NOT EXISTS `dat_truoc` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sach_id` bigint(20) DEFAULT NULL,
  `doc_gia_id` bigint(20) DEFAULT NULL,
  `ten_doc_gia` varchar(255) DEFAULT NULL,
  `ten_sach` varchar(255) DEFAULT NULL,
  `anh_bia` varchar(500) DEFAULT NULL,
  `ngay_dat` datetime DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'CHO_CO_SACH',
  `ghi_chu` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- BẢNG ĐÁNH GIÁ & NHẬN XÉT SÁCH CỦA ĐỘC GIẢ
-- ========================================================
CREATE TABLE IF NOT EXISTS `danh_gia` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sach_id` bigint(20) DEFAULT NULL,
  `doc_gia_id` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_sao` int(11) DEFAULT 5,
  `noi_dung` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- BẢNG TỦ SÁCH CÁ NHÂN & DANH SÁCH YÊU THÍCH CỦA ĐỘC GIẢ
-- ========================================================
CREATE TABLE IF NOT EXISTS `tu_sach` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `doc_gia_id` bigint(20) NOT NULL,
  `sach_id` bigint(20) NOT NULL,
  `ten_sach` varchar(255) DEFAULT NULL,
  `anh_bia` varchar(500) DEFAULT NULL,
  `tac_gia` varchar(255) DEFAULT NULL,
  `trang_thai_doc` varchar(50) DEFAULT 'YEU_THICH',
  `ghi_chu` text DEFAULT NULL,
  `ngay_them` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_docgia_sach` (`doc_gia_id`, `sach_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- BẢNG TRUNG TÂM THÔNG BÁO CHO ĐỘC GIẢ
-- ========================================================
CREATE TABLE IF NOT EXISTS `thong_bao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `doc_gia_id` bigint(20) DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `loai_thong_bao` varchar(50) DEFAULT 'HE_THONG',
  `lien_ket` varchar(255) DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

package com.example.demoChuong.dao; // Khai báo package chứa lớp truy cập dữ liệu sách

import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach đang có trong project
import com.example.demoChuong.util.DatabaseConnection; // Nhập lớp tiện ích mở kết nối MySQL

import java.math.BigDecimal; // Nhập kiểu số dùng cho giá tiền
import java.sql.Connection; // Nhập lớp đại diện cho kết nối JDBC
import java.sql.PreparedStatement; // Nhập lớp dùng để chạy câu SQL có tham số
import java.sql.ResultSet; // Nhập lớp dùng để đọc kết quả truy vấn
import java.sql.SQLException; // Nhập lớp mô tả lỗi cơ sở dữ liệu
import java.sql.Statement; // Nhập lớp chứa tùy chọn lấy khóa tự tăng
import java.sql.Types; // Nhập các kiểu dữ liệu SQL dùng khi gán giá trị null
import java.util.ArrayList; // Nhập lớp danh sách có thể thêm phần tử
import java.util.List; // Nhập kiểu danh sách chung

public class SachDAO { // Khai báo lớp thực hiện CRUD cho bảng sach bằng JDBC
    private static final String CAC_COT = "id, ma_sach, ten_sach, danh_muc_id, nha_xuat_ban_id, isbn, nam_xuat_ban, lan_tai_ban, ngon_ngu, mo_ta, gia_tien, so_trang, anh_bia, trang_thai"; // Khai báo danh sách cột cần đọc từ bảng sach
    private static final String SQL_THEM = "INSERT INTO sach (ma_sach, ten_sach, danh_muc_id, nha_xuat_ban_id, isbn, nam_xuat_ban, lan_tai_ban, ngon_ngu, mo_ta, gia_tien, so_trang, anh_bia, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Khai báo câu SQL thêm một sách
    private static final String SQL_LAY_TAT_CA = "SELECT " + CAC_COT + " FROM sach ORDER BY id"; // Khai báo câu SQL xem toàn bộ sách
    private static final String SQL_TIM_THEO_ID = "SELECT " + CAC_COT + " FROM sach WHERE id = ?"; // Khai báo câu SQL tìm sách theo ID
    private static final String SQL_CAP_NHAT = "UPDATE sach SET ma_sach = ?, ten_sach = ?, danh_muc_id = ?, nha_xuat_ban_id = ?, isbn = ?, nam_xuat_ban = ?, lan_tai_ban = ?, ngon_ngu = ?, mo_ta = ?, gia_tien = ?, so_trang = ?, anh_bia = ?, trang_thai = ? WHERE id = ?"; // Khai báo câu SQL cập nhật sách
    private static final String SQL_XOA = "DELETE FROM sach WHERE id = ?"; // Khai báo câu SQL xóa sách theo ID
    private static final String SQL_TIM_THEO_TEN = "SELECT " + CAC_COT + " FROM sach WHERE LOWER(ten_sach) LIKE LOWER(?) ORDER BY ten_sach"; // Khai báo câu SQL tìm sách theo tên

    public boolean them(Sach sach) { // Tạo phương thức thêm một sách mới
        kiemTraSach(sach); // Kiểm tra dữ liệu đầu vào trước khi mở kết nối
        ganGiaTriMacDinh(sach); // Gán các giá trị mặc định giống thiết kế MySQL
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_THEM, Statement.RETURN_GENERATED_KEYS)) { // Tạo câu lệnh thêm và yêu cầu trả về ID tự tăng
            ganThamSoSach(statement, sach); // Gán dữ liệu sách vào các dấu hỏi trong câu SQL
            int soDong = statement.executeUpdate(); // Thực hiện câu lệnh thêm và nhận số dòng bị thay đổi
            if (soDong > 0) { // Kiểm tra câu lệnh đã thêm được dữ liệu hay chưa
                ganIdVuaTao(statement, sach); // Gán ID MySQL vừa tạo lại cho đối tượng sách
            } // Kết thúc điều kiện gán ID
            return soDong > 0; // Trả về true khi thêm thành công
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi thêm sách
            throw new IllegalStateException("Không thể thêm sách vào MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức them

    public List<Sach> layTatCa() { // Tạo phương thức lấy danh sách sách
        List<Sach> danhSach = new ArrayList<>(); // Tạo danh sách rỗng để chứa kết quả
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_LAY_TAT_CA); // Chuẩn bị câu SQL xem toàn bộ sách
             ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và nhận tập kết quả
            while (resultSet.next()) { // Lặp qua từng dòng dữ liệu được trả về
                danhSach.add(docSach(resultSet)); // Chuyển dòng hiện tại thành đối tượng Sach rồi thêm vào danh sách
            } // Kết thúc vòng lặp đọc dữ liệu
            return danhSach; // Trả về danh sách sách đã đọc
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi đọc danh sách sách
            throw new IllegalStateException("Không thể đọc danh sách sách từ MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức layTatCa

    public Sach timTheoId(Long id) { // Tạo phương thức tìm một sách theo ID
        kiemTraId(id); // Kiểm tra ID trước khi truy vấn
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_TIM_THEO_ID)) { // Chuẩn bị câu SQL tìm theo ID
            statement.setLong(1, id); // Gán ID vào tham số thứ nhất của câu SQL
            try (ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và tự động đóng tập kết quả
                if (resultSet.next()) { // Kiểm tra truy vấn có tìm thấy sách hay không
                    return docSach(resultSet); // Trả về đối tượng Sach được đọc từ kết quả
                } // Kết thúc điều kiện tìm thấy sách
                return null; // Trả về null khi không có sách mang ID đã cho
            } // Kết thúc khối đọc tập kết quả
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi tìm sách
            throw new IllegalStateException("Không thể tìm sách theo ID", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timTheoId

    public boolean capNhat(Sach sach) { // Tạo phương thức cập nhật thông tin sách
        kiemTraSach(sach); // Kiểm tra dữ liệu sách trước khi cập nhật
        kiemTraId(sach.getId()); // Kiểm tra sách đã có ID hợp lệ
        ganGiaTriMacDinh(sach); // Bổ sung giá trị mặc định cho trường còn trống
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_CAP_NHAT)) { // Chuẩn bị câu SQL cập nhật sách
            ganThamSoSach(statement, sach); // Gán các thuộc tính sách vào mười ba tham số đầu
            statement.setLong(14, sach.getId()); // Gán ID sách vào điều kiện WHERE
            return statement.executeUpdate() > 0; // Trả về true khi có một dòng được cập nhật
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi cập nhật sách
            throw new IllegalStateException("Không thể cập nhật sách trong MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức capNhat

    public boolean xoa(Long id) { // Tạo phương thức xóa sách theo ID
        kiemTraId(id); // Kiểm tra ID trước khi xóa
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_XOA)) { // Chuẩn bị câu SQL xóa sách
            statement.setLong(1, id); // Gán ID vào điều kiện WHERE
            return statement.executeUpdate() > 0; // Trả về true khi có một dòng được xóa
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi xóa sách
            throw new IllegalStateException("Không thể xóa sách; sách có thể đang được bảng khác sử dụng", exception); // Báo lỗi và giữ nguyên dữ liệu khi có ràng buộc khóa ngoại
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức xoa

    public List<Sach> timTheoTen(String tuKhoa) { // Tạo phương thức tìm sách theo một phần tên
        if (tuKhoa == null || tuKhoa.isBlank()) { // Kiểm tra từ khóa có bị bỏ trống hay không
            return layTatCa(); // Trả về toàn bộ sách khi người dùng chưa nhập từ khóa
        } // Kết thúc điều kiện kiểm tra từ khóa
        List<Sach> danhSach = new ArrayList<>(); // Tạo danh sách rỗng để chứa kết quả tìm kiếm
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_TIM_THEO_TEN)) { // Chuẩn bị câu SQL tìm theo tên
            statement.setString(1, "%" + tuKhoa.trim() + "%"); // Gán từ khóa có ký tự đại diện vào câu SQL
            try (ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và tự động đóng tập kết quả
                while (resultSet.next()) { // Lặp qua từng sách phù hợp
                    danhSach.add(docSach(resultSet)); // Chuyển dòng hiện tại thành đối tượng Sach
                } // Kết thúc vòng lặp đọc kết quả
            } // Kết thúc khối đọc tập kết quả
            return danhSach; // Trả về danh sách sách phù hợp
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi tìm kiếm sách
            throw new IllegalStateException("Không thể tìm kiếm sách theo tên", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timTheoTen

    private void ganThamSoSach(PreparedStatement statement, Sach sach) throws SQLException { // Tạo phương thức gán thuộc tính sách vào câu SQL
        statement.setString(1, sach.getMaSach().trim()); // Gán mã sách vào tham số thứ nhất
        statement.setString(2, sach.getTenSach().trim()); // Gán tên sách vào tham số thứ hai
        statement.setLong(3, sach.getDanhMucId()); // Gán ID danh mục vào tham số thứ ba
        statement.setObject(4, sach.getNhaXuatBanId(), Types.BIGINT); // Gán ID nhà xuất bản hoặc giá trị null
        statement.setString(5, sach.getIsbn()); // Gán mã ISBN vào tham số thứ năm
        statement.setObject(6, sach.getNamXuatBan(), Types.INTEGER); // Gán năm xuất bản hoặc giá trị null
        statement.setInt(7, sach.getLanTaiBan()); // Gán lần tái bản vào tham số thứ bảy
        statement.setString(8, sach.getNgonNgu()); // Gán ngôn ngữ vào tham số thứ tám
        statement.setString(9, sach.getMoTa()); // Gán mô tả vào tham số thứ chín
        statement.setBigDecimal(10, sach.getGiaTien()); // Gán giá tiền vào tham số thứ mười
        statement.setObject(11, sach.getSoTrang(), Types.INTEGER); // Gán số trang hoặc giá trị null
        statement.setString(12, sach.getAnhBia()); // Gán đường dẫn ảnh bìa vào tham số thứ mười hai
        statement.setString(13, sach.getTrangThai()); // Gán trạng thái vào tham số thứ mười ba
    } // Kết thúc phương thức ganThamSoSach

    private void ganIdVuaTao(PreparedStatement statement, Sach sach) throws SQLException { // Tạo phương thức đọc ID tự tăng sau khi thêm
        try (ResultSet khoaDuocTao = statement.getGeneratedKeys()) { // Mở tập kết quả chứa khóa vừa được MySQL tạo
            if (khoaDuocTao.next()) { // Kiểm tra MySQL có trả về khóa hay không
                sach.setId(khoaDuocTao.getLong(1)); // Gán khóa đầu tiên cho đối tượng sách
            } // Kết thúc điều kiện có khóa
        } // Kết thúc khối đọc khóa tự tăng
    } // Kết thúc phương thức ganIdVuaTao

    private Sach docSach(ResultSet resultSet) throws SQLException { // Tạo phương thức chuyển một dòng dữ liệu thành đối tượng Sach
        Sach sach = new Sach(); // Tạo đối tượng sách rỗng
        sach.setId(resultSet.getLong("id")); // Đọc ID của sách
        sach.setMaSach(resultSet.getString("ma_sach")); // Đọc mã sách
        sach.setTenSach(resultSet.getString("ten_sach")); // Đọc tên sách
        sach.setDanhMucId(resultSet.getLong("danh_muc_id")); // Đọc ID danh mục
        sach.setNhaXuatBanId(docLongNullable(resultSet, "nha_xuat_ban_id")); // Đọc ID nhà xuất bản có thể để trống
        sach.setIsbn(resultSet.getString("isbn")); // Đọc mã ISBN
        sach.setNamXuatBan(docIntegerNullable(resultSet, "nam_xuat_ban")); // Đọc năm xuất bản có thể để trống
        sach.setLanTaiBan(resultSet.getInt("lan_tai_ban")); // Đọc lần tái bản
        sach.setNgonNgu(resultSet.getString("ngon_ngu")); // Đọc ngôn ngữ
        sach.setMoTa(resultSet.getString("mo_ta")); // Đọc mô tả sách
        sach.setGiaTien(resultSet.getBigDecimal("gia_tien")); // Đọc giá tiền
        sach.setSoTrang(docIntegerNullable(resultSet, "so_trang")); // Đọc số trang có thể để trống
        sach.setAnhBia(resultSet.getString("anh_bia")); // Đọc đường dẫn ảnh bìa
        sach.setTrangThai(resultSet.getString("trang_thai")); // Đọc trạng thái sách
        return sach; // Trả về đối tượng sách đã có dữ liệu
    } // Kết thúc phương thức docSach

    private Long docLongNullable(ResultSet resultSet, String tenCot) throws SQLException { // Tạo phương thức đọc số Long có thể là null
        long giaTri = resultSet.getLong(tenCot); // Đọc giá trị số từ cột được yêu cầu
        return resultSet.wasNull() ? null : giaTri; // Trả về null nếu cột MySQL không có giá trị
    } // Kết thúc phương thức docLongNullable

    private Integer docIntegerNullable(ResultSet resultSet, String tenCot) throws SQLException { // Tạo phương thức đọc số Integer có thể là null
        int giaTri = resultSet.getInt(tenCot); // Đọc giá trị số nguyên từ cột được yêu cầu
        return resultSet.wasNull() ? null : giaTri; // Trả về null nếu cột MySQL không có giá trị
    } // Kết thúc phương thức docIntegerNullable

    private void kiemTraSach(Sach sach) { // Tạo phương thức kiểm tra dữ liệu sách cơ bản
        if (sach == null) { // Kiểm tra đối tượng sách có tồn tại hay không
            throw new IllegalArgumentException("Thông tin sách không được để trống"); // Báo lỗi khi chưa truyền đối tượng sách
        } // Kết thúc điều kiện kiểm tra đối tượng
        if (sach.getMaSach() == null || sach.getMaSach().isBlank()) { // Kiểm tra mã sách bắt buộc
            throw new IllegalArgumentException("Mã sách không được để trống"); // Báo lỗi khi mã sách chưa có
        } // Kết thúc điều kiện kiểm tra mã sách
        if (sach.getTenSach() == null || sach.getTenSach().isBlank()) { // Kiểm tra tên sách bắt buộc
            throw new IllegalArgumentException("Tên sách không được để trống"); // Báo lỗi khi tên sách chưa có
        } // Kết thúc điều kiện kiểm tra tên sách
        if (sach.getDanhMucId() == null || sach.getDanhMucId() <= 0) { // Kiểm tra ID danh mục hợp lệ
            throw new IllegalArgumentException("ID danh mục phải lớn hơn 0"); // Báo lỗi khi danh mục không hợp lệ
        } // Kết thúc điều kiện kiểm tra danh mục
        if (sach.getGiaTien() != null && sach.getGiaTien().compareTo(BigDecimal.ZERO) < 0) { // Kiểm tra giá tiền không âm
            throw new IllegalArgumentException("Giá tiền không được nhỏ hơn 0"); // Báo lỗi khi giá tiền không hợp lệ
        } // Kết thúc điều kiện kiểm tra giá tiền
    } // Kết thúc phương thức kiemTraSach

    private void ganGiaTriMacDinh(Sach sach) { // Tạo phương thức gán giá trị mặc định cho sách
        if (sach.getLanTaiBan() == null || sach.getLanTaiBan() < 1) { // Kiểm tra lần tái bản chưa hợp lệ
            sach.setLanTaiBan(1); // Gán lần tái bản mặc định là một
        } // Kết thúc điều kiện lần tái bản
        if (sach.getNgonNgu() == null || sach.getNgonNgu().isBlank()) { // Kiểm tra ngôn ngữ chưa được nhập
            sach.setNgonNgu("Tiếng Việt"); // Gán ngôn ngữ mặc định theo thiết kế CSDL
        } // Kết thúc điều kiện ngôn ngữ
        if (sach.getGiaTien() == null) { // Kiểm tra giá tiền chưa được nhập
            sach.setGiaTien(BigDecimal.ZERO); // Gán giá tiền mặc định bằng không
        } // Kết thúc điều kiện giá tiền
        if (sach.getTrangThai() == null || sach.getTrangThai().isBlank()) { // Kiểm tra trạng thái chưa được nhập
            sach.setTrangThai("DANG_LUU_HANH"); // Gán trạng thái mặc định theo thiết kế CSDL
        } // Kết thúc điều kiện trạng thái
    } // Kết thúc phương thức ganGiaTriMacDinh

    private void kiemTraId(Long id) { // Tạo phương thức kiểm tra ID cơ bản
        if (id == null || id <= 0) { // Kiểm tra ID có tồn tại và lớn hơn không
            throw new IllegalArgumentException("ID sách phải lớn hơn 0"); // Báo lỗi khi ID không hợp lệ
        } // Kết thúc điều kiện kiểm tra ID
    } // Kết thúc phương thức kiemTraId
} // Kết thúc lớp SachDAO

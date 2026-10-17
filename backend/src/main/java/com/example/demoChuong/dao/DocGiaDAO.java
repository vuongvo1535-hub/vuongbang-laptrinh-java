package com.example.demoChuong.dao; // Khai báo package chứa lớp truy cập dữ liệu độc giả

import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia đang có trong project
import com.example.demoChuong.util.DatabaseConnection; // Nhập lớp tiện ích mở kết nối MySQL

import java.sql.Connection; // Nhập lớp đại diện cho kết nối JDBC
import java.sql.Date; // Nhập kiểu ngày dùng để truyền dữ liệu qua JDBC
import java.sql.PreparedStatement; // Nhập lớp dùng để chạy câu SQL có tham số
import java.sql.ResultSet; // Nhập lớp dùng để đọc kết quả truy vấn
import java.sql.SQLException; // Nhập lớp mô tả lỗi cơ sở dữ liệu
import java.sql.Statement; // Nhập lớp chứa tùy chọn lấy khóa tự tăng
import java.sql.Types; // Nhập các kiểu dữ liệu SQL dùng khi gán giá trị null
import java.util.ArrayList; // Nhập lớp danh sách có thể thêm phần tử
import java.util.List; // Nhập kiểu danh sách chung

public class DocGiaDAO { // Khai báo lớp thực hiện CRUD cho bảng doc_gia bằng JDBC
    private static final String CAC_COT = "id, tai_khoan_id, ma_doc_gia, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ngay_dang_ky, trang_thai"; // Khai báo danh sách cột cần đọc từ bảng doc_gia
    private static final String SQL_THEM = "INSERT INTO doc_gia (tai_khoan_id, ma_doc_gia, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, ngay_dang_ky, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Khai báo câu SQL thêm một độc giả
    private static final String SQL_LAY_TAT_CA = "SELECT " + CAC_COT + " FROM doc_gia ORDER BY id"; // Khai báo câu SQL xem toàn bộ độc giả
    private static final String SQL_TIM_THEO_ID = "SELECT " + CAC_COT + " FROM doc_gia WHERE id = ?"; // Khai báo câu SQL tìm độc giả theo ID
    private static final String SQL_CAP_NHAT = "UPDATE doc_gia SET tai_khoan_id = ?, ma_doc_gia = ?, ho_ten = ?, ngay_sinh = ?, gioi_tinh = ?, so_dien_thoai = ?, email = ?, dia_chi = ?, ngay_dang_ky = ?, trang_thai = ? WHERE id = ?"; // Khai báo câu SQL cập nhật độc giả
    private static final String SQL_XOA = "DELETE FROM doc_gia WHERE id = ?"; // Khai báo câu SQL xóa độc giả theo ID
    private static final String SQL_TIM_THEO_TEN = "SELECT " + CAC_COT + " FROM doc_gia WHERE LOWER(ho_ten) LIKE LOWER(?) ORDER BY ho_ten"; // Khai báo câu SQL tìm độc giả theo họ tên

    public boolean them(DocGia docGia) { // Tạo phương thức thêm một độc giả mới
        kiemTraDocGia(docGia); // Kiểm tra dữ liệu đầu vào trước khi mở kết nối
        ganGiaTriMacDinh(docGia); // Gán các giá trị mặc định giống thiết kế MySQL
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_THEM, Statement.RETURN_GENERATED_KEYS)) { // Tạo câu lệnh thêm và yêu cầu trả về ID tự tăng
            ganThamSoDocGia(statement, docGia); // Gán dữ liệu độc giả vào các dấu hỏi trong câu SQL
            int soDong = statement.executeUpdate(); // Thực hiện câu lệnh thêm và nhận số dòng bị thay đổi
            if (soDong > 0) { // Kiểm tra câu lệnh đã thêm được dữ liệu hay chưa
                ganIdVuaTao(statement, docGia); // Gán ID MySQL vừa tạo lại cho đối tượng độc giả
            } // Kết thúc điều kiện gán ID
            return soDong > 0; // Trả về true khi thêm thành công
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi thêm độc giả
            throw new IllegalStateException("Không thể thêm độc giả vào MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức them

    public List<DocGia> layTatCa() { // Tạo phương thức lấy danh sách độc giả
        List<DocGia> danhSach = new ArrayList<>(); // Tạo danh sách rỗng để chứa kết quả
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_LAY_TAT_CA); // Chuẩn bị câu SQL xem toàn bộ độc giả
             ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và nhận tập kết quả
            while (resultSet.next()) { // Lặp qua từng dòng dữ liệu được trả về
                danhSach.add(docDocGia(resultSet)); // Chuyển dòng hiện tại thành đối tượng DocGia rồi thêm vào danh sách
            } // Kết thúc vòng lặp đọc dữ liệu
            return danhSach; // Trả về danh sách độc giả đã đọc
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi đọc danh sách độc giả
            throw new IllegalStateException("Không thể đọc danh sách độc giả từ MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức layTatCa

    public DocGia timTheoId(Long id) { // Tạo phương thức tìm một độc giả theo ID
        kiemTraId(id); // Kiểm tra ID trước khi truy vấn
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_TIM_THEO_ID)) { // Chuẩn bị câu SQL tìm theo ID
            statement.setLong(1, id); // Gán ID vào tham số thứ nhất của câu SQL
            try (ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và tự động đóng tập kết quả
                if (resultSet.next()) { // Kiểm tra truy vấn có tìm thấy độc giả hay không
                    return docDocGia(resultSet); // Trả về đối tượng DocGia được đọc từ kết quả
                } // Kết thúc điều kiện tìm thấy độc giả
                return null; // Trả về null khi không có độc giả mang ID đã cho
            } // Kết thúc khối đọc tập kết quả
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi tìm độc giả
            throw new IllegalStateException("Không thể tìm độc giả theo ID", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timTheoId

    public boolean capNhat(DocGia docGia) { // Tạo phương thức cập nhật thông tin độc giả
        kiemTraDocGia(docGia); // Kiểm tra dữ liệu độc giả trước khi cập nhật
        kiemTraId(docGia.getId()); // Kiểm tra độc giả đã có ID hợp lệ
        ganGiaTriMacDinh(docGia); // Bổ sung giá trị mặc định cho trường còn trống
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_CAP_NHAT)) { // Chuẩn bị câu SQL cập nhật độc giả
            ganThamSoDocGia(statement, docGia); // Gán các thuộc tính độc giả vào mười tham số đầu
            statement.setLong(11, docGia.getId()); // Gán ID độc giả vào điều kiện WHERE
            return statement.executeUpdate() > 0; // Trả về true khi có một dòng được cập nhật
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi cập nhật độc giả
            throw new IllegalStateException("Không thể cập nhật độc giả trong MySQL", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức capNhat

    public boolean xoa(Long id) { // Tạo phương thức xóa độc giả theo ID
        kiemTraId(id); // Kiểm tra ID trước khi xóa
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_XOA)) { // Chuẩn bị câu SQL xóa độc giả
            statement.setLong(1, id); // Gán ID vào điều kiện WHERE
            return statement.executeUpdate() > 0; // Trả về true khi có một dòng được xóa
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi xóa độc giả
            throw new IllegalStateException("Không thể xóa độc giả; độc giả có thể đang được bảng khác sử dụng", exception); // Báo lỗi và giữ nguyên dữ liệu khi có ràng buộc khóa ngoại
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức xoa

    public List<DocGia> timTheoTen(String tuKhoa) { // Tạo phương thức tìm độc giả theo một phần họ tên
        if (tuKhoa == null || tuKhoa.isBlank()) { // Kiểm tra từ khóa có bị bỏ trống hay không
            return layTatCa(); // Trả về toàn bộ độc giả khi người dùng chưa nhập từ khóa
        } // Kết thúc điều kiện kiểm tra từ khóa
        List<DocGia> danhSach = new ArrayList<>(); // Tạo danh sách rỗng để chứa kết quả tìm kiếm
        try (Connection connection = DatabaseConnection.getConnection(); // Mở kết nối và tự động đóng sau khi dùng
             PreparedStatement statement = connection.prepareStatement(SQL_TIM_THEO_TEN)) { // Chuẩn bị câu SQL tìm theo tên
            statement.setString(1, "%" + tuKhoa.trim() + "%"); // Gán từ khóa có ký tự đại diện vào câu SQL
            try (ResultSet resultSet = statement.executeQuery()) { // Chạy truy vấn và tự động đóng tập kết quả
                while (resultSet.next()) { // Lặp qua từng độc giả phù hợp
                    danhSach.add(docDocGia(resultSet)); // Chuyển dòng hiện tại thành đối tượng DocGia
                } // Kết thúc vòng lặp đọc kết quả
            } // Kết thúc khối đọc tập kết quả
            return danhSach; // Trả về danh sách độc giả phù hợp
        } catch (SQLException exception) { // Bắt lỗi phát sinh khi tìm kiếm độc giả
            throw new IllegalStateException("Không thể tìm kiếm độc giả theo tên", exception); // Báo lỗi dễ hiểu cho nơi gọi phương thức
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timTheoTen

    private void ganThamSoDocGia(PreparedStatement statement, DocGia docGia) throws SQLException { // Tạo phương thức gán thuộc tính độc giả vào câu SQL
        statement.setObject(1, docGia.getTaiKhoanId(), Types.BIGINT); // Gán ID tài khoản hoặc giá trị null
        statement.setString(2, docGia.getMaDocGia().trim()); // Gán mã độc giả vào tham số thứ hai
        statement.setString(3, docGia.getHoTen().trim()); // Gán họ tên vào tham số thứ ba
        statement.setObject(4, docGia.getNgaySinh() == null ? null : Date.valueOf(docGia.getNgaySinh()), Types.DATE); // Gán ngày sinh hoặc giá trị null
        statement.setString(5, docGia.getGioiTinh()); // Gán giới tính vào tham số thứ năm
        statement.setString(6, docGia.getSoDienThoai()); // Gán số điện thoại vào tham số thứ sáu
        statement.setString(7, docGia.getEmail()); // Gán email vào tham số thứ bảy
        statement.setString(8, docGia.getDiaChi()); // Gán địa chỉ vào tham số thứ tám
        statement.setDate(9, Date.valueOf(docGia.getNgayDangKy())); // Gán ngày đăng ký bắt buộc vào tham số thứ chín
        statement.setString(10, docGia.getTrangThai()); // Gán trạng thái vào tham số thứ mười
    } // Kết thúc phương thức ganThamSoDocGia

    private void ganIdVuaTao(PreparedStatement statement, DocGia docGia) throws SQLException { // Tạo phương thức đọc ID tự tăng sau khi thêm
        try (ResultSet khoaDuocTao = statement.getGeneratedKeys()) { // Mở tập kết quả chứa khóa vừa được MySQL tạo
            if (khoaDuocTao.next()) { // Kiểm tra MySQL có trả về khóa hay không
                docGia.setId(khoaDuocTao.getLong(1)); // Gán khóa đầu tiên cho đối tượng độc giả
            } // Kết thúc điều kiện có khóa
        } // Kết thúc khối đọc khóa tự tăng
    } // Kết thúc phương thức ganIdVuaTao

    private DocGia docDocGia(ResultSet resultSet) throws SQLException { // Tạo phương thức chuyển một dòng dữ liệu thành đối tượng DocGia
        DocGia docGia = new DocGia(); // Tạo đối tượng độc giả rỗng
        docGia.setId(resultSet.getLong("id")); // Đọc ID độc giả
        docGia.setTaiKhoanId(docLongNullable(resultSet, "tai_khoan_id")); // Đọc ID tài khoản có thể để trống
        docGia.setMaDocGia(resultSet.getString("ma_doc_gia")); // Đọc mã độc giả
        docGia.setHoTen(resultSet.getString("ho_ten")); // Đọc họ tên độc giả
        Date ngaySinh = resultSet.getDate("ngay_sinh"); // Đọc ngày sinh có thể để trống
        docGia.setNgaySinh(ngaySinh == null ? null : ngaySinh.toLocalDate()); // Chuyển ngày sinh từ JDBC sang LocalDate
        docGia.setGioiTinh(resultSet.getString("gioi_tinh")); // Đọc giới tính
        docGia.setSoDienThoai(resultSet.getString("so_dien_thoai")); // Đọc số điện thoại
        docGia.setEmail(resultSet.getString("email")); // Đọc email
        docGia.setDiaChi(resultSet.getString("dia_chi")); // Đọc địa chỉ
        docGia.setNgayDangKy(resultSet.getDate("ngay_dang_ky").toLocalDate()); // Đọc và chuyển ngày đăng ký bắt buộc
        docGia.setTrangThai(resultSet.getString("trang_thai")); // Đọc trạng thái độc giả
        return docGia; // Trả về đối tượng độc giả đã có dữ liệu
    } // Kết thúc phương thức docDocGia

    private Long docLongNullable(ResultSet resultSet, String tenCot) throws SQLException { // Tạo phương thức đọc số Long có thể là null
        long giaTri = resultSet.getLong(tenCot); // Đọc giá trị số từ cột được yêu cầu
        return resultSet.wasNull() ? null : giaTri; // Trả về null nếu cột MySQL không có giá trị
    } // Kết thúc phương thức docLongNullable

    private void kiemTraDocGia(DocGia docGia) { // Tạo phương thức kiểm tra dữ liệu độc giả cơ bản
        if (docGia == null) { // Kiểm tra đối tượng độc giả có tồn tại hay không
            throw new IllegalArgumentException("Thông tin độc giả không được để trống"); // Báo lỗi khi chưa truyền đối tượng độc giả
        } // Kết thúc điều kiện kiểm tra đối tượng
        if (docGia.getMaDocGia() == null || docGia.getMaDocGia().isBlank()) { // Kiểm tra mã độc giả bắt buộc
            throw new IllegalArgumentException("Mã độc giả không được để trống"); // Báo lỗi khi mã độc giả chưa có
        } // Kết thúc điều kiện kiểm tra mã độc giả
        if (docGia.getHoTen() == null || docGia.getHoTen().isBlank()) { // Kiểm tra họ tên bắt buộc
            throw new IllegalArgumentException("Họ tên độc giả không được để trống"); // Báo lỗi khi họ tên chưa có
        } // Kết thúc điều kiện kiểm tra họ tên
        if (docGia.getNgayDangKy() == null) { // Kiểm tra ngày đăng ký bắt buộc theo CSDL
            throw new IllegalArgumentException("Ngày đăng ký không được để trống"); // Báo lỗi khi ngày đăng ký chưa có
        } // Kết thúc điều kiện kiểm tra ngày đăng ký
    } // Kết thúc phương thức kiemTraDocGia

    private void ganGiaTriMacDinh(DocGia docGia) { // Tạo phương thức gán giá trị mặc định cho độc giả
        if (docGia.getGioiTinh() == null || docGia.getGioiTinh().isBlank()) { // Kiểm tra giới tính chưa được nhập
            docGia.setGioiTinh("KHAC"); // Gán giới tính mặc định theo thiết kế CSDL
        } // Kết thúc điều kiện giới tính
        if (docGia.getTrangThai() == null || docGia.getTrangThai().isBlank()) { // Kiểm tra trạng thái chưa được nhập
            docGia.setTrangThai("HOAT_DONG"); // Gán trạng thái mặc định theo thiết kế CSDL
        } // Kết thúc điều kiện trạng thái
    } // Kết thúc phương thức ganGiaTriMacDinh

    private void kiemTraId(Long id) { // Tạo phương thức kiểm tra ID cơ bản
        if (id == null || id <= 0) { // Kiểm tra ID có tồn tại và lớn hơn không
            throw new IllegalArgumentException("ID độc giả phải lớn hơn 0"); // Báo lỗi khi ID không hợp lệ
        } // Kết thúc điều kiện kiểm tra ID
    } // Kết thúc phương thức kiemTraId
} // Kết thúc lớp DocGiaDAO

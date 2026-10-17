package com.example.demoChuong.view; // Khai báo package chứa giao diện quản lý độc giả

import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia để đọc và ghi dữ liệu
import com.example.demoChuong.view.controller.DocGiaViewController; // Nhập lớp điều khiển kết nối View với DAO

import javax.swing.BorderFactory; // Nhập lớp tạo đường viền cho các khu vực giao diện
import javax.swing.JButton; // Nhập lớp tạo nút bấm
import javax.swing.JFrame; // Nhập lớp tạo cửa sổ chính
import javax.swing.JLabel; // Nhập lớp tạo nhãn mô tả ô nhập
import javax.swing.JOptionPane; // Nhập lớp hiển thị thông báo và hộp xác nhận
import javax.swing.JPanel; // Nhập lớp tạo khu vực chứa các thành phần
import javax.swing.JScrollPane; // Nhập lớp tạo thanh cuộn cho bảng
import javax.swing.JTable; // Nhập lớp tạo bảng hiển thị dữ liệu
import javax.swing.JTextField; // Nhập lớp tạo ô nhập văn bản
import javax.swing.ListSelectionModel; // Nhập lớp cấu hình cách chọn dòng trong bảng
import javax.swing.SwingConstants; // Nhập các giá trị căn chỉnh thành phần Swing
import javax.swing.SwingUtilities; // Nhập lớp hỗ trợ chạy giao diện trên luồng Swing
import javax.swing.UIManager; // Nhập lớp dùng giao diện mặc định của hệ điều hành
import javax.swing.table.DefaultTableModel; // Nhập lớp quản lý dữ liệu của JTable
import java.awt.BorderLayout; // Nhập kiểu bố cục chia giao diện theo năm vùng
import java.awt.Dimension; // Nhập lớp mô tả kích thước thành phần
import java.awt.FlowLayout; // Nhập kiểu bố cục sắp xếp thành phần theo hàng
import java.awt.Font; // Nhập lớp cấu hình phông chữ
import java.awt.GridLayout; // Nhập kiểu bố cục dạng lưới
import java.time.LocalDate; // Nhập kiểu ngày dùng cho ngày sinh và ngày đăng ký
import java.time.format.DateTimeParseException; // Nhập lớp mô tả lỗi nhập ngày sai định dạng
import java.util.ArrayList; // Nhập lớp danh sách dùng để lưu dữ liệu đang hiển thị
import java.util.List; // Nhập kiểu danh sách chung

public class DocGiaView extends JFrame { // Khai báo cửa sổ Swing quản lý độc giả
    private static final String[] TEN_COT = {"ID", "Tài khoản ID", "Mã độc giả", "Họ tên", "Ngày sinh", "Giới tính", "Số điện thoại", "Email", "Địa chỉ", "Ngày đăng ký", "Trạng thái"}; // Khai báo tên các cột đúng với Model DocGia
    private final DocGiaViewController controller; // Lưu controller xử lý yêu cầu từ giao diện
    private final JTextField txtId = new JTextField(); // Tạo ô hiển thị ID độc giả
    private final JTextField txtTaiKhoanId = new JTextField(); // Tạo ô nhập ID tài khoản
    private final JTextField txtMaDocGia = new JTextField(); // Tạo ô nhập mã độc giả
    private final JTextField txtHoTen = new JTextField(); // Tạo ô nhập họ tên độc giả
    private final JTextField txtNgaySinh = new JTextField(); // Tạo ô nhập ngày sinh
    private final JTextField txtGioiTinh = new JTextField(); // Tạo ô nhập giới tính
    private final JTextField txtSoDienThoai = new JTextField(); // Tạo ô nhập số điện thoại
    private final JTextField txtEmail = new JTextField(); // Tạo ô nhập địa chỉ thư điện tử
    private final JTextField txtDiaChi = new JTextField(); // Tạo ô nhập địa chỉ
    private final JTextField txtNgayDangKy = new JTextField(); // Tạo ô nhập ngày đăng ký
    private final JTextField txtTrangThai = new JTextField(); // Tạo ô nhập trạng thái độc giả
    private final JTextField txtTimKiem = new JTextField(28); // Tạo ô nhập từ khóa tìm kiếm
    private final JButton btnThem = new JButton("Thêm"); // Tạo nút thêm độc giả
    private final JButton btnSua = new JButton("Sửa"); // Tạo nút sửa độc giả
    private final JButton btnXoa = new JButton("Xóa"); // Tạo nút xóa độc giả
    private final JButton btnLamMoi = new JButton("Làm mới"); // Tạo nút làm mới giao diện
    private final JButton btnTimKiem = new JButton("Tìm kiếm"); // Tạo nút tìm kiếm độc giả
    private final DefaultTableModel tableModel = new DefaultTableModel(TEN_COT, 0) { // Tạo mô hình dữ liệu cho bảng độc giả
        @Override // Đánh dấu phương thức được viết lại từ DefaultTableModel
        public boolean isCellEditable(int row, int column) { // Kiểm tra ô trong bảng có được sửa trực tiếp hay không
            return false; // Không cho sửa trực tiếp để dữ liệu chỉ thay đổi qua nút Sửa
        } // Kết thúc phương thức isCellEditable
    }; // Kết thúc đối tượng tableModel
    private final JTable tableDocGia = new JTable(tableModel); // Tạo JTable sử dụng mô hình dữ liệu độc giả
    private List<DocGia> danhSachHienThi = new ArrayList<>(); // Lưu danh sách tương ứng với các dòng đang hiển thị

    public DocGiaView() { // Tạo hàm khởi tạo mặc định cho cửa sổ quản lý độc giả
        this(new DocGiaViewController()); // Tạo controller Swing dùng DocGiaDAO của tuần 2
    } // Kết thúc hàm khởi tạo mặc định

    public DocGiaView(DocGiaViewController controller) { // Tạo hàm khởi tạo cho phép truyền controller khi kiểm thử
        this.controller = controller; // Lưu controller được truyền vào
        khoiTaoGiaoDien(); // Tạo và sắp xếp các thành phần giao diện
        ganSuKien(); // Gắn sự kiện cho nút bấm và JTable
        taiDanhSachDocGia(); // Đọc dữ liệu MySQL để hiển thị khi mở cửa sổ
    } // Kết thúc hàm khởi tạo có tham số

    private void khoiTaoGiaoDien() { // Tạo phương thức khởi tạo toàn bộ giao diện
        setTitle("Quản lý độc giả"); // Đặt tiêu đề trên thanh cửa sổ
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Chỉ đóng cửa sổ hiện tại khi người dùng thoát
        setMinimumSize(new Dimension(1100, 680)); // Đặt kích thước tối thiểu để giao diện dễ nhìn
        setSize(1280, 760); // Đặt kích thước ban đầu cho cửa sổ
        setLocationRelativeTo(null); // Đặt cửa sổ ở giữa màn hình
        JPanel noiDung = new JPanel(new BorderLayout(10, 10)); // Tạo panel chính với khoảng cách giữa các vùng
        noiDung.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12)); // Tạo khoảng trống quanh giao diện
        noiDung.add(taoTieuDe(), BorderLayout.NORTH); // Đặt tiêu đề ở phía trên
        JPanel khuVucChinh = new JPanel(new BorderLayout(10, 10)); // Tạo khu vực chứa form và bảng
        khuVucChinh.add(taoFormNhap(), BorderLayout.NORTH); // Đặt form nhập thông tin ở phía trên
        khuVucChinh.add(taoKhuVucBang(), BorderLayout.CENTER); // Đặt bảng dữ liệu ở chính giữa
        khuVucChinh.add(taoKhuVucNut(), BorderLayout.SOUTH); // Đặt các nút chức năng ở phía dưới
        noiDung.add(khuVucChinh, BorderLayout.CENTER); // Thêm khu vực chính vào cửa sổ
        setContentPane(noiDung); // Gán panel chính làm nội dung của JFrame
    } // Kết thúc phương thức khoiTaoGiaoDien

    private JLabel taoTieuDe() { // Tạo phương thức sinh tiêu đề giao diện
        JLabel tieuDe = new JLabel("QUẢN LÝ ĐỘC GIẢ", SwingConstants.CENTER); // Tạo nhãn tiêu đề và căn giữa
        tieuDe.setFont(new Font("Arial", Font.BOLD, 24)); // Đặt phông chữ rõ ràng cho tiêu đề
        return tieuDe; // Trả về nhãn tiêu đề đã tạo
    } // Kết thúc phương thức taoTieuDe

    private JPanel taoFormNhap() { // Tạo phương thức sinh khu vực nhập thông tin độc giả
        JPanel form = new JPanel(new GridLayout(6, 4, 10, 8)); // Tạo lưới sáu hàng với hai cặp nhãn và ô nhập
        form.setBorder(BorderFactory.createTitledBorder("Thông tin độc giả")); // Đặt tiêu đề cho khu vực nhập liệu
        txtId.setEditable(false); // Không cho người dùng tự sửa ID do MySQL tự tạo
        themTruongNhap(form, "ID", txtId); // Thêm ô ID vào form
        themTruongNhap(form, "Tài khoản ID", txtTaiKhoanId); // Thêm ô ID tài khoản vào form
        themTruongNhap(form, "Mã độc giả (*)", txtMaDocGia); // Thêm ô mã độc giả vào form
        themTruongNhap(form, "Họ tên (*)", txtHoTen); // Thêm ô họ tên vào form
        themTruongNhap(form, "Ngày sinh (yyyy-MM-dd)", txtNgaySinh); // Thêm ô ngày sinh vào form
        themTruongNhap(form, "Giới tính", txtGioiTinh); // Thêm ô giới tính vào form
        themTruongNhap(form, "Số điện thoại", txtSoDienThoai); // Thêm ô số điện thoại vào form
        themTruongNhap(form, "Email", txtEmail); // Thêm ô email vào form
        themTruongNhap(form, "Địa chỉ", txtDiaChi); // Thêm ô địa chỉ vào form
        themTruongNhap(form, "Ngày đăng ký (*)", txtNgayDangKy); // Thêm ô ngày đăng ký vào form
        themTruongNhap(form, "Trạng thái", txtTrangThai); // Thêm ô trạng thái vào form
        form.add(new JLabel("")); // Thêm ô trống để lưới được cân đối
        form.add(new JLabel("")); // Thêm ô trống còn lại ở cuối lưới
        return form; // Trả về form nhập liệu đã hoàn thành
    } // Kết thúc phương thức taoFormNhap

    private void themTruongNhap(JPanel form, String tenNhan, JTextField oNhap) { // Tạo phương thức thêm một nhãn và một ô nhập vào form
        form.add(new JLabel(tenNhan)); // Thêm nhãn mô tả trường dữ liệu
        form.add(oNhap); // Thêm ô nhập tương ứng ngay sau nhãn
    } // Kết thúc phương thức themTruongNhap

    private JPanel taoKhuVucBang() { // Tạo phương thức sinh khu vực tìm kiếm và bảng độc giả
        JPanel khuVucBang = new JPanel(new BorderLayout(8, 8)); // Tạo panel chứa thanh tìm kiếm và bảng
        JPanel timKiem = new JPanel(new FlowLayout(FlowLayout.LEFT)); // Tạo hàng tìm kiếm căn về bên trái
        timKiem.add(new JLabel("Họ tên")); // Thêm nhãn hướng dẫn nhập từ khóa
        timKiem.add(txtTimKiem); // Thêm ô nhập từ khóa
        timKiem.add(btnTimKiem); // Thêm nút thực hiện tìm kiếm
        khuVucBang.add(timKiem, BorderLayout.NORTH); // Đặt hàng tìm kiếm phía trên bảng
        tableDocGia.setSelectionMode(ListSelectionModel.SINGLE_SELECTION); // Chỉ cho chọn một độc giả tại một thời điểm
        tableDocGia.setAutoResizeMode(JTable.AUTO_RESIZE_OFF); // Cho phép thanh cuộn ngang khi bảng có nhiều cột
        for (int cot = 0; cot < tableDocGia.getColumnCount(); cot++) { // Lặp qua tất cả cột trong JTable
            tableDocGia.getColumnModel().getColumn(cot).setPreferredWidth(cot == 3 || cot == 8 ? 180 : 115); // Đặt cột họ tên và địa chỉ rộng hơn các cột còn lại
        } // Kết thúc vòng lặp chỉnh độ rộng cột
        JScrollPane thanhCuon = new JScrollPane(tableDocGia); // Tạo thanh cuộn bao quanh JTable
        thanhCuon.setBorder(BorderFactory.createTitledBorder("Danh sách độc giả")); // Đặt tiêu đề cho khu vực danh sách
        khuVucBang.add(thanhCuon, BorderLayout.CENTER); // Đặt bảng có thanh cuộn vào giữa khu vực
        return khuVucBang; // Trả về khu vực bảng đã hoàn thành
    } // Kết thúc phương thức taoKhuVucBang

    private JPanel taoKhuVucNut() { // Tạo phương thức sinh hàng nút chức năng
        JPanel khuVucNut = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 4)); // Tạo hàng nút căn giữa và có khoảng cách
        khuVucNut.add(btnThem); // Thêm nút Thêm vào hàng nút
        khuVucNut.add(btnSua); // Thêm nút Sửa vào hàng nút
        khuVucNut.add(btnXoa); // Thêm nút Xóa vào hàng nút
        khuVucNut.add(btnLamMoi); // Thêm nút Làm mới vào hàng nút
        return khuVucNut; // Trả về hàng nút đã hoàn thành
    } // Kết thúc phương thức taoKhuVucNut

    private void ganSuKien() { // Tạo phương thức gắn sự kiện cho giao diện
        btnThem.addActionListener(event -> themDocGia()); // Gọi chức năng thêm khi nhấn nút Thêm
        btnSua.addActionListener(event -> suaDocGia()); // Gọi chức năng sửa khi nhấn nút Sửa
        btnXoa.addActionListener(event -> xoaDocGia()); // Gọi chức năng xóa khi nhấn nút Xóa
        btnLamMoi.addActionListener(event -> lamMoi()); // Gọi chức năng làm mới khi nhấn nút Làm mới
        btnTimKiem.addActionListener(event -> timKiemDocGia()); // Gọi chức năng tìm kiếm khi nhấn nút Tìm kiếm
        txtTimKiem.addActionListener(event -> timKiemDocGia()); // Cho phép nhấn Enter trong ô tìm kiếm
        tableDocGia.getSelectionModel().addListSelectionListener(event -> { // Theo dõi khi người dùng chọn một dòng trong bảng
            if (!event.getValueIsAdjusting()) { // Chỉ xử lý sau khi thao tác chọn đã hoàn tất
                hienThiDocGiaDangChon(); // Đưa dữ liệu của dòng được chọn lên form
            } // Kết thúc điều kiện kiểm tra sự kiện chọn
        }); // Kết thúc phần gắn sự kiện chọn dòng
    } // Kết thúc phương thức ganSuKien

    private void taiDanhSachDocGia() { // Tạo phương thức tải toàn bộ độc giả từ MySQL
        try { // Bắt đầu khối xử lý có thể phát sinh lỗi kết nối
            hienThiDanhSach(controller.layTatCa()); // Nhờ controller lấy dữ liệu rồi hiển thị lên JTable
        } catch (RuntimeException exception) { // Bắt lỗi khi controller hoặc DAO không đọc được dữ liệu
            hienThiLoi(exception); // Hiển thị thông báo lỗi dễ hiểu cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức taiDanhSachDocGia

    private void hienThiDanhSach(List<DocGia> danhSach) { // Tạo phương thức đưa danh sách độc giả lên JTable
        danhSachHienThi = new ArrayList<>(danhSach); // Lưu bản sao danh sách để dùng khi chọn dòng
        tableModel.setRowCount(0); // Xóa các dòng cũ trước khi hiển thị dữ liệu mới
        for (DocGia docGia : danhSachHienThi) { // Lặp qua từng độc giả trong danh sách
            tableModel.addRow(new Object[]{docGia.getId(), docGia.getTaiKhoanId(), docGia.getMaDocGia(), docGia.getHoTen(), docGia.getNgaySinh(), docGia.getGioiTinh(), docGia.getSoDienThoai(), docGia.getEmail(), docGia.getDiaChi(), docGia.getNgayDangKy(), docGia.getTrangThai()}); // Thêm một dòng chứa đầy đủ thuộc tính độc giả
        } // Kết thúc vòng lặp hiển thị độc giả
    } // Kết thúc phương thức hienThiDanhSach

    private void themDocGia() { // Tạo phương thức xử lý nút Thêm
        try { // Bắt đầu khối kiểm tra và thêm dữ liệu
            DocGia docGia = docDocGiaTuForm(); // Chuyển dữ liệu trong các ô nhập thành đối tượng DocGia
            docGia.setId(null); // Bỏ ID vì MySQL sẽ tự tạo khi thêm mới
            if (controller.them(docGia)) { // Yêu cầu controller thêm độc giả và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Thêm độc giả thành công"); // Thông báo thao tác thêm đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi thêm
            } else { // Xử lý trường hợp không có dòng nào được thêm
                JOptionPane.showMessageDialog(this, "Không thể thêm độc giả", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo thao tác thêm không thành công
            } // Kết thúc điều kiện kiểm tra kết quả thêm
        } catch (RuntimeException exception) { // Bắt lỗi nhập liệu hoặc lỗi cơ sở dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức themDocGia

    private void suaDocGia() { // Tạo phương thức xử lý nút Sửa
        if (txtId.getText().isBlank()) { // Kiểm tra người dùng đã chọn độc giả hay chưa
            JOptionPane.showMessageDialog(this, "Hãy chọn một độc giả trong bảng trước khi sửa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Hướng dẫn người dùng chọn độc giả
            return; // Dừng phương thức vì chưa có ID độc giả
        } // Kết thúc điều kiện kiểm tra độc giả được chọn
        try { // Bắt đầu khối kiểm tra và cập nhật dữ liệu
            DocGia docGia = docDocGiaTuForm(); // Chuyển dữ liệu mới trên form thành đối tượng DocGia
            if (controller.sua(docGia)) { // Yêu cầu controller cập nhật độc giả và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Cập nhật độc giả thành công"); // Thông báo thao tác sửa đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi sửa
            } else { // Xử lý trường hợp ID không tồn tại
                JOptionPane.showMessageDialog(this, "Không tìm thấy độc giả cần cập nhật", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo không có độc giả phù hợp
            } // Kết thúc điều kiện kiểm tra kết quả sửa
        } catch (RuntimeException exception) { // Bắt lỗi nhập liệu hoặc lỗi cơ sở dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức suaDocGia

    private void xoaDocGia() { // Tạo phương thức xử lý nút Xóa
        if (txtId.getText().isBlank()) { // Kiểm tra người dùng đã chọn độc giả hay chưa
            JOptionPane.showMessageDialog(this, "Hãy chọn một độc giả trong bảng trước khi xóa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Hướng dẫn người dùng chọn độc giả
            return; // Dừng phương thức vì chưa có ID độc giả
        } // Kết thúc điều kiện kiểm tra độc giả được chọn
        int luaChon = JOptionPane.showConfirmDialog(this, "Bạn có chắc muốn xóa độc giả đang chọn?", "Xác nhận xóa", JOptionPane.YES_NO_OPTION); // Hiển thị hộp xác nhận trước khi xóa
        if (luaChon != JOptionPane.YES_OPTION) { // Kiểm tra người dùng có đồng ý xóa hay không
            return; // Dừng phương thức khi người dùng chọn không
        } // Kết thúc điều kiện xác nhận
        try { // Bắt đầu khối xóa dữ liệu
            Long id = Long.valueOf(txtId.getText()); // Đọc ID của độc giả đang được chọn
            if (controller.xoa(id)) { // Yêu cầu controller xóa độc giả và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Xóa độc giả thành công"); // Thông báo thao tác xóa đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi xóa
            } else { // Xử lý trường hợp ID không tồn tại
                JOptionPane.showMessageDialog(this, "Không tìm thấy độc giả cần xóa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo không có độc giả phù hợp
            } // Kết thúc điều kiện kiểm tra kết quả xóa
        } catch (RuntimeException exception) { // Bắt lỗi cơ sở dữ liệu hoặc ràng buộc khóa ngoại
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức xoaDocGia

    private void timKiemDocGia() { // Tạo phương thức xử lý tìm kiếm độc giả
        try { // Bắt đầu khối tìm kiếm dữ liệu
            hienThiDanhSach(controller.timKiem(txtTimKiem.getText())); // Tìm theo họ tên và thay dữ liệu đang hiển thị trong JTable
        } catch (RuntimeException exception) { // Bắt lỗi kết nối hoặc truy vấn dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timKiemDocGia

    private DocGia docDocGiaTuForm() { // Tạo phương thức chuyển dữ liệu form thành Model DocGia
        DocGia docGia = new DocGia(); // Tạo đối tượng độc giả rỗng
        docGia.setId(docLongKhongBatBuoc(txtId, "ID")); // Đọc ID nếu đang sửa độc giả
        docGia.setTaiKhoanId(docLongKhongBatBuoc(txtTaiKhoanId, "Tài khoản ID")); // Đọc ID tài khoản có thể để trống
        docGia.setMaDocGia(txtMaDocGia.getText().trim()); // Đọc mã độc giả và bỏ khoảng trắng thừa
        docGia.setHoTen(txtHoTen.getText().trim()); // Đọc họ tên và bỏ khoảng trắng thừa
        docGia.setNgaySinh(docNgayKhongBatBuoc(txtNgaySinh, "Ngày sinh")); // Đọc ngày sinh có thể để trống
        docGia.setGioiTinh(docChuoiKhongBatBuoc(txtGioiTinh)); // Đọc giới tính có thể để trống
        docGia.setSoDienThoai(docChuoiKhongBatBuoc(txtSoDienThoai)); // Đọc số điện thoại có thể để trống
        docGia.setEmail(docChuoiKhongBatBuoc(txtEmail)); // Đọc email có thể để trống
        docGia.setDiaChi(docChuoiKhongBatBuoc(txtDiaChi)); // Đọc địa chỉ có thể để trống
        docGia.setNgayDangKy(docNgayBatBuoc(txtNgayDangKy, "Ngày đăng ký")); // Đọc ngày đăng ký bắt buộc
        docGia.setTrangThai(docChuoiKhongBatBuoc(txtTrangThai)); // Đọc trạng thái có thể để trống
        return docGia; // Trả về đối tượng độc giả đã nhận dữ liệu từ form
    } // Kết thúc phương thức docDocGiaTuForm

    private Long docLongKhongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc số Long có thể để trống
        if (oNhap.getText().isBlank()) { // Kiểm tra ô nhập có bị bỏ trống hay không
            return null; // Trả về null cho trường không bắt buộc
        } // Kết thúc điều kiện kiểm tra ô trống
        try { // Bắt đầu khối chuyển đổi số
            return Long.valueOf(oNhap.getText().trim()); // Chuyển chuỗi đã bỏ khoảng trắng thành số Long
        } catch (NumberFormatException exception) { // Bắt lỗi khi người dùng nhập không phải số
            throw new IllegalArgumentException(tenTruong + " phải là số nguyên"); // Báo lỗi nhập liệu dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docLongKhongBatBuoc

    private LocalDate docNgayBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc ngày bắt buộc
        if (oNhap.getText().isBlank()) { // Kiểm tra ô nhập có bị bỏ trống hay không
            throw new IllegalArgumentException(tenTruong + " không được để trống"); // Báo lỗi rõ tên trường bắt buộc
        } // Kết thúc điều kiện kiểm tra ô trống
        return docNgay(oNhap.getText(), tenTruong); // Chuyển nội dung ô nhập thành LocalDate
    } // Kết thúc phương thức docNgayBatBuoc

    private LocalDate docNgayKhongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc ngày có thể để trống
        return oNhap.getText().isBlank() ? null : docNgay(oNhap.getText(), tenTruong); // Trả về null hoặc ngày đã chuyển đổi
    } // Kết thúc phương thức docNgayKhongBatBuoc

    private LocalDate docNgay(String giaTri, String tenTruong) { // Tạo phương thức chuyển chuỗi thành ngày
        try { // Bắt đầu khối chuyển đổi ngày
            return LocalDate.parse(giaTri.trim()); // Chuyển chuỗi định dạng yyyy-MM-dd thành LocalDate
        } catch (DateTimeParseException exception) { // Bắt lỗi khi người dùng nhập sai định dạng ngày
            throw new IllegalArgumentException(tenTruong + " phải có định dạng yyyy-MM-dd"); // Báo lỗi định dạng ngày dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docNgay

    private String docChuoiKhongBatBuoc(JTextField oNhap) { // Tạo phương thức đọc chuỗi có thể để trống
        String giaTri = oNhap.getText().trim(); // Lấy nội dung và bỏ khoảng trắng thừa
        return giaTri.isEmpty() ? null : giaTri; // Trả về null nếu người dùng không nhập dữ liệu
    } // Kết thúc phương thức docChuoiKhongBatBuoc

    private void hienThiDocGiaDangChon() { // Tạo phương thức đưa dòng được chọn lên form
        int dong = tableDocGia.getSelectedRow(); // Lấy vị trí dòng đang được chọn
        if (dong < 0 || dong >= danhSachHienThi.size()) { // Kiểm tra vị trí dòng có hợp lệ hay không
            return; // Dừng phương thức nếu chưa chọn được độc giả
        } // Kết thúc điều kiện kiểm tra dòng
        DocGia docGia = danhSachHienThi.get(dong); // Lấy đối tượng độc giả tương ứng với dòng đã chọn
        txtId.setText(hienThiGiaTri(docGia.getId())); // Hiển thị ID độc giả
        txtTaiKhoanId.setText(hienThiGiaTri(docGia.getTaiKhoanId())); // Hiển thị ID tài khoản
        txtMaDocGia.setText(hienThiGiaTri(docGia.getMaDocGia())); // Hiển thị mã độc giả
        txtHoTen.setText(hienThiGiaTri(docGia.getHoTen())); // Hiển thị họ tên độc giả
        txtNgaySinh.setText(hienThiGiaTri(docGia.getNgaySinh())); // Hiển thị ngày sinh
        txtGioiTinh.setText(hienThiGiaTri(docGia.getGioiTinh())); // Hiển thị giới tính
        txtSoDienThoai.setText(hienThiGiaTri(docGia.getSoDienThoai())); // Hiển thị số điện thoại
        txtEmail.setText(hienThiGiaTri(docGia.getEmail())); // Hiển thị email
        txtDiaChi.setText(hienThiGiaTri(docGia.getDiaChi())); // Hiển thị địa chỉ
        txtNgayDangKy.setText(hienThiGiaTri(docGia.getNgayDangKy())); // Hiển thị ngày đăng ký
        txtTrangThai.setText(hienThiGiaTri(docGia.getTrangThai())); // Hiển thị trạng thái độc giả
    } // Kết thúc phương thức hienThiDocGiaDangChon

    private String hienThiGiaTri(Object giaTri) { // Tạo phương thức chuyển giá trị thành chuỗi an toàn
        return giaTri == null ? "" : giaTri.toString(); // Hiển thị chuỗi rỗng khi thuộc tính không có dữ liệu
    } // Kết thúc phương thức hienThiGiaTri

    private void lamMoi() { // Tạo phương thức làm mới form và danh sách
        txtId.setText(""); // Xóa ID đang chọn
        txtTaiKhoanId.setText(""); // Xóa ID tài khoản
        txtMaDocGia.setText(""); // Xóa mã độc giả
        txtHoTen.setText(""); // Xóa họ tên độc giả
        txtNgaySinh.setText(""); // Xóa ngày sinh
        txtGioiTinh.setText(""); // Xóa giới tính
        txtSoDienThoai.setText(""); // Xóa số điện thoại
        txtEmail.setText(""); // Xóa email
        txtDiaChi.setText(""); // Xóa địa chỉ
        txtNgayDangKy.setText(""); // Xóa ngày đăng ký
        txtTrangThai.setText(""); // Xóa trạng thái
        txtTimKiem.setText(""); // Xóa từ khóa tìm kiếm
        tableDocGia.clearSelection(); // Bỏ chọn dòng hiện tại trong bảng
        taiDanhSachDocGia(); // Tải lại toàn bộ danh sách từ MySQL
        txtMaDocGia.requestFocusInWindow(); // Đưa con trỏ về ô mã độc giả
    } // Kết thúc phương thức lamMoi

    private void hienThiLoi(RuntimeException exception) { // Tạo phương thức hiển thị lỗi thao tác
        String thongBao = exception.getMessage(); // Lấy thông báo lỗi gần nhất
        if (thongBao == null || thongBao.isBlank()) { // Kiểm tra thông báo lỗi có sử dụng được hay không
            thongBao = "Đã xảy ra lỗi khi xử lý dữ liệu độc giả"; // Dùng thông báo chung khi lỗi không có nội dung
        } // Kết thúc điều kiện kiểm tra thông báo
        JOptionPane.showMessageDialog(this, thongBao, "Lỗi", JOptionPane.ERROR_MESSAGE); // Hiển thị lỗi bằng hộp thoại Swing
    } // Kết thúc phương thức hienThiLoi

    public static void main(String[] args) { // Tạo điểm chạy riêng cho giao diện quản lý độc giả
        try { // Bắt đầu khối áp dụng giao diện của hệ điều hành
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); // Dùng kiểu hiển thị quen thuộc trên Windows
        } catch (Exception exception) { // Bắt lỗi khi hệ điều hành không hỗ trợ kiểu hiển thị
            System.out.println("Không thể dùng giao diện hệ thống, chương trình sẽ dùng giao diện mặc định"); // Thông báo ngắn gọn và tiếp tục chạy
        } // Kết thúc khối bắt lỗi giao diện
        SwingUtilities.invokeLater(() -> new DocGiaView().setVisible(true)); // Tạo và hiển thị cửa sổ trên luồng Swing
    } // Kết thúc phương thức main
} // Kết thúc lớp DocGiaView

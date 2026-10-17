package com.example.demoChuong.view; // Khai báo package chứa giao diện quản lý sách

import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach để đọc và ghi dữ liệu
import com.example.demoChuong.view.controller.SachViewController; // Nhập lớp điều khiển kết nối View với DAO

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
import java.math.BigDecimal; // Nhập kiểu số dùng cho giá tiền sách
import java.util.ArrayList; // Nhập lớp danh sách dùng để lưu dữ liệu đang hiển thị
import java.util.List; // Nhập kiểu danh sách chung

public class SachView extends JFrame { // Khai báo cửa sổ Swing quản lý sách
    private static final String[] TEN_COT = {"ID", "Mã sách", "Tên sách", "Danh mục ID", "NXB ID", "ISBN", "Năm XB", "Lần tái bản", "Ngôn ngữ", "Mô tả", "Giá tiền", "Số trang", "Ảnh bìa", "Trạng thái"}; // Khai báo tên các cột đúng với Model Sach
    private final SachViewController controller; // Lưu controller xử lý yêu cầu từ giao diện
    private final JTextField txtId = new JTextField(); // Tạo ô hiển thị ID sách
    private final JTextField txtMaSach = new JTextField(); // Tạo ô nhập mã sách
    private final JTextField txtTenSach = new JTextField(); // Tạo ô nhập tên sách
    private final JTextField txtDanhMucId = new JTextField(); // Tạo ô nhập ID danh mục
    private final JTextField txtNhaXuatBanId = new JTextField(); // Tạo ô nhập ID nhà xuất bản
    private final JTextField txtIsbn = new JTextField(); // Tạo ô nhập mã ISBN
    private final JTextField txtNamXuatBan = new JTextField(); // Tạo ô nhập năm xuất bản
    private final JTextField txtLanTaiBan = new JTextField(); // Tạo ô nhập lần tái bản
    private final JTextField txtNgonNgu = new JTextField(); // Tạo ô nhập ngôn ngữ
    private final JTextField txtMoTa = new JTextField(); // Tạo ô nhập mô tả sách
    private final JTextField txtGiaTien = new JTextField(); // Tạo ô nhập giá tiền
    private final JTextField txtSoTrang = new JTextField(); // Tạo ô nhập số trang
    private final JTextField txtAnhBia = new JTextField(); // Tạo ô nhập đường dẫn ảnh bìa
    private final JTextField txtTrangThai = new JTextField(); // Tạo ô nhập trạng thái sách
    private final JTextField txtTimKiem = new JTextField(28); // Tạo ô nhập từ khóa tìm kiếm
    private final JButton btnThem = new JButton("Thêm"); // Tạo nút thêm sách
    private final JButton btnSua = new JButton("Sửa"); // Tạo nút sửa sách
    private final JButton btnXoa = new JButton("Xóa"); // Tạo nút xóa sách
    private final JButton btnLamMoi = new JButton("Làm mới"); // Tạo nút làm mới giao diện
    private final JButton btnTimKiem = new JButton("Tìm kiếm"); // Tạo nút tìm kiếm sách
    private final DefaultTableModel tableModel = new DefaultTableModel(TEN_COT, 0) { // Tạo mô hình dữ liệu cho bảng sách
        @Override // Đánh dấu phương thức được viết lại từ DefaultTableModel
        public boolean isCellEditable(int row, int column) { // Kiểm tra ô trong bảng có được sửa trực tiếp hay không
            return false; // Không cho sửa trực tiếp để dữ liệu chỉ thay đổi qua nút Sửa
        } // Kết thúc phương thức isCellEditable
    }; // Kết thúc đối tượng tableModel
    private final JTable tableSach = new JTable(tableModel); // Tạo JTable sử dụng mô hình dữ liệu sách
    private List<Sach> danhSachHienThi = new ArrayList<>(); // Lưu danh sách tương ứng với các dòng đang hiển thị

    public SachView() { // Tạo hàm khởi tạo mặc định cho cửa sổ quản lý sách
        this(new SachViewController()); // Tạo controller Swing dùng SachDAO của tuần 2
    } // Kết thúc hàm khởi tạo mặc định

    public SachView(SachViewController controller) { // Tạo hàm khởi tạo cho phép truyền controller khi kiểm thử
        this.controller = controller; // Lưu controller được truyền vào
        khoiTaoGiaoDien(); // Tạo và sắp xếp các thành phần giao diện
        ganSuKien(); // Gắn sự kiện cho nút bấm và JTable
        taiDanhSachSach(); // Đọc dữ liệu MySQL để hiển thị khi mở cửa sổ
    } // Kết thúc hàm khởi tạo có tham số

    private void khoiTaoGiaoDien() { // Tạo phương thức khởi tạo toàn bộ giao diện
        setTitle("Quản lý sách"); // Đặt tiêu đề trên thanh cửa sổ
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Chỉ đóng cửa sổ hiện tại khi người dùng thoát
        setMinimumSize(new Dimension(1180, 720)); // Đặt kích thước tối thiểu để giao diện dễ nhìn
        setSize(1380, 820); // Đặt kích thước ban đầu cho cửa sổ
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
        JLabel tieuDe = new JLabel("QUẢN LÝ SÁCH", SwingConstants.CENTER); // Tạo nhãn tiêu đề và căn giữa
        tieuDe.setFont(new Font("Arial", Font.BOLD, 24)); // Đặt phông chữ rõ ràng cho tiêu đề
        return tieuDe; // Trả về nhãn tiêu đề đã tạo
    } // Kết thúc phương thức taoTieuDe

    private JPanel taoFormNhap() { // Tạo phương thức sinh khu vực nhập thông tin sách
        JPanel form = new JPanel(new GridLayout(7, 4, 10, 8)); // Tạo lưới bảy hàng với hai cặp nhãn và ô nhập
        form.setBorder(BorderFactory.createTitledBorder("Thông tin sách")); // Đặt tiêu đề cho khu vực nhập liệu
        txtId.setEditable(false); // Không cho người dùng tự sửa ID do MySQL tự tạo
        themTruongNhap(form, "ID", txtId); // Thêm ô ID vào form
        themTruongNhap(form, "Mã sách (*)", txtMaSach); // Thêm ô mã sách vào form
        themTruongNhap(form, "Tên sách (*)", txtTenSach); // Thêm ô tên sách vào form
        themTruongNhap(form, "Danh mục ID (*)", txtDanhMucId); // Thêm ô ID danh mục vào form
        themTruongNhap(form, "Nhà xuất bản ID", txtNhaXuatBanId); // Thêm ô ID nhà xuất bản vào form
        themTruongNhap(form, "ISBN", txtIsbn); // Thêm ô ISBN vào form
        themTruongNhap(form, "Năm xuất bản", txtNamXuatBan); // Thêm ô năm xuất bản vào form
        themTruongNhap(form, "Lần tái bản", txtLanTaiBan); // Thêm ô lần tái bản vào form
        themTruongNhap(form, "Ngôn ngữ", txtNgonNgu); // Thêm ô ngôn ngữ vào form
        themTruongNhap(form, "Mô tả", txtMoTa); // Thêm ô mô tả vào form
        themTruongNhap(form, "Giá tiền", txtGiaTien); // Thêm ô giá tiền vào form
        themTruongNhap(form, "Số trang", txtSoTrang); // Thêm ô số trang vào form
        themTruongNhap(form, "Ảnh bìa", txtAnhBia); // Thêm ô đường dẫn ảnh bìa vào form
        themTruongNhap(form, "Trạng thái", txtTrangThai); // Thêm ô trạng thái vào form
        return form; // Trả về form nhập liệu đã hoàn thành
    } // Kết thúc phương thức taoFormNhap

    private void themTruongNhap(JPanel form, String tenNhan, JTextField oNhap) { // Tạo phương thức thêm một nhãn và một ô nhập vào form
        form.add(new JLabel(tenNhan)); // Thêm nhãn mô tả trường dữ liệu
        form.add(oNhap); // Thêm ô nhập tương ứng ngay sau nhãn
    } // Kết thúc phương thức themTruongNhap

    private JPanel taoKhuVucBang() { // Tạo phương thức sinh khu vực tìm kiếm và bảng sách
        JPanel khuVucBang = new JPanel(new BorderLayout(8, 8)); // Tạo panel chứa thanh tìm kiếm và bảng
        JPanel timKiem = new JPanel(new FlowLayout(FlowLayout.LEFT)); // Tạo hàng tìm kiếm căn về bên trái
        timKiem.add(new JLabel("Tên sách")); // Thêm nhãn hướng dẫn nhập từ khóa
        timKiem.add(txtTimKiem); // Thêm ô nhập từ khóa
        timKiem.add(btnTimKiem); // Thêm nút thực hiện tìm kiếm
        khuVucBang.add(timKiem, BorderLayout.NORTH); // Đặt hàng tìm kiếm phía trên bảng
        tableSach.setSelectionMode(ListSelectionModel.SINGLE_SELECTION); // Chỉ cho chọn một sách tại một thời điểm
        tableSach.setAutoResizeMode(JTable.AUTO_RESIZE_OFF); // Cho phép thanh cuộn ngang khi bảng có nhiều cột
        for (int cot = 0; cot < tableSach.getColumnCount(); cot++) { // Lặp qua tất cả cột trong JTable
            tableSach.getColumnModel().getColumn(cot).setPreferredWidth(cot == 2 || cot == 9 ? 180 : 105); // Đặt cột tên và mô tả rộng hơn các cột còn lại
        } // Kết thúc vòng lặp chỉnh độ rộng cột
        JScrollPane thanhCuon = new JScrollPane(tableSach); // Tạo thanh cuộn bao quanh JTable
        thanhCuon.setBorder(BorderFactory.createTitledBorder("Danh sách sách")); // Đặt tiêu đề cho khu vực danh sách
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
        btnThem.addActionListener(event -> themSach()); // Gọi chức năng thêm khi nhấn nút Thêm
        btnSua.addActionListener(event -> suaSach()); // Gọi chức năng sửa khi nhấn nút Sửa
        btnXoa.addActionListener(event -> xoaSach()); // Gọi chức năng xóa khi nhấn nút Xóa
        btnLamMoi.addActionListener(event -> lamMoi()); // Gọi chức năng làm mới khi nhấn nút Làm mới
        btnTimKiem.addActionListener(event -> timKiemSach()); // Gọi chức năng tìm kiếm khi nhấn nút Tìm kiếm
        txtTimKiem.addActionListener(event -> timKiemSach()); // Cho phép nhấn Enter trong ô tìm kiếm
        tableSach.getSelectionModel().addListSelectionListener(event -> { // Theo dõi khi người dùng chọn một dòng trong bảng
            if (!event.getValueIsAdjusting()) { // Chỉ xử lý sau khi thao tác chọn đã hoàn tất
                hienThiSachDangChon(); // Đưa dữ liệu của dòng được chọn lên form
            } // Kết thúc điều kiện kiểm tra sự kiện chọn
        }); // Kết thúc phần gắn sự kiện chọn dòng
    } // Kết thúc phương thức ganSuKien

    private void taiDanhSachSach() { // Tạo phương thức tải toàn bộ sách từ MySQL
        try { // Bắt đầu khối xử lý có thể phát sinh lỗi kết nối
            hienThiDanhSach(controller.layTatCa()); // Nhờ controller lấy dữ liệu rồi hiển thị lên JTable
        } catch (RuntimeException exception) { // Bắt lỗi khi controller hoặc DAO không đọc được dữ liệu
            hienThiLoi(exception); // Hiển thị thông báo lỗi dễ hiểu cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức taiDanhSachSach

    private void hienThiDanhSach(List<Sach> danhSach) { // Tạo phương thức đưa danh sách sách lên JTable
        danhSachHienThi = new ArrayList<>(danhSach); // Lưu bản sao danh sách để dùng khi chọn dòng
        tableModel.setRowCount(0); // Xóa các dòng cũ trước khi hiển thị dữ liệu mới
        for (Sach sach : danhSachHienThi) { // Lặp qua từng sách trong danh sách
            tableModel.addRow(new Object[]{sach.getId(), sach.getMaSach(), sach.getTenSach(), sach.getDanhMucId(), sach.getNhaXuatBanId(), sach.getIsbn(), sach.getNamXuatBan(), sach.getLanTaiBan(), sach.getNgonNgu(), sach.getMoTa(), sach.getGiaTien(), sach.getSoTrang(), sach.getAnhBia(), sach.getTrangThai()}); // Thêm một dòng chứa đầy đủ thuộc tính sách
        } // Kết thúc vòng lặp hiển thị sách
    } // Kết thúc phương thức hienThiDanhSach

    private void themSach() { // Tạo phương thức xử lý nút Thêm
        try { // Bắt đầu khối kiểm tra và thêm dữ liệu
            Sach sach = docSachTuForm(); // Chuyển dữ liệu trong các ô nhập thành đối tượng Sach
            sach.setId(null); // Bỏ ID vì MySQL sẽ tự tạo khi thêm mới
            if (controller.them(sach)) { // Yêu cầu controller thêm sách và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Thêm sách thành công"); // Thông báo thao tác thêm đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi thêm
            } else { // Xử lý trường hợp không có dòng nào được thêm
                JOptionPane.showMessageDialog(this, "Không thể thêm sách", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo thao tác thêm không thành công
            } // Kết thúc điều kiện kiểm tra kết quả thêm
        } catch (RuntimeException exception) { // Bắt lỗi nhập liệu hoặc lỗi cơ sở dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức themSach

    private void suaSach() { // Tạo phương thức xử lý nút Sửa
        if (txtId.getText().isBlank()) { // Kiểm tra người dùng đã chọn sách hay chưa
            JOptionPane.showMessageDialog(this, "Hãy chọn một sách trong bảng trước khi sửa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Hướng dẫn người dùng chọn sách
            return; // Dừng phương thức vì chưa có ID sách
        } // Kết thúc điều kiện kiểm tra sách được chọn
        try { // Bắt đầu khối kiểm tra và cập nhật dữ liệu
            Sach sach = docSachTuForm(); // Chuyển dữ liệu mới trên form thành đối tượng Sach
            if (controller.sua(sach)) { // Yêu cầu controller cập nhật sách và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Cập nhật sách thành công"); // Thông báo thao tác sửa đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi sửa
            } else { // Xử lý trường hợp ID không tồn tại
                JOptionPane.showMessageDialog(this, "Không tìm thấy sách cần cập nhật", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo không có sách phù hợp
            } // Kết thúc điều kiện kiểm tra kết quả sửa
        } catch (RuntimeException exception) { // Bắt lỗi nhập liệu hoặc lỗi cơ sở dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức suaSach

    private void xoaSach() { // Tạo phương thức xử lý nút Xóa
        if (txtId.getText().isBlank()) { // Kiểm tra người dùng đã chọn sách hay chưa
            JOptionPane.showMessageDialog(this, "Hãy chọn một sách trong bảng trước khi xóa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Hướng dẫn người dùng chọn sách
            return; // Dừng phương thức vì chưa có ID sách
        } // Kết thúc điều kiện kiểm tra sách được chọn
        int luaChon = JOptionPane.showConfirmDialog(this, "Bạn có chắc muốn xóa sách đang chọn?", "Xác nhận xóa", JOptionPane.YES_NO_OPTION); // Hiển thị hộp xác nhận trước khi xóa
        if (luaChon != JOptionPane.YES_OPTION) { // Kiểm tra người dùng có đồng ý xóa hay không
            return; // Dừng phương thức khi người dùng chọn không
        } // Kết thúc điều kiện xác nhận
        try { // Bắt đầu khối xóa dữ liệu
            Long id = Long.valueOf(txtId.getText()); // Đọc ID của sách đang được chọn
            if (controller.xoa(id)) { // Yêu cầu controller xóa sách và kiểm tra kết quả
                JOptionPane.showMessageDialog(this, "Xóa sách thành công"); // Thông báo thao tác xóa đã thành công
                lamMoi(); // Xóa form và tải lại JTable sau khi xóa
            } else { // Xử lý trường hợp ID không tồn tại
                JOptionPane.showMessageDialog(this, "Không tìm thấy sách cần xóa", "Thông báo", JOptionPane.WARNING_MESSAGE); // Thông báo không có sách phù hợp
            } // Kết thúc điều kiện kiểm tra kết quả xóa
        } catch (RuntimeException exception) { // Bắt lỗi cơ sở dữ liệu hoặc ràng buộc khóa ngoại
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức xoaSach

    private void timKiemSach() { // Tạo phương thức xử lý tìm kiếm sách
        try { // Bắt đầu khối tìm kiếm dữ liệu
            hienThiDanhSach(controller.timKiem(txtTimKiem.getText())); // Tìm theo tên và thay dữ liệu đang hiển thị trong JTable
        } catch (RuntimeException exception) { // Bắt lỗi kết nối hoặc truy vấn dữ liệu
            hienThiLoi(exception); // Hiển thị lỗi cho người dùng
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức timKiemSach

    private Sach docSachTuForm() { // Tạo phương thức chuyển dữ liệu form thành Model Sach
        Sach sach = new Sach(); // Tạo đối tượng sách rỗng
        sach.setId(docLongKhongBatBuoc(txtId, "ID")); // Đọc ID nếu đang sửa sách
        sach.setMaSach(txtMaSach.getText().trim()); // Đọc mã sách và bỏ khoảng trắng thừa
        sach.setTenSach(txtTenSach.getText().trim()); // Đọc tên sách và bỏ khoảng trắng thừa
        sach.setDanhMucId(docLongBatBuoc(txtDanhMucId, "Danh mục ID")); // Đọc ID danh mục bắt buộc
        sach.setNhaXuatBanId(docLongKhongBatBuoc(txtNhaXuatBanId, "Nhà xuất bản ID")); // Đọc ID nhà xuất bản có thể để trống
        sach.setIsbn(docChuoiKhongBatBuoc(txtIsbn)); // Đọc ISBN có thể để trống
        sach.setNamXuatBan(docIntegerKhongBatBuoc(txtNamXuatBan, "Năm xuất bản")); // Đọc năm xuất bản có thể để trống
        sach.setLanTaiBan(docIntegerKhongBatBuoc(txtLanTaiBan, "Lần tái bản")); // Đọc lần tái bản có thể để trống
        sach.setNgonNgu(docChuoiKhongBatBuoc(txtNgonNgu)); // Đọc ngôn ngữ có thể để trống
        sach.setMoTa(docChuoiKhongBatBuoc(txtMoTa)); // Đọc mô tả có thể để trống
        sach.setGiaTien(docBigDecimalKhongBatBuoc(txtGiaTien, "Giá tiền")); // Đọc giá tiền có thể để trống
        sach.setSoTrang(docIntegerKhongBatBuoc(txtSoTrang, "Số trang")); // Đọc số trang có thể để trống
        sach.setAnhBia(docChuoiKhongBatBuoc(txtAnhBia)); // Đọc đường dẫn ảnh bìa có thể để trống
        sach.setTrangThai(docChuoiKhongBatBuoc(txtTrangThai)); // Đọc trạng thái có thể để trống
        return sach; // Trả về đối tượng sách đã nhận dữ liệu từ form
    } // Kết thúc phương thức docSachTuForm

    private Long docLongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc số Long bắt buộc
        if (oNhap.getText().isBlank()) { // Kiểm tra ô nhập có bị bỏ trống hay không
            throw new IllegalArgumentException(tenTruong + " không được để trống"); // Báo lỗi rõ tên trường bắt buộc
        } // Kết thúc điều kiện kiểm tra ô trống
        return docLong(oNhap.getText(), tenTruong); // Chuyển nội dung ô nhập thành số Long
    } // Kết thúc phương thức docLongBatBuoc

    private Long docLongKhongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc số Long có thể để trống
        return oNhap.getText().isBlank() ? null : docLong(oNhap.getText(), tenTruong); // Trả về null hoặc số Long đã chuyển đổi
    } // Kết thúc phương thức docLongKhongBatBuoc

    private Long docLong(String giaTri, String tenTruong) { // Tạo phương thức chuyển chuỗi thành số Long
        try { // Bắt đầu khối chuyển đổi số
            return Long.valueOf(giaTri.trim()); // Chuyển chuỗi đã bỏ khoảng trắng thành số Long
        } catch (NumberFormatException exception) { // Bắt lỗi khi người dùng nhập không phải số
            throw new IllegalArgumentException(tenTruong + " phải là số nguyên"); // Báo lỗi nhập liệu dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docLong

    private Integer docIntegerKhongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc số Integer có thể để trống
        if (oNhap.getText().isBlank()) { // Kiểm tra ô nhập có bị bỏ trống hay không
            return null; // Trả về null cho trường không bắt buộc
        } // Kết thúc điều kiện kiểm tra ô trống
        try { // Bắt đầu khối chuyển đổi số
            return Integer.valueOf(oNhap.getText().trim()); // Chuyển chuỗi đã bỏ khoảng trắng thành số Integer
        } catch (NumberFormatException exception) { // Bắt lỗi khi người dùng nhập không phải số
            throw new IllegalArgumentException(tenTruong + " phải là số nguyên"); // Báo lỗi nhập liệu dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docIntegerKhongBatBuoc

    private BigDecimal docBigDecimalKhongBatBuoc(JTextField oNhap, String tenTruong) { // Tạo phương thức đọc số thập phân có thể để trống
        if (oNhap.getText().isBlank()) { // Kiểm tra ô nhập có bị bỏ trống hay không
            return null; // Trả về null cho trường không bắt buộc
        } // Kết thúc điều kiện kiểm tra ô trống
        try { // Bắt đầu khối chuyển đổi số thập phân
            return new BigDecimal(oNhap.getText().trim()); // Chuyển chuỗi thành BigDecimal để giữ chính xác giá tiền
        } catch (NumberFormatException exception) { // Bắt lỗi khi người dùng nhập không phải số
            throw new IllegalArgumentException(tenTruong + " phải là số hợp lệ"); // Báo lỗi nhập liệu dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docBigDecimalKhongBatBuoc

    private String docChuoiKhongBatBuoc(JTextField oNhap) { // Tạo phương thức đọc chuỗi có thể để trống
        String giaTri = oNhap.getText().trim(); // Lấy nội dung và bỏ khoảng trắng thừa
        return giaTri.isEmpty() ? null : giaTri; // Trả về null nếu người dùng không nhập dữ liệu
    } // Kết thúc phương thức docChuoiKhongBatBuoc

    private void hienThiSachDangChon() { // Tạo phương thức đưa dòng được chọn lên form
        int dong = tableSach.getSelectedRow(); // Lấy vị trí dòng đang được chọn
        if (dong < 0 || dong >= danhSachHienThi.size()) { // Kiểm tra vị trí dòng có hợp lệ hay không
            return; // Dừng phương thức nếu chưa chọn được sách
        } // Kết thúc điều kiện kiểm tra dòng
        Sach sach = danhSachHienThi.get(dong); // Lấy đối tượng sách tương ứng với dòng đã chọn
        txtId.setText(hienThiGiaTri(sach.getId())); // Hiển thị ID sách
        txtMaSach.setText(hienThiGiaTri(sach.getMaSach())); // Hiển thị mã sách
        txtTenSach.setText(hienThiGiaTri(sach.getTenSach())); // Hiển thị tên sách
        txtDanhMucId.setText(hienThiGiaTri(sach.getDanhMucId())); // Hiển thị ID danh mục
        txtNhaXuatBanId.setText(hienThiGiaTri(sach.getNhaXuatBanId())); // Hiển thị ID nhà xuất bản
        txtIsbn.setText(hienThiGiaTri(sach.getIsbn())); // Hiển thị ISBN
        txtNamXuatBan.setText(hienThiGiaTri(sach.getNamXuatBan())); // Hiển thị năm xuất bản
        txtLanTaiBan.setText(hienThiGiaTri(sach.getLanTaiBan())); // Hiển thị lần tái bản
        txtNgonNgu.setText(hienThiGiaTri(sach.getNgonNgu())); // Hiển thị ngôn ngữ
        txtMoTa.setText(hienThiGiaTri(sach.getMoTa())); // Hiển thị mô tả
        txtGiaTien.setText(hienThiGiaTri(sach.getGiaTien())); // Hiển thị giá tiền
        txtSoTrang.setText(hienThiGiaTri(sach.getSoTrang())); // Hiển thị số trang
        txtAnhBia.setText(hienThiGiaTri(sach.getAnhBia())); // Hiển thị đường dẫn ảnh bìa
        txtTrangThai.setText(hienThiGiaTri(sach.getTrangThai())); // Hiển thị trạng thái sách
    } // Kết thúc phương thức hienThiSachDangChon

    private String hienThiGiaTri(Object giaTri) { // Tạo phương thức chuyển giá trị thành chuỗi an toàn
        return giaTri == null ? "" : giaTri.toString(); // Hiển thị chuỗi rỗng khi thuộc tính không có dữ liệu
    } // Kết thúc phương thức hienThiGiaTri

    private void lamMoi() { // Tạo phương thức làm mới form và danh sách
        txtId.setText(""); // Xóa ID đang chọn
        txtMaSach.setText(""); // Xóa mã sách
        txtTenSach.setText(""); // Xóa tên sách
        txtDanhMucId.setText(""); // Xóa ID danh mục
        txtNhaXuatBanId.setText(""); // Xóa ID nhà xuất bản
        txtIsbn.setText(""); // Xóa ISBN
        txtNamXuatBan.setText(""); // Xóa năm xuất bản
        txtLanTaiBan.setText(""); // Xóa lần tái bản
        txtNgonNgu.setText(""); // Xóa ngôn ngữ
        txtMoTa.setText(""); // Xóa mô tả
        txtGiaTien.setText(""); // Xóa giá tiền
        txtSoTrang.setText(""); // Xóa số trang
        txtAnhBia.setText(""); // Xóa đường dẫn ảnh bìa
        txtTrangThai.setText(""); // Xóa trạng thái
        txtTimKiem.setText(""); // Xóa từ khóa tìm kiếm
        tableSach.clearSelection(); // Bỏ chọn dòng hiện tại trong bảng
        taiDanhSachSach(); // Tải lại toàn bộ danh sách từ MySQL
        txtMaSach.requestFocusInWindow(); // Đưa con trỏ về ô mã sách
    } // Kết thúc phương thức lamMoi

    private void hienThiLoi(RuntimeException exception) { // Tạo phương thức hiển thị lỗi thao tác
        String thongBao = exception.getMessage(); // Lấy thông báo lỗi gần nhất
        if (thongBao == null || thongBao.isBlank()) { // Kiểm tra thông báo lỗi có sử dụng được hay không
            thongBao = "Đã xảy ra lỗi khi xử lý dữ liệu sách"; // Dùng thông báo chung khi lỗi không có nội dung
        } // Kết thúc điều kiện kiểm tra thông báo
        JOptionPane.showMessageDialog(this, thongBao, "Lỗi", JOptionPane.ERROR_MESSAGE); // Hiển thị lỗi bằng hộp thoại Swing
    } // Kết thúc phương thức hienThiLoi

    public static void main(String[] args) { // Tạo điểm chạy riêng cho giao diện quản lý sách
        try { // Bắt đầu khối áp dụng giao diện của hệ điều hành
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); // Dùng kiểu hiển thị quen thuộc trên Windows
        } catch (Exception exception) { // Bắt lỗi khi hệ điều hành không hỗ trợ kiểu hiển thị
            System.out.println("Không thể dùng giao diện hệ thống, chương trình sẽ dùng giao diện mặc định"); // Thông báo ngắn gọn và tiếp tục chạy
        } // Kết thúc khối bắt lỗi giao diện
        SwingUtilities.invokeLater(() -> new SachView().setVisible(true)); // Tạo và hiển thị cửa sổ trên luồng Swing
    } // Kết thúc phương thức main
} // Kết thúc lớp SachView

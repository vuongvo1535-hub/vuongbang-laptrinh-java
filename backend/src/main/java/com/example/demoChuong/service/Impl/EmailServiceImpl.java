package com.example.demoChuong.service.Impl;

import com.example.demoChuong.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:thuvienso.demo@gmail.com}")
    private String fromEmail;

    private String dinhDangTien(BigDecimal soTien) {
        if (soTien == null) return "0 ₫";
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        return nf.format(soTien) + " ₫";
    }

    @Override
    public Map<String, Object> guiEmailThongBaoThanhToan(
            String emailNhan,
            String tenDocGia,
            String maGiaoDich,
            BigDecimal soTien,
            String noiDung,
            String lyDo,
            String tenSach
    ) {
        Map<String, Object> res = new HashMap<>();

        if (emailNhan == null || emailNhan.trim().isEmpty() || !emailNhan.contains("@")) {
            res.put("success", false);
            res.put("message", "Địa chỉ email không hợp lệ hoặc để trống: " + emailNhan);
            return res;
        }

        try {
            String thoiGian = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));
            String tieuDe = "Biên lai xác nhận thanh toán MoMo - Thư Viện Số [" + maGiaoDich + "]";

            String templateHtml = """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
                        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                        .header { background: linear-gradient(135deg, #a50064, #d82d8b); padding: 30px 20px; text-align: center; color: white; }
                        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
                        .header p { margin: 6px 0 0; opacity: 0.9; font-size: 13px; }
                        .body { padding: 30px 25px; }
                        .status-badge { display: inline-block; background-color: #e6f7ec; color: #027a48; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 13px; margin-bottom: 20px; }
                        .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        .info-table td { padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
                        .info-table td:first-child { color: #667085; width: 40%; }
                        .info-table td:last-child { font-weight: 600; color: #101828; text-align: right; }
                        .amount { font-size: 20px !important; color: #d82d8b !important; font-weight: 800 !important; }
                        .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
                        .note-box { background: #fff8eb; border-left: 4px solid #f79009; padding: 12px; border-radius: 6px; font-size: 13px; color: #b54708; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="header">
                            <h1>XÁC NHẬN THANH TOÁN MOMO THÀNH CÔNG</h1>
                            <p>Hệ thống Quản lý Thư viện Số</p>
                        </div>
                        <div class="body">
                            <div style="text-align: center;">
                                <span class="status-badge">✔ GIAO DỊCH ĐÃ HOÀN TẤT</span>
                            </div>
                            <p>Kính gửi <b>{{tenDocGia}}</b>,</p>
                            <p>Cảm ơn bạn đã hoàn tất khoản thanh toán qua ví điện tử MoMo. Dưới đây là thông tin chi tiết biên lai giao dịch:</p>
                            
                            <table class="info-table">
                                <tr>
                                    <td>Mã giao dịch MoMo:</td>
                                    <td style="font-family: monospace; color: #a50064;">{{maGiaoDich}}</td>
                                </tr>
                                <tr>
                                    <td>Số tiền đã thanh toán:</td>
                                    <td class="amount">{{soTien}}</td>
                                </tr>
                                <tr>
                                    <td>Nội dung thanh toán:</td>
                                    <td>{{noiDung}}</td>
                                </tr>
                                <tr>
                                    <td>Khoản mục:</td>
                                    <td>{{lyDo}}</td>
                                </tr>
                                <tr>
                                    <td>Tài liệu liên quan:</td>
                                    <td>{{tenSach}}</td>
                                </tr>
                                <tr>
                                    <td>Thời gian giao dịch:</td>
                                    <td>{{thoiGian}}</td>
                                </tr>
                                <tr>
                                    <td>Trạng thái khoản phạt:</td>
                                    <td style="color: #027a48;">ĐÃ THANH TOÁN XONG</td>
                                </tr>
                            </table>

                            <div class="note-box">
                                ℹ <b>Lưu ý:</b> Vui lòng lưu lại email này để làm biên lai đối chiếu khi cần thiết tại quầy thủ thư.
                            </div>
                        </div>
                        <div class="footer">
                            <p>Thư Viện Số - Hệ thống quản lý mượn trả & tra cứu tài liệu học tập</p>
                            <p>Email này được gửi tự động từ hệ thống, vui lòng không phản hồi.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;

            // Thay thế an toàn bằng replace thay vì formatted để tránh lỗi CSS percentage (%)
            String noiDungHtml = templateHtml
                    .replace("{{tenDocGia}}", tenDocGia != null ? tenDocGia : "Độc giả")
                    .replace("{{maGiaoDich}}", maGiaoDich != null ? maGiaoDich : "MOMO_TEST")
                    .replace("{{soTien}}", dinhDangTien(soTien))
                    .replace("{{noiDung}}", noiDung != null ? noiDung : "Nộp phí phạt thư viện")
                    .replace("{{lyDo}}", lyDo != null ? lyDo : "Tiền phạt thư viện")
                    .replace("{{tenSach}}", tenSach != null ? tenSach : "Tài liệu mượn")
                    .replace("{{thoiGian}}", thoiGian);

            if (mailSender == null) {
                log.warn("[EMAIL DEMO] JavaMailSender chưa được cấu hình. Nội dung email gửi đến: {}", emailNhan);
                res.put("success", false);
                res.put("message", "Chưa khởi tạo cấu hình JavaMailSender trong Spring context.");
                return res;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Thư Viện Số - MoMo Payment");
            helper.setTo(emailNhan);
            helper.setSubject(tieuDe);
            helper.setText(noiDungHtml, true);

            mailSender.send(message);

            log.info("Đã gửi email xác nhận thanh toán MoMo thành công tới: {}", emailNhan);
            res.put("success", true);
            res.put("message", "Đã gửi email thông báo thành công đến " + emailNhan);
            return res;
        } catch (Exception ex) {
            log.warn("Không thể gửi email qua Gmail SMTP tới {}: {}", emailNhan, ex.getMessage());
            res.put("success", false);
            res.put("message", "Lỗi gửi email: " + ex.getMessage());
            res.put("hint", "Vui lòng kiểm tra email và Mật khẩu ứng dụng trong application.properties");
            return res;
        }
    }

    @Override
    public Map<String, Object> guiEmailTest(String toEmail) {
        return guiEmailThongBaoThanhToan(
                toEmail,
                "Độc giả Thử nghiệm",
                "MOMO_TEST_" + System.currentTimeMillis(),
                BigDecimal.valueOf(25000),
                "NOP_PHAT_TEST",
                "Phạt trễ hạn trả sách (Demo test email)",
                "Giáo trình Cấu trúc dữ liệu và giải thuật"
        );
    }
}

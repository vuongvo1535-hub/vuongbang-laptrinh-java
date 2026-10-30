package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import com.example.demoChuong.entity.ChiTietTienPhat;
import com.example.demoChuong.entity.TienPhat;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.*;
import com.example.demoChuong.service.EmailService;
import com.example.demoChuong.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final TienPhatRepository tienPhatRepository;
    private final ChiTietTienPhatRepository chiTietTienPhatRepository;
    private final ChiTietPhieuMuonRepository chiTietPhieuMuonRepository;
    private final PhieuMuonRepository phieuMuonRepository;
    private final DocGiaRepository docGiaRepository;
    private final BanSaoSachRepository banSaoSachRepository;
    private final SachRepository sachRepository;
    private final EmailService emailService;

    // Thông tin ví MoMo / Ngân hàng thư viện mặc định
    private static final String SO_DIEN_THOAI_MOMO = "0382450875";
    private static final String TEN_NGUOI_NHAN = "THU VIEN SO";
    private static final String MA_NGAN_HANG = "momo"; // Ví MoMo chuẩn Napas VietQR (mã BIN 971025)

    public PaymentServiceImpl(
            TienPhatRepository tienPhatRepository,
            ChiTietTienPhatRepository chiTietTienPhatRepository,
            ChiTietPhieuMuonRepository chiTietPhieuMuonRepository,
            PhieuMuonRepository phieuMuonRepository,
            DocGiaRepository docGiaRepository,
            BanSaoSachRepository banSaoSachRepository,
            SachRepository sachRepository,
            EmailService emailService
    ) {
        this.tienPhatRepository = tienPhatRepository;
        this.chiTietTienPhatRepository = chiTietTienPhatRepository;
        this.chiTietPhieuMuonRepository = chiTietPhieuMuonRepository;
        this.phieuMuonRepository = phieuMuonRepository;
        this.docGiaRepository = docGiaRepository;
        this.banSaoSachRepository = banSaoSachRepository;
        this.sachRepository = sachRepository;
        this.emailService = emailService;
    }

    @Override
    public String taoMaGiaoDichGia() {
        long randomNum = (long) (Math.random() * 900000000L) + 100000000L;
        return "MOMO_DEMO_" + randomNum;
    }

    @Override
    public MoMoPaymentDTO taoMaThanhToanMoMo(Long tienPhatId) {
        // Hỗ trợ chế độ Demo trực tiếp khi tienPhatId <= 0 hoặc null
        if (tienPhatId == null || tienPhatId <= 0) {
            BigDecimal soTienDemo = new BigDecimal("25000");
            String noiDungDemo = "NOP_PHAT_DEMO";
            String qrUrl = String.format(
                    "https://img.vietqr.io/image/%s-%s-compact2.jpg?amount=%s&addInfo=%s&accountName=%s",
                    MA_NGAN_HANG,
                    SO_DIEN_THOAI_MOMO,
                    soTienDemo.toPlainString(),
                    noiDungDemo,
                    TEN_NGUOI_NHAN.replace(" ", "%20")
            );
            return new MoMoPaymentDTO(
                    0L,
                    soTienDemo,
                    noiDungDemo,
                    qrUrl,
                    SO_DIEN_THOAI_MOMO,
                    TEN_NGUOI_NHAN,
                    "Mã QR MoMo Demo thử nghiệm quét mã và gửi thông báo qua Gmail."
            );
        }

        TienPhat tp = tienPhatRepository.findById(tienPhatId)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", tienPhatId));

        BigDecimal soTien = tp.getSoTien() != null ? tp.getSoTien() : BigDecimal.ZERO;
        String noiDung = "NOP_PHAT_" + tp.getId();

        // Tạo đường dẫn ảnh QR Code động chuẩn VietQR / MoMo quét trực tiếp
        String qrUrl = String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.jpg?amount=%s&addInfo=%s&accountName=%s",
                MA_NGAN_HANG,
                SO_DIEN_THOAI_MOMO,
                soTien.toPlainString(),
                noiDung,
                TEN_NGUOI_NHAN.replace(" ", "%20")
        );

        return new MoMoPaymentDTO(
                tp.getId(),
                soTien,
                noiDung,
                qrUrl,
                SO_DIEN_THOAI_MOMO,
                TEN_NGUOI_NHAN,
                "DA_THANH_TOAN".equals(tp.getTrangThai())
                        ? "Khoản tiền phạt này đã thanh toán trước đó. Bạn vẫn có thể quét mã để kiểm thử lại gửi thông báo Gmail."
                        : "Tạo mã thanh toán MoMo thành công. Quét mã QR bằng ứng dụng MoMo hoặc Ngân hàng để thanh toán."
        );
    }

    @Override
    @Transactional
    public Map<String, Object> xacNhanThanhToan(Long tienPhatId, String maGiaoDich, String emailNhan) {
        String maGdThucTe = (maGiaoDich != null && !maGiaoDich.trim().isEmpty())
                ? maGiaoDich.trim()
                : taoMaGiaoDichGia();
        String emailGui = (emailNhan != null && !emailNhan.trim().isEmpty()) ? emailNhan.trim() : null;

        // Xử lý chế độ Demo (tienPhatId <= 0)
        if (tienPhatId == null || tienPhatId <= 0) {
            BigDecimal soTienDemo = new BigDecimal("25000");
            Map<String, Object> emailRes = null;
            if (emailGui != null && !emailGui.isEmpty()) {
                emailRes = emailService.guiEmailThongBaoThanhToan(
                        emailGui,
                        "Độc giả Thử Nghiệm",
                        maGdThucTe,
                        soTienDemo,
                        "NOP_PHAT_DEMO",
                        "Phạt trả sách trễ hạn (Thử nghiệm)",
                        "Sách: Đắc Nhân Tâm (Bản Demo)"
                );
            }

            Map<String, Object> res = new HashMap<>();
            res.put("status", "SUCCESS");
            res.put("tienPhatId", 0L);
            res.put("soTien", soTienDemo);
            res.put("maGiaoDich", maGdThucTe);
            res.put("emailNhan", emailGui);

            boolean emailSent = emailRes != null && Boolean.TRUE.equals(emailRes.get("success"));
            res.put("emailSent", emailSent);
            if (emailRes != null) {
                res.put("emailStatus", emailRes.get("message"));
                if (emailRes.containsKey("hint")) {
                    res.put("emailHint", emailRes.get("hint"));
                }
            } else {
                res.put("emailStatus", "Chưa nhập địa chỉ email nhận thông báo.");
            }
            res.put("message", "Giả lập thanh toán MoMo Demo thành công! " + (emailSent ? "Đã gửi biên lai về Gmail." : ""));
            return res;
        }

        TienPhat tp = tienPhatRepository.findById(tienPhatId)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", tienPhatId));

        // Cập nhật trạng thái đã thanh toán (nếu chưa thanh toán)
        if (!"DA_THANH_TOAN".equals(tp.getTrangThai())) {
            tp.setTrangThai("DA_THANH_TOAN");
            tienPhatRepository.save(tp);

            // Lưu vào chi tiết thanh toán
            ChiTietTienPhat cttp = new ChiTietTienPhat();
            cttp.setTienPhatId(tp.getId());
            cttp.setSoTien(tp.getSoTien());
            cttp.setNgayThanhToan(LocalDateTime.now());
            cttp.setPhuongThuc("CHUYEN_KHOAN");
            cttp.setGhiChu("Thanh toán online MoMo. Mã GD: " + maGdThucTe);
            chiTietTienPhatRepository.save(cttp);
        }

        // Truy vết thông tin độc giả và sách để gửi biên lai qua Gmail
        String tenDocGia = "Độc giả Thư viện";
        String tenSach = "Tài liệu mượn thư viện";
        String lyDo = tp.getLyDo() != null ? tp.getLyDo() : "Phạt vi phạm mượn trả";

        if (tp.getChiTietPhieuMuonId() != null) {
            var optCtpm = chiTietPhieuMuonRepository.findById(tp.getChiTietPhieuMuonId());
            if (optCtpm.isPresent()) {
                var ctpm = optCtpm.get();
                if (ctpm.getPhieuMuonId() != null) {
                    var optPm = phieuMuonRepository.findById(ctpm.getPhieuMuonId());
                    if (optPm.isPresent()) {
                        var pm = optPm.get();
                        if (pm.getDocGiaId() != null) {
                            var optDg = docGiaRepository.findById(pm.getDocGiaId());
                            if (optDg.isPresent()) {
                                var dg = optDg.get();
                                if (dg.getHoTen() != null && !dg.getHoTen().trim().isEmpty()) {
                                    tenDocGia = dg.getHoTen();
                                }
                                if (emailGui == null && dg.getEmail() != null && !dg.getEmail().trim().isEmpty()) {
                                    emailGui = dg.getEmail().trim();
                                }
                            }
                        }
                    }
                }
                if (ctpm.getBanSaoSachId() != null) {
                    var optBss = banSaoSachRepository.findById(ctpm.getBanSaoSachId());
                    if (optBss.isPresent() && optBss.get().getSachId() != null) {
                        var optSach = sachRepository.findById(optBss.get().getSachId());
                        if (optSach.isPresent() && optSach.get().getTenSach() != null) {
                            tenSach = optSach.get().getTenSach();
                        }
                    }
                }
            }
        }

        // Thực hiện gửi email thông báo qua Gmail
        Map<String, Object> emailRes = null;
        if (emailGui != null && !emailGui.isEmpty()) {
            emailRes = emailService.guiEmailThongBaoThanhToan(
                    emailGui,
                    tenDocGia,
                    maGdThucTe,
                    tp.getSoTien() != null ? tp.getSoTien() : BigDecimal.ZERO,
                    "NOP_PHAT_" + tp.getId(),
                    lyDo,
                    tenSach
            );
        }

        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("tienPhatId", tp.getId());
        res.put("soTien", tp.getSoTien());
        res.put("maGiaoDich", maGdThucTe);
        res.put("emailNhan", emailGui);

        boolean emailSent = emailRes != null && Boolean.TRUE.equals(emailRes.get("success"));
        res.put("emailSent", emailSent);
        if (emailRes != null) {
            res.put("emailStatus", emailRes.get("message"));
            if (emailRes.containsKey("hint")) {
                res.put("emailHint", emailRes.get("hint"));
            }
        } else {
            res.put("emailStatus", "Độc giả chưa có email trong hồ sơ để gửi thông báo.");
        }

        res.put("message", "Xác nhận thanh toán MoMo thành công! " + (emailSent ? "Đã gửi email biên lai về Gmail." : ""));
        return res;
    }
}

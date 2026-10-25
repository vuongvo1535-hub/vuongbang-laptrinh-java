package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import com.example.demoChuong.entity.ChiTietTienPhat;
import com.example.demoChuong.entity.TienPhat;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.ChiTietTienPhatRepository;
import com.example.demoChuong.repository.TienPhatRepository;
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

    // Thong tin vi MoMo / Ngan hang thu vien mac dinh
    private static final String SO_DIEN_THOAI_MOMO = "0987654321";
    private static final String TEN_NGUOI_NHAN = "THU VIEN SO";
    private static final String MA_NGAN_HANG = "MB"; // Ngan hang MB Bank ho tro MoMo chuyen khoan

    public PaymentServiceImpl(TienPhatRepository tienPhatRepository,
                              ChiTietTienPhatRepository chiTietTienPhatRepository) {
        this.tienPhatRepository = tienPhatRepository;
        this.chiTietTienPhatRepository = chiTietTienPhatRepository;
    }

    @Override
    public MoMoPaymentDTO taoMaThanhToanMoMo(Long tienPhatId) {
        TienPhat tp = tienPhatRepository.findById(tienPhatId)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", tienPhatId));

        if ("DA_THANH_TOAN".equals(tp.getTrangThai())) {
            throw new RuntimeException("Khoản tiền phạt này đã được thanh toán trước đó");
        }

        BigDecimal soTien = tp.getSoTien() != null ? tp.getSoTien() : BigDecimal.ZERO;
        String noiDung = "NOP_PHAT_" + tp.getId();

        // Tao duong dan anh QR Code dong (tich hop chuan VietQR / MoMo quet truc tiep)
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
                "Tạo mã thanh toán MoMo thành công. Quét mã QR bằng ứng dụng MoMo hoặc Ngân hàng để thanh toán."
        );
    }

    @Override
    @Transactional
    public Map<String, Object> xacNhanThanhToan(Long tienPhatId, String maGiaoDich) {
        TienPhat tp = tienPhatRepository.findById(tienPhatId)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", tienPhatId));

        if ("DA_THANH_TOAN".equals(tp.getTrangThai())) {
            return Map.of(
                    "status", "ALREADY_PAID",
                    "message", "Khoản tiền phạt này đã thanh toán trước đó"
            );
        }

        // Cap nhat trang thai da thanh toan
        tp.setTrangThai("DA_THANH_TOAN");
        tienPhatRepository.save(tp);

        // Luu vao chi tiet thanh toan
        ChiTietTienPhat cttp = new ChiTietTienPhat();
        cttp.setTienPhatId(tp.getId());
        cttp.setSoTien(tp.getSoTien());
        cttp.setNgayThanhToan(LocalDateTime.now());
        cttp.setPhuongThuc("CHUYEN_KHOAN");
        cttp.setGhiChu("Thanh toán online MoMo. Mã GD: " + (maGiaoDich != null ? maGiaoDich : "MOMO-" + System.currentTimeMillis()));
        chiTietTienPhatRepository.save(cttp);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("tienPhatId", tp.getId());
        res.put("soTien", tp.getSoTien());
        res.put("message", "Xác nhận thanh toán MoMo thành công! Đã cập nhật trạng thái phiếu phạt.");
        return res;
    }
}

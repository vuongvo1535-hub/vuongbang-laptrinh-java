package com.example.demoChuong.controller;

import com.example.demoChuong.entity.ThongBao;
import com.example.demoChuong.repository.ThongBaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/thongBao")
public class ThongBaoController {

    private final ThongBaoRepository repository;

    public ThongBaoController(ThongBaoRepository repository) {
        this.repository = repository;
    }

    /** Lấy toàn bộ thông báo của độc giả (kèm thông báo chung toàn hệ thống) */
    @GetMapping("/docGia/{docGiaId}")
    public ResponseEntity<List<ThongBao>> layTheoDocGia(@PathVariable Long docGiaId) {
        List<ThongBao> list = repository.layThongBaoCuaDocGia(docGiaId);

        // Nếu độc giả chưa có thông báo nào, tự tạo 3 thông báo mẫu chào mừng & nhắc nhở thực tế
        if (list.isEmpty()) {
            ThongBao tb1 = new ThongBao(
                    null, docGiaId,
                    "Chào mừng bạn đến với Thư viện số!",
                    "Chúc bạn có những trải nghiệm đọc sách tuyệt vời. Thẻ thư viện mã QR của bạn đã sẵn sàng sử dụng tại quầy.",
                    "HE_THONG", "/thethuvien", false, LocalDateTime.now().minusHours(2)
            );
            ThongBao tb2 = new ThongBao(
                    null, docGiaId,
                    "Tiện ích Gia hạn mượn 1-click",
                    "Bạn có thể gia hạn thêm 7 ngày mượn trực tuyến tại mục Phiếu mượn mà không cần mang sách tới thư viện.",
                    "GIA_HAN", "/phieumuon", false, LocalDateTime.now().minusHours(5)
            );
            ThongBao tb3 = new ThongBao(
                    null, docGiaId,
                    "Trợ lý ảo AI Thư viện đã ra mắt",
                    "Bấm vào biểu tượng robot ở góc phải màn hình để được giải đáp mọi thắc mắc về quy định mượn trả 24/7.",
                    "HE_THONG", null, false, LocalDateTime.now().minusDays(1)
            );
            repository.saveAll(List.of(tb1, tb2, tb3));
            list = repository.layThongBaoCuaDocGia(docGiaId);
        }

        return ResponseEntity.ok(list);
    }

    /** Đếm số lượng thông báo chưa đọc */
    @GetMapping("/chuaDoc/{docGiaId}")
    public ResponseEntity<Map<String, Long>> demChuaDoc(@PathVariable Long docGiaId) {
        long count = repository.demChuaDoc(docGiaId);
        return ResponseEntity.ok(Map.of("soLuongChuaDoc", count));
    }

    /** Đánh dấu 1 thông báo là đã đọc */
    @PutMapping("/{id}/daDoc")
    public ResponseEntity<ThongBao> danhDauDaDoc(@PathVariable Long id) {
        return repository.findById(id).map(tb -> {
            tb.setDaDoc(true);
            return ResponseEntity.ok(repository.save(tb));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Đánh dấu tất cả thông báo của độc giả là đã đọc */
    @Transactional
    @PutMapping("/docGia/{docGiaId}/docTatCa")
    public ResponseEntity<Map<String, String>> docTatCa(@PathVariable Long docGiaId) {
        repository.danhDauTatCaDaDoc(docGiaId);
        return ResponseEntity.ok(Map.of("message", "Đã đánh dấu tất cả thông báo là đã đọc"));
    }

    /** Tạo thông báo mới (hệ thống hoặc thủ thư gửi) */
    @PostMapping
    public ResponseEntity<ThongBao> taoMoi(@RequestBody ThongBao req) {
        if (req.getTieuDe() == null || req.getTieuDe().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (req.getNgayTao() == null) req.setNgayTao(LocalDateTime.now());
        if (req.getDaDoc() == null) req.setDaDoc(false);
        if (req.getLoaiThongBao() == null) req.setLoaiThongBao("HE_THONG");

        return ResponseEntity.ok(repository.save(req));
    }
}

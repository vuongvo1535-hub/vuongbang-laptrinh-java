package com.example.demoChuong.controller;

import com.example.demoChuong.entity.DatTruoc;
import com.example.demoChuong.entity.DocGia;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.repository.DatTruocRepository;
import com.example.demoChuong.repository.DocGiaRepository;
import com.example.demoChuong.repository.SachRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/datTruoc")
public class DatTruocController {

    private final DatTruocRepository repository;
    private final SachRepository sachRepository;
    private final DocGiaRepository docGiaRepository;

    public DatTruocController(DatTruocRepository repository,
                              SachRepository sachRepository,
                              DocGiaRepository docGiaRepository) {
        this.repository = repository;
        this.sachRepository = sachRepository;
        this.docGiaRepository = docGiaRepository;
    }

    /** Lấy danh sách tất cả yêu cầu đặt trước (Admin) */
    @GetMapping
    public ResponseEntity<List<DatTruoc>> layTatCa() {
        return ResponseEntity.ok(repository.findAllByOrderByNgayDatDesc());
    }

    /** Lấy danh sách đặt trước của một độc giả */
    @GetMapping("/docGia/{docGiaId}")
    public ResponseEntity<List<DatTruoc>> layTheoDocGia(@PathVariable Long docGiaId) {
        return ResponseEntity.ok(repository.findByDocGiaIdOrderByNgayDatDesc(docGiaId));
    }

    /** Tạo yêu cầu đặt trước sách */
    @PostMapping
    public ResponseEntity<?> taoDatTruoc(@RequestBody DatTruoc req) {
        if (req.getSachId() == null || req.getDocGiaId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu mã sách hoặc mã độc giả"));
        }

        // Kiểm tra xem độc giả đã đặt cuốn này và đang chờ sách chưa
        boolean daDat = repository.existsByDocGiaIdAndSachIdAndTrangThai(req.getDocGiaId(), req.getSachId(), "CHO_CO_SACH");
        if (daDat) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn đã đặt trước cuốn sách này rồi và đang trong hàng đợi!"));
        }

        // Bổ sung thông tin sách & độc giả nếu chưa có
        if (req.getTenSach() == null || req.getTenSach().isBlank()) {
            sachRepository.findById(req.getSachId()).ifPresent(s -> {
                req.setTenSach(s.getTenSach());
                req.setAnhBia(s.getAnhBia());
            });
        }

        if (req.getTenDocGia() == null || req.getTenDocGia().isBlank()) {
            docGiaRepository.findById(req.getDocGiaId()).ifPresent(d -> {
                req.setTenDocGia(d.getHoTen());
            });
        }

        req.setNgayDat(LocalDateTime.now());
        req.setTrangThai("CHO_CO_SACH");
        if (req.getGhiChu() == null) {
            req.setGhiChu("Độc giả đặt trước khi sách tạm hết bản sao");
        }

        DatTruoc daLuu = repository.save(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(daLuu);
    }

    /** Cập nhật trạng thái đặt trước (Admin xác nhận hoặc đổi trạng thái) */
    @PutMapping("/{id}/trangThai")
    public ResponseEntity<?> capNhatTrangThai(@PathVariable Long id, @RequestParam String trangThai) {
        return repository.findById(id).map(dt -> {
            dt.setTrangThai(trangThai);
            return ResponseEntity.ok(repository.save(dt));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Hủy yêu cầu đặt trước */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> huyDatTruoc(@PathVariable Long id) {
        return repository.findById(id).map(dt -> {
            dt.setTrangThai("DA_HUY");
            repository.save(dt);
            return ResponseEntity.ok(Map.of("message", "Đã hủy yêu cầu đặt trước thành công"));
        }).orElse(ResponseEntity.notFound().build());
    }
}

package com.example.demoChuong.controller;

import com.example.demoChuong.dto.SachChiTietDTO;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.entity.TuSach;
import com.example.demoChuong.repository.SachRepository;
import com.example.demoChuong.repository.TuSachRepository;
import com.example.demoChuong.service.SachChiTietService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tuSach")
public class TuSachController {

    private final TuSachRepository repository;
    private final SachRepository sachRepository;
    private final SachChiTietService chiTietService;

    public TuSachController(TuSachRepository repository,
                            SachRepository sachRepository,
                            SachChiTietService chiTietService) {
        this.repository = repository;
        this.sachRepository = sachRepository;
        this.chiTietService = chiTietService;
    }

    /** Lấy danh sách sách trong tủ của độc giả */
    @GetMapping("/docGia/{docGiaId}")
    public ResponseEntity<List<TuSach>> layTheoDocGia(
            @PathVariable Long docGiaId,
            @RequestParam(required = false) String trangThaiDoc) {
        if (trangThaiDoc != null && !trangThaiDoc.isBlank()) {
            return ResponseEntity.ok(repository.findByDocGiaIdAndTrangThaiDocOrderByNgayThemDesc(docGiaId, trangThaiDoc));
        }
        return ResponseEntity.ok(repository.findByDocGiaIdOrderByNgayThemDesc(docGiaId));
    }

    /** Kiểm tra xem sách đã có trong tủ sách chưa */
    @GetMapping("/kiemTra")
    public ResponseEntity<Map<String, Object>> kiemTra(
            @RequestParam Long docGiaId,
            @RequestParam Long sachId) {
        Optional<TuSach> opt = repository.findByDocGiaIdAndSachId(docGiaId, sachId);
        if (opt.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "daCo", true,
                    "tuSach", opt.get()
            ));
        }
        return ResponseEntity.ok(Map.of("daCo", false));
    }

    /** Thêm hoặc cập nhật sách vào tủ sách cá nhân */
    @PostMapping
    public ResponseEntity<TuSach> themHoacCapNhat(@RequestBody TuSach req) {
        if (req.getDocGiaId() == null || req.getSachId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<TuSach> opt = repository.findByDocGiaIdAndSachId(req.getDocGiaId(), req.getSachId());
        TuSach item;

        if (opt.isPresent()) {
            item = opt.get();
            if (req.getTrangThaiDoc() != null) {
                item.setTrangThaiDoc(req.getTrangThaiDoc());
            }
            if (req.getGhiChu() != null) {
                item.setGhiChu(req.getGhiChu());
            }
        } else {
            item = new TuSach();
            item.setDocGiaId(req.getDocGiaId());
            item.setSachId(req.getSachId());
            item.setTrangThaiDoc(req.getTrangThaiDoc() != null ? req.getTrangThaiDoc() : "YEU_THICH");
            item.setGhiChu(req.getGhiChu());
            item.setNgayThem(LocalDateTime.now());

            // Tự động bổ sung tên sách, ảnh bìa, tác giả nếu chưa có
            Optional<Sach> sachOpt = sachRepository.findById(req.getSachId());
            if (sachOpt.isPresent()) {
                Sach s = sachOpt.get();
                item.setTenSach(s.getTenSach());
                item.setAnhBia(s.getAnhBia());
                try {
                    SachChiTietDTO ct = chiTietService.layChiTiet(s.getId());
                    if (ct != null && ct.tacGia() != null && !ct.tacGia().isEmpty()) {
                        item.setTacGia(ct.tacGia().get(0).tenTacGia());
                    }
                } catch (Exception ignored) {}
            }
            if (req.getTenSach() != null) item.setTenSach(req.getTenSach());
            if (req.getAnhBia() != null) item.setAnhBia(req.getAnhBia());
            if (req.getTacGia() != null) item.setTacGia(req.getTacGia());
        }

        return ResponseEntity.ok(repository.save(item));
    }

    /** Xóa khỏi tủ sách theo ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoaTheoId(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi tủ sách"));
    }

    /** Xóa nhanh theo docGiaId và sachId (thao tác bỏ tim yêu thích) */
    @Transactional
    @DeleteMapping("/docGia/{docGiaId}/sach/{sachId}")
    public ResponseEntity<Map<String, String>> xoaNhanh(
            @PathVariable Long docGiaId,
            @PathVariable Long sachId) {
        repository.deleteByDocGiaIdAndSachId(docGiaId, sachId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi tủ sách cá nhân"));
    }

    /** Thống kê số lượng sách theo các trạng thái đọc */
    @GetMapping("/thongKe/{docGiaId}")
    public ResponseEntity<Map<String, Object>> thongKeDocGia(@PathVariable Long docGiaId) {
        List<TuSach> all = repository.findByDocGiaIdOrderByNgayThemDesc(docGiaId);
        long tong = all.size();
        long yeuThich = all.stream().filter(x -> "YEU_THICH".equals(x.getTrangThaiDoc())).count();
        long muonDoc = all.stream().filter(x -> "MUON_DOC".equals(x.getTrangThaiDoc())).count();
        long dangDoc = all.stream().filter(x -> "DANG_DOC".equals(x.getTrangThaiDoc())).count();
        long daDoc = all.stream().filter(x -> "DA_DOC".equals(x.getTrangThaiDoc())).count();

        Map<String, Object> res = new HashMap<>();
        res.put("tong", tong);
        res.put("yeuThich", yeuThich);
        res.put("muonDoc", muonDoc);
        res.put("dangDoc", dangDoc);
        res.put("daDoc", daDoc);
        return ResponseEntity.ok(res);
    }
}

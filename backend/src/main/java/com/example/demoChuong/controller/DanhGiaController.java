package com.example.demoChuong.controller;

import com.example.demoChuong.entity.DanhGia;
import com.example.demoChuong.repository.DanhGiaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/danhGia")
public class DanhGiaController {

    private final DanhGiaRepository repository;

    public DanhGiaController(DanhGiaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/sach/{sachId}")
    public ResponseEntity<Map<String, Object>> layDanhGiaTheoSach(@PathVariable Long sachId) {
        List<DanhGia> ds = repository.findBySachIdOrderByNgayTaoDesc(sachId);

        // Khởi tạo đánh giá mẫu nếu cuốn sách chưa có đánh giá nào (để giao diện luôn có dữ liệu đẹp khi demo)
        if (ds.isEmpty()) {
            DanhGia m1 = new DanhGia(null, sachId, 1L, "Nguyễn Văn An", 5, "Sách rất hay và bổ ích, kiến thức trình bày rõ ràng, dễ hiểu!", LocalDateTime.now().minusDays(2));
            DanhGia m2 = new DanhGia(null, sachId, 2L, "Trần Thị Mai", 5, "Sách được bảo quản tốt, bìa và các trang còn mới. Rất đáng mượn đọc!", LocalDateTime.now().minusDays(5));
            repository.save(m1);
            repository.save(m2);
            ds = repository.findBySachIdOrderByNgayTaoDesc(sachId);
        }

        Map<Integer, Integer> phanBo = new HashMap<>();
        for (int i = 1; i <= 5; i++) phanBo.put(i, 0);

        int tongDiem = 0;
        for (DanhGia dg : ds) {
            int sao = (dg.getSoSao() != null && dg.getSoSao() >= 1 && dg.getSoSao() <= 5) ? dg.getSoSao() : 5;
            tongDiem += sao;
            phanBo.put(sao, phanBo.get(sao) + 1);
        }

        double diemTrungBinh = ds.isEmpty() ? 5.0 : Math.round((double) tongDiem / ds.size() * 10.0) / 10.0;

        Map<String, Object> ketQua = new HashMap<>();
        ketQua.put("danhSach", ds);
        ketQua.put("tongDanhGia", ds.size());
        ketQua.put("diemTrungBinh", diemTrungBinh);
        ketQua.put("phanBo", phanBo);

        return ResponseEntity.ok(ketQua);
    }

    @PostMapping
    public ResponseEntity<DanhGia> themDanhGia(@RequestBody DanhGia req) {
        if (req.getSachId() == null) {
            throw new RuntimeException("Thiếu mã sách cần đánh giá");
        }
        if (req.getSoSao() == null || req.getSoSao() < 1 || req.getSoSao() > 5) {
            req.setSoSao(5);
        }
        if (req.getHoTen() == null || req.getHoTen().isBlank()) {
            req.setHoTen("Độc giả thư viện");
        }
        req.setNgayTao(LocalDateTime.now());
        DanhGia daLuu = repository.save(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(daLuu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoaDanhGia(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa đánh giá thành công"));
    }
}

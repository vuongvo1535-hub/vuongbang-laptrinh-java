package com.example.demoChuong.controller;

import com.example.demoChuong.dto.ChiTietPhieuMuonDTO;
import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.dto.TaoPhieuMuonRequest;
import com.example.demoChuong.dto.TraSachRequest;
import com.example.demoChuong.service.PhieuMuonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/phieuMuon", "/api/phieumuon", "/api/donhang"})
public class PhieuMuonController {

    private final PhieuMuonService service;

    public PhieuMuonController(PhieuMuonService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PhieuMuonDTO>> xemTatCa(@RequestParam(required = false) Long docGiaId) {
        if (docGiaId == null) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.layTheoDocGia(docGiaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhieuMuonDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @GetMapping("/{id}/chiTiet")
    public ResponseEntity<List<ChiTietPhieuMuonDTO>> xemChiTiet(@PathVariable Long id) {
        return ResponseEntity.ok(service.layChiTiet(id));
    }

    /** Mượn sách thực tế: chọn nhiều cuốn sách, tự động đổi trạng thái bản sao sang DANG_MUON. */
    @PostMapping("/muon")
    public ResponseEntity<PhieuMuonDTO> muonSach(@RequestBody TaoPhieuMuonRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.muonSach(req));
    }

    /** Trả sách: chuyển bản sao về SAN_SANG, nếu trễ hạn hoặc hỏng/mất tự động tính tiền phạt. */
    @PostMapping("/tra")
    public ResponseEntity<ChiTietPhieuMuonDTO> traSach(@RequestBody TraSachRequest req) {
        return ResponseEntity.ok(service.traSach(req));
    }

    @PostMapping
    public ResponseEntity<PhieuMuonDTO> them(@RequestBody PhieuMuonDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhieuMuonDTO> sua(@PathVariable Long id, @RequestBody PhieuMuonDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa phiếu mượn thành công"));
    }
}

package com.example.demoChuong.controller;

import com.example.demoChuong.dto.BanSaoSachDTO;
import com.example.demoChuong.service.BanSaoSachService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/banSaoSach")
public class BanSaoSachController {

    private final BanSaoSachService service;

    public BanSaoSachController(BanSaoSachService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<BanSaoSachDTO>> xemTatCa(@RequestParam(required = false) Long sachId) {
        if (sachId != null) {
            return ResponseEntity.ok(service.layTheoSachId(sachId));
        }
        return ResponseEntity.ok(service.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BanSaoSachDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @GetMapping("/maVach/{maVach}")
    public ResponseEntity<BanSaoSachDTO> xemTheoMaVach(@PathVariable String maVach) {
        return ResponseEntity.ok(service.layTheoMaVach(maVach));
    }

    @PostMapping
    public ResponseEntity<BanSaoSachDTO> them(@RequestBody BanSaoSachDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BanSaoSachDTO> sua(@PathVariable Long id, @RequestBody BanSaoSachDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa bản sao sách thành công"));
    }
}

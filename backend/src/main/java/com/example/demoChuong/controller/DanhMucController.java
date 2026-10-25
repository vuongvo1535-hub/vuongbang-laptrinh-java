package com.example.demoChuong.controller;

import com.example.demoChuong.dto.DanhMucDTO;
import com.example.demoChuong.service.DanhMucService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/danhMuc", "/api/danhmuc"})
public class DanhMucController {

    private final DanhMucService service;

    public DanhMucController(DanhMucService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DanhMucDTO>> xemTatCa() {
        return ResponseEntity.ok(service.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DanhMucDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<DanhMucDTO> them(@RequestBody DanhMucDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DanhMucDTO> sua(@PathVariable Long id, @RequestBody DanhMucDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa danh mục thành công"));
    }
}

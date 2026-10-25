package com.example.demoChuong.controller;

import com.example.demoChuong.dto.TacGiaDTO;
import com.example.demoChuong.service.TacGiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/tacGia", "/api/tacgia"})
public class TacGiaController {

    private final TacGiaService service;

    public TacGiaController(TacGiaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TacGiaDTO>> xemTatCa(@RequestParam(required = false) String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.timKiem(tuKhoa));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TacGiaDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<TacGiaDTO> them(@RequestBody TacGiaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TacGiaDTO> sua(@PathVariable Long id, @RequestBody TacGiaDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa tác giả thành công"));
    }
}

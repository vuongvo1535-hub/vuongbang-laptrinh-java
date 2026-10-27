package com.example.demoChuong.controller;

import com.example.demoChuong.dto.NhaXuatBanDTO;
import com.example.demoChuong.service.NhaXuatBanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/nhaXuatBan", "/api/nhaxuatban", "/api/thuonghieu", "/api/thuongHieu"})
public class NhaXuatBanController {

    private final NhaXuatBanService service;

    public NhaXuatBanController(NhaXuatBanService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NhaXuatBanDTO>> xemTatCa() {
        return ResponseEntity.ok(service.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhaXuatBanDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<NhaXuatBanDTO> them(@RequestBody NhaXuatBanDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhaXuatBanDTO> sua(@PathVariable Long id, @RequestBody NhaXuatBanDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa nhà xuất bản thành công"));
    }
}

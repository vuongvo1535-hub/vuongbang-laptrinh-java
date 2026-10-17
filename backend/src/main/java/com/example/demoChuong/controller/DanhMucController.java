package com.example.demoChuong.controller;

import com.example.demoChuong.dto.DanhMucDTO;
import com.example.demoChuong.service.DanhMucService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/danhMuc")
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
}

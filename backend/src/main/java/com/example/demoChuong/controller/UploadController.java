package com.example.demoChuong.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Thu muc luu anh tai len (trong thu muc uploads cua du an)
    private static final String UPLOAD_DIR = "uploads";

    @PostMapping
    public ResponseEntity<Map<String, String>> taiLenAnh(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file để tải lên"));
        }

        try {
            // Tao thu muc neu chua ton tai
            File thuMuc = new File(UPLOAD_DIR);
            if (!thuMuc.exists()) {
                thuMuc.mkdirs();
            }

            // Tao ten file duy nhat de khong bi trung
            String tenGoc = file.getOriginalFilename();
            String phanMoRong = "";
            if (tenGoc != null && tenGoc.contains(".")) {
                phanMoRong = tenGoc.substring(tenGoc.lastIndexOf("."));
            }
            String tenFileMoi = UUID.randomUUID() + phanMoRong;

            // Luu file vao dia
            Path duongDanLuu = Paths.get(UPLOAD_DIR, tenFileMoi);
            Files.write(duongDanLuu, file.getBytes());

            // Tra ve duong dan URL
            String fileUrl = "/uploads/" + tenFileMoi;
            return ResponseEntity.ok(Map.of(
                    "message", "Tải ảnh lên thành công",
                    "url", fileUrl,
                    "fileName", tenFileMoi
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi khi lưu file: " + e.getMessage()));
        }
    }
}

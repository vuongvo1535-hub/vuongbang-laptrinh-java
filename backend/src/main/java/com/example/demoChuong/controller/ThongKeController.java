package com.example.demoChuong.controller;

import com.example.demoChuong.entity.TienPhat;
import com.example.demoChuong.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/thongKe")
public class ThongKeController {

    private final SachRepository sachRepository;
    private final BanSaoSachRepository banSaoSachRepository;
    private final DocGiaRepository docGiaRepository;
    private final PhieuMuonRepository phieuMuonRepository;
    private final TienPhatRepository tienPhatRepository;
    private final DanhMucRepository danhMucRepository;

    public ThongKeController(SachRepository sachRepository,
                             BanSaoSachRepository banSaoSachRepository,
                             DocGiaRepository docGiaRepository,
                             PhieuMuonRepository phieuMuonRepository,
                             TienPhatRepository tienPhatRepository,
                             DanhMucRepository danhMucRepository) {
        this.sachRepository = sachRepository;
        this.banSaoSachRepository = banSaoSachRepository;
        this.docGiaRepository = docGiaRepository;
        this.phieuMuonRepository = phieuMuonRepository;
        this.tienPhatRepository = tienPhatRepository;
        this.danhMucRepository = danhMucRepository;
    }

    @GetMapping("/tongQuan")
    public ResponseEntity<Map<String, Object>> thongKeTongQuan() {
        Map<String, Object> data = new HashMap<>();

        // 1. Thong ke sach va danh muc
        long tongSach = sachRepository.count();
        long tongDanhMuc = danhMucRepository.count();
        long tongBanSao = banSaoSachRepository.count();
        long banSaoSanSang = banSaoSachRepository.countByTrangThai("SAN_SANG");
        long banSaoDangMuon = banSaoSachRepository.countByTrangThai("DANG_MUON");

        // 2. Thong ke doc gia
        long tongDocGia = docGiaRepository.count();

        // 3. Thong ke phieu muon
        long tongPhieuMuon = phieuMuonRepository.count();
        long phieuDangMuon = phieuMuonRepository.countByTrangThai("DANG_MUON");
        long phieuDaTra = phieuMuonRepository.countByTrangThai("DA_TRA");

        // 4. Thong ke tien phat
        List<TienPhat> dsChuaThu = tienPhatRepository.findByTrangThai("CHUA_THANH_TOAN");
        BigDecimal tongTienPhatChuaThu = BigDecimal.ZERO;
        for (TienPhat tp : dsChuaThu) {
            if (tp.getSoTien() != null) {
                tongTienPhatChuaThu = tongTienPhatChuaThu.add(tp.getSoTien());
            }
        }

        data.put("tongSach", tongSach);
        data.put("tongDanhMuc", tongDanhMuc);
        data.put("tongBanSao", tongBanSao);
        data.put("banSaoSanSang", banSaoSanSang);
        data.put("banSaoDangMuon", banSaoDangMuon);
        data.put("tongDocGia", tongDocGia);
        data.put("tongPhieuMuon", tongPhieuMuon);
        data.put("phieuDangMuon", phieuDangMuon);
        data.put("phieuDaTra", phieuDaTra);
        data.put("soKhoanPhatChuaThu", dsChuaThu.size());
        data.put("tongTienPhatChuaThu", tongTienPhatChuaThu);

        return ResponseEntity.ok(data);
    }
}

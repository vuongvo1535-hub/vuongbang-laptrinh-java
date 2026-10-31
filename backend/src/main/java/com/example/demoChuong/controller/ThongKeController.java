package com.example.demoChuong.controller;

import com.example.demoChuong.entity.*;
import com.example.demoChuong.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/thongKe")
public class ThongKeController {

    private final SachRepository sachRepository;
    private final BanSaoSachRepository banSaoSachRepository;
    private final DocGiaRepository docGiaRepository;
    private final PhieuMuonRepository phieuMuonRepository;
    private final ChiTietPhieuMuonRepository chiTietPhieuMuonRepository;
    private final TienPhatRepository tienPhatRepository;
    private final DanhMucRepository danhMucRepository;

    public ThongKeController(SachRepository sachRepository,
                             BanSaoSachRepository banSaoSachRepository,
                             DocGiaRepository docGiaRepository,
                             PhieuMuonRepository phieuMuonRepository,
                             ChiTietPhieuMuonRepository chiTietPhieuMuonRepository,
                             TienPhatRepository tienPhatRepository,
                             DanhMucRepository danhMucRepository) {
        this.sachRepository = sachRepository;
        this.banSaoSachRepository = banSaoSachRepository;
        this.docGiaRepository = docGiaRepository;
        this.phieuMuonRepository = phieuMuonRepository;
        this.chiTietPhieuMuonRepository = chiTietPhieuMuonRepository;
        this.tienPhatRepository = tienPhatRepository;
        this.danhMucRepository = danhMucRepository;
    }

    @GetMapping("/tongQuan")
    public ResponseEntity<Map<String, Object>> thongKeTongQuan() {
        Map<String, Object> data = new HashMap<>();

        long tongSach = sachRepository.count();
        long tongDanhMuc = danhMucRepository.count();
        long tongBanSao = banSaoSachRepository.count();
        long banSaoSanSang = banSaoSachRepository.countByTrangThai("SAN_SANG");
        long banSaoDangMuon = banSaoSachRepository.countByTrangThai("DANG_MUON");

        long tongDocGia = docGiaRepository.count();
        long tongPhieuMuon = phieuMuonRepository.count();
        long phieuDangMuon = phieuMuonRepository.countByTrangThai("DANG_MUON");
        long phieuDaTra = phieuMuonRepository.countByTrangThai("DA_TRA");

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

    /** Top sách được mượn nhiều nhất (cho biểu đồ và bảng xếp hạng) */
    @GetMapping("/topSach")
    public ResponseEntity<List<Map<String, Object>>> layTopSachMuon() {
        List<ChiTietPhieuMuon> dsChiTiet = chiTietPhieuMuonRepository.findAll();
        Map<Long, Long> banSaoToSachMap = new HashMap<>();
        for (BanSaoSach bss : banSaoSachRepository.findAll()) {
            if (bss.getSachId() != null) {
                banSaoToSachMap.put(bss.getId(), bss.getSachId());
            }
        }

        Map<Long, Integer> demSach = new HashMap<>();
        for (ChiTietPhieuMuon ct : dsChiTiet) {
            Long sachId = banSaoToSachMap.get(ct.getBanSaoSachId());
            if (sachId != null) {
                demSach.put(sachId, demSach.getOrDefault(sachId, 0) + 1);
            }
        }

        List<Sach> tatCaSach = sachRepository.findAll();
        List<Map<String, Object>> danhSachTop = new ArrayList<>();

        for (Sach s : tatCaSach) {
            int luotMuon = demSach.getOrDefault(s.getId(), 0);
            Map<String, Object> item = new HashMap<>();
            item.put("id", s.getId());
            item.put("maSach", s.getMaSach());
            item.put("tenSach", s.getTenSach());
            item.put("anhBia", s.getAnhBia());
            item.put("soLuotMuon", luotMuon);
            danhSachTop.add(item);
        }

        // Sắp xếp giảm dần theo số lượt mượn
        danhSachTop.sort((a, b) -> Integer.compare((int) b.get("soLuotMuon"), (int) a.get("soLuotMuon")));

        // Lấy tối đa top 10
        if (danhSachTop.size() > 10) {
            danhSachTop = danhSachTop.subList(0, 10);
        }

        return ResponseEntity.ok(danhSachTop);
    }

    /** Thống kê số lượng sách theo từng thể loại danh mục */
    @GetMapping("/theoDanhMuc")
    public ResponseEntity<List<Map<String, Object>>> layThongKeTheoDanhMuc() {
        List<DanhMuc> dsDanhMuc = danhMucRepository.findAll();
        List<Sach> dsSach = sachRepository.findAll();

        Map<Long, Integer> demTheoDm = new HashMap<>();
        for (Sach s : dsSach) {
            if (s.getDanhMucId() != null) {
                demTheoDm.put(s.getDanhMucId(), demTheoDm.getOrDefault(s.getDanhMucId(), 0) + 1);
            }
        }

        List<Map<String, Object>> ketQua = new ArrayList<>();
        for (DanhMuc dm : dsDanhMuc) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", dm.getId());
            m.put("tenDanhMuc", dm.getTenDanhMuc());
            m.put("soLuong", demTheoDm.getOrDefault(dm.getId(), 0));
            ketQua.add(m);
        }
        return ResponseEntity.ok(ketQua);
    }

    /** Thống kê xu hướng mượn sách theo các tháng gần đây */
    @GetMapping("/xuHuongMuon")
    public ResponseEntity<List<Map<String, Object>>> layXuHuongMuon() {
        List<PhieuMuon> dsPhieu = phieuMuonRepository.findAll();
        Map<String, Integer> theoThang = new LinkedHashMap<>();

        // Khởi tạo 6 tháng gần nhất
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/yyyy");
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            String thang = now.minusMonths(i).format(dtf);
            theoThang.put(thang, 0);
        }

        for (PhieuMuon pm : dsPhieu) {
            if (pm.getNgayMuon() != null) {
                String thang = pm.getNgayMuon().format(dtf);
                if (theoThang.containsKey(thang)) {
                    theoThang.put(thang, theoThang.get(thang) + 1);
                }
            }
        }

        List<Map<String, Object>> ketQua = new ArrayList<>();
        theoThang.forEach((thang, soLuong) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("thang", "Tháng " + thang);
            m.put("soLuong", soLuong);
            ketQua.add(m);
        });

        return ResponseEntity.ok(ketQua);
    }
}

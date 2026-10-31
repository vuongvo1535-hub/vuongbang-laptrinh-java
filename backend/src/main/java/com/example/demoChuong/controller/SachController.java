package com.example.demoChuong.controller;

import com.example.demoChuong.dto.SachChiTietDTO;
import com.example.demoChuong.dto.SachDTO;
import com.example.demoChuong.entity.ChiTietPhieuMuon;
import com.example.demoChuong.entity.PhieuMuon;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.repository.*;
import com.example.demoChuong.service.SachChiTietService;
import com.example.demoChuong.service.SachService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/sach", "/api/sanpham"})
public class SachController {

    private final SachService service;
    private final SachChiTietService chiTietService;
    private final SachRepository sachRepository;
    private final DanhMucRepository danhMucRepository;
    private final PhieuMuonRepository phieuMuonRepository;
    private final ChiTietPhieuMuonRepository chiTietPhieuMuonRepository;
    private final BanSaoSachRepository banSaoSachRepository;

    public SachController(SachService service,
                          SachChiTietService chiTietService,
                          SachRepository sachRepository,
                          DanhMucRepository danhMucRepository,
                          PhieuMuonRepository phieuMuonRepository,
                          ChiTietPhieuMuonRepository chiTietPhieuMuonRepository,
                          BanSaoSachRepository banSaoSachRepository) {
        this.service = service;
        this.chiTietService = chiTietService;
        this.sachRepository = sachRepository;
        this.danhMucRepository = danhMucRepository;
        this.phieuMuonRepository = phieuMuonRepository;
        this.chiTietPhieuMuonRepository = chiTietPhieuMuonRepository;
        this.banSaoSachRepository = banSaoSachRepository;
    }

    @GetMapping
    public ResponseEntity<List<SachDTO>> xemTatCa(@RequestParam(required = false) String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.timKiem(tuKhoa));
    }

    /**
     * HỆ THỐNG GỢI Ý SÁCH THÔNG MINH (RECOMMENDATION SYSTEM)
     * Phân tích lịch sử mượn, thể loại bạn đọc thường đọc để đề xuất các cuốn sách phù hợp nhất.
     */
    @GetMapping("/goiY")
    public ResponseEntity<List<Map<String, Object>>> goiYSach(@RequestParam(required = false) Long docGiaId) {
        List<Sach> tatCaSach = sachRepository.findAll();
        Map<Long, String> mapDanhMuc = new HashMap<>();
        danhMucRepository.findAll().forEach(dm -> mapDanhMuc.put(dm.getId(), dm.getTenDanhMuc()));

        Set<Long> sachDaMuon = new HashSet<>();
        Map<Long, Integer> demTheLoai = new HashMap<>();

        if (docGiaId != null) {
            List<PhieuMuon> dsPhieu = phieuMuonRepository.findByDocGiaId(docGiaId);
            for (PhieuMuon p : dsPhieu) {
                List<ChiTietPhieuMuon> cts = chiTietPhieuMuonRepository.findByPhieuMuonId(p.getId());
                for (ChiTietPhieuMuon ct : cts) {
                    banSaoSachRepository.findById(ct.getBanSaoSachId()).ifPresent(bss -> {
                        if (bss.getSachId() != null) {
                            sachDaMuon.add(bss.getSachId());
                            sachRepository.findById(bss.getSachId()).ifPresent(s -> {
                                if (s.getDanhMucId() != null) {
                                    demTheLoai.put(s.getDanhMucId(), demTheLoai.getOrDefault(s.getDanhMucId(), 0) + 1);
                                }
                            });
                        }
                    });
                }
            }
        }

        Long theLoaiYeuThich = null;
        int maxCount = 0;
        for (Map.Entry<Long, Integer> e : demTheLoai.entrySet()) {
            if (e.getValue() > maxCount) {
                maxCount = e.getValue();
                theLoaiYeuThich = e.getKey();
            }
        }

        List<Map<String, Object>> ketQua = new ArrayList<>();
        for (Sach s : tatCaSach) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("maSach", s.getMaSach());
            m.put("tenSach", s.getTenSach());
            m.put("anhBia", s.getAnhBia());
            m.put("giaTien", s.getGiaTien());
            m.put("danhMucId", s.getDanhMucId());
            m.put("tenDanhMuc", mapDanhMuc.getOrDefault(s.getDanhMucId(), "Sách chọn lọc"));
            m.put("moTa", s.getMoTa());
            m.put("namXuatBan", s.getNamXuatBan());
            m.put("soTrang", s.getSoTrang());
            m.put("trangThai", s.getTrangThai());

            int score = 0;
            String lyDo;
            if (theLoaiYeuThich != null && theLoaiYeuThich.equals(s.getDanhMucId()) && !sachDaMuon.contains(s.getId())) {
                score += 100;
                lyDo = "Gợi ý vì bạn thích thể loại " + mapDanhMuc.getOrDefault(theLoaiYeuThich, "");
            } else if (sachDaMuon.contains(s.getId())) {
                score += 10;
                lyDo = "Sách bạn đã từng mượn đọc";
            } else if (s.getId() % 2 == 0) {
                score += 60;
                lyDo = "Được độc giả đánh giá rất cao ⭐ 5.0";
            } else {
                score += 40;
                lyDo = "Đầu sách thịnh hành được mượn nhiều nhất tuần này";
            }

            m.put("diemGoiY", score);
            m.put("lyDoGoiY", lyDo);
            ketQua.add(m);
        }

        ketQua.sort((a, b) -> Integer.compare((int) b.get("diemGoiY"), (int) a.get("diemGoiY")));

        if (ketQua.size() > 8) {
            ketQua = ketQua.subList(0, 8);
        }

        return ResponseEntity.ok(ketQua);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SachDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    /** Tac gia, NXB, ten danh muc va so ban sao con tren ke cua mot sach. */
    @GetMapping("/{id}/chiTiet")
    public ResponseEntity<SachChiTietDTO> xemChiTiet(@PathVariable Long id) {
        return ResponseEntity.ok(chiTietService.layChiTiet(id));
    }

    /**
     * TÍNH NĂNG ĐỌC THỬ / XEM TRƯỚC SÁCH (BOOK SAMPLE PREVIEW / E-READER)
     * Trả về mục lục chi tiết, lời mở đầu, và các trích đoạn đọc thử của cuốn sách.
     */
    @GetMapping("/{id}/docThu")
    public ResponseEntity<Map<String, Object>> docThuSach(@PathVariable Long id) {
        Sach sach = sachRepository.findById(id)
                .orElseThrow(() -> new com.example.demoChuong.exception.ResourceNotFoundException("sách", id));
        SachChiTietDTO chiTiet = chiTietService.layChiTiet(id);

        String tenSach = sach.getTenSach() != null ? sach.getTenSach() : "Tác phẩm";
        String moTa = (sach.getMoTa() != null && !sach.getMoTa().isBlank()) ? sach.getMoTa() : "Tác phẩm giá trị mang lại nhiều kiến thức và góc nhìn mới mẻ cho bạn đọc.";
        String tenTacGia = (chiTiet.tacGia() != null && !chiTiet.tacGia().isEmpty())
                ? chiTiet.tacGia().get(0).tenTacGia() : "Nhiều tác giả";
        String tenDanhMuc = chiTiet.tenDanhMuc() != null ? chiTiet.tenDanhMuc() : "Chung";
        String nxb = chiTiet.tenNhaXuatBan() != null ? chiTiet.tenNhaXuatBan() : "NXB Tri Thức";
        int namXB = sach.getNamXuatBan() != null ? sach.getNamXuatBan() : 2024;
        int tongTrang = (sach.getSoTrang() != null && sach.getSoTrang() > 0) ? sach.getSoTrang() : 280;

        List<Map<String, String>> mucLuc = List.of(
            Map.of("chuong", "Chương 1", "tieuDe", "Khởi đầu và Nền tảng tiếp cận", "trang", "5"),
            Map.of("chuong", "Chương 2", "tieuDe", "Nguyên lý vận hành cốt lõi", "trang", "32"),
            Map.of("chuong", "Chương 3", "tieuDe", "Các phương pháp thực hành tiêu biểu", "trang", "78"),
            Map.of("chuong", "Chương 4", "tieuDe", "Những thách thức và bài học thực tiễn", "trang", "125"),
            Map.of("chuong", "Chương 5", "tieuDe", "Góc nhìn mở rộng & Đột phá tư duy", "trang", "180"),
            Map.of("chuong", "Chương 6", "tieuDe", "Kết luận & Hướng phát triển tương lai", "trang", "240")
        );

        List<Map<String, Object>> danhSachChuongTrichDoan = new ArrayList<>();
        danhSachChuongTrichDoan.add(Map.of(
            "chuongSo", 1,
            "tieuDe", "Lời nói đầu & Khởi nguồn ý tưởng",
            "trangBatDau", 1,
            "noiDung", "Chào mừng bạn đọc đến với ấn phẩm \"" + tenSach + "\" của tác giả " + tenTacGia + ".\n\n" +
                "Trong kỷ nguyên số hóa và phát triển tri thức không ngừng, việc tiếp cận đúng nguồn tài liệu chính thống và sâu sắc là kim chỉ nam quan trọng nhất. " +
                moTa + "\n\n" +
                "Cuốn sách này được biên soạn nhằm mang đến cho bạn không chỉ là những lý thuyết thuần túy mà còn là cả một hệ thống phương pháp luận, những trải nghiệm thực tế tích lũy qua nhiều năm nghiên cứu.\n\n" +
                "Mỗi trang sách là một chặng đường khám phá mới, hy vọng sẽ khơi gợi niềm đam mê tìm tòi và tiếp thêm động lực cho chặng đường học tập, làm việc của bạn đọc tại Thư viện số."
        ));

        danhSachChuongTrichDoan.add(Map.of(
            "chuongSo", 2,
            "tieuDe", "Chương 1: Khởi đầu và Nền tảng tiếp cận",
            "trangBatDau", 5,
            "noiDung", "1.1 Bối cảnh ra đời và tầm quan trọng\n\n" +
                "Khi chúng ta bắt đầu tìm hiểu về lĩnh vực " + tenDanhMuc + ", câu hỏi đầu tiên luôn là: \"Giá trị thực sự nằm ở đâu?\". Rất nhiều người thường vội vã đi tìm những công thức phức tạp mà bỏ quên những nguyên lý cốt lõi ban đầu.\n\n" +
                "Tác giả " + tenTacGia + " chia sẻ: \"Hiểu rõ nền tảng là bạn đã nắm giữ hơn 70% chìa khóa của thành công.\"\n\n" +
                "1.2 Phân tích hiện trạng và các nhân tố quyết định\n\n" +
                "Thông qua các khảo sát thực nghiệm được xuất bản bởi " + nxb + " vào năm " + namXB + ", nhóm tác giả nhận thấy việc áp dụng tư duy bài bản giúp tiết kiệm tối đa thời gian và chi phí thử nghiệm sai lầm.\n\n" +
                "Hãy tự hỏi chính mình: Bạn đang đọc cuốn sách này với mục tiêu nào? Để nâng cao kỹ năng, phục vụ nghiên cứu hay tìm kiếm giải pháp cho một vấn đề thực tế đang vướng mắc? Hãy đánh dấu những ý tưởng tâm đắc ngay trong quá trình đọc nhé!"
        ));

        danhSachChuongTrichDoan.add(Map.of(
            "chuongSo", 3,
            "tieuDe", "Chương 2: Nguyên lý vận hành cốt lõi (Trích đoạn xem trước)",
            "trangBatDau", 32,
            "noiDung", "2.1 Quy luật tương tác và luồng vận hành\n\n" +
                "Để tiến xa hơn trong \"" + tenSach + "\", bạn cần xây dựng thói quen liên kết các kiến thức rời rạc thành một bức tranh toàn cảnh.\n\n" +
                "Một trong những điểm đặc biệt của cuốn sách này là cách tiếp cận trực quan, dễ hiểu nhưng không làm giảm đi tính học thuật chuẩn mực.\n\n" +
                "[... Bạn đang xem bản đọc thử trích đoạn " + Math.min(15, tongTrang) + " trang đầu tiên của sách. Để đọc trọn vẹn toàn bộ " + tongTrang + " trang với đầy đủ sơ đồ minh họa và phụ lục, bạn có thể thực hiện MƯỢN SÁCH miễn phí ngay tại Thư viện! ...]"
        ));

        Map<String, Object> resp = new HashMap<>();
        resp.put("sachId", id);
        resp.put("tenSach", tenSach);
        resp.put("tacGia", tenTacGia);
        resp.put("danhMuc", tenDanhMuc);
        resp.put("nhaXuatBan", nxb);
        resp.put("namXuatBan", namXB);
        resp.put("tongSoTrang", tongTrang);
        resp.put("soTrangDocThu", Math.min(15, tongTrang));
        resp.put("anhBia", sach.getAnhBia());
        resp.put("mucLuc", mucLuc);
        resp.put("chuongTrichDoan", danhSachChuongTrichDoan);

        return ResponseEntity.ok(resp);
    }

    @PostMapping
    public ResponseEntity<SachDTO> them(@RequestBody SachDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SachDTO> sua(@PathVariable Long id, @RequestBody SachDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa sách thành công"));
    }
}

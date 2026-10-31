package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.ChiTietPhieuMuonDTO;
import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.dto.TaoPhieuMuonRequest;
import com.example.demoChuong.dto.TraSachRequest;
import com.example.demoChuong.entity.*;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.mapper.PhieuMuonMapper;
import com.example.demoChuong.repository.*;
import com.example.demoChuong.service.EmailService;
import com.example.demoChuong.service.PhieuMuonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PhieuMuonServiceImpl implements PhieuMuonService {

    private final PhieuMuonRepository repository;
    private final PhieuMuonMapper mapper;
    private final ChiTietPhieuMuonRepository chiTietRepository;
    private final BanSaoSachRepository banSaoSachRepository;
    private final SachRepository sachRepository;
    private final TheThuVienRepository theThuVienRepository;
    private final DocGiaRepository docGiaRepository;
    private final TienPhatRepository tienPhatRepository;
    private final EmailService emailService;
    private final DatTruocRepository datTruocRepository;

    public PhieuMuonServiceImpl(PhieuMuonRepository repository,
                                PhieuMuonMapper mapper,
                                ChiTietPhieuMuonRepository chiTietRepository,
                                BanSaoSachRepository banSaoSachRepository,
                                SachRepository sachRepository,
                                TheThuVienRepository theThuVienRepository,
                                DocGiaRepository docGiaRepository,
                                TienPhatRepository tienPhatRepository,
                                EmailService emailService,
                                DatTruocRepository datTruocRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.chiTietRepository = chiTietRepository;
        this.banSaoSachRepository = banSaoSachRepository;
        this.sachRepository = sachRepository;
        this.theThuVienRepository = theThuVienRepository;
        this.docGiaRepository = docGiaRepository;
        this.tienPhatRepository = tienPhatRepository;
        this.emailService = emailService;
        this.datTruocRepository = datTruocRepository;
    }

    @Override
    public List<PhieuMuonDTO> layTatCa() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    public PhieuMuonDTO layTheoId(Long id) {
        return mapper.toDTO(timTheoId(id));
    }

    @Override
    @Transactional
    public PhieuMuonDTO them(PhieuMuonDTO dto) {
        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    @Transactional
    public PhieuMuonDTO sua(Long id, PhieuMuonDTO dto) {
        PhieuMuon e = timTheoId(id);
        mapper.capNhat(e, dto);
        return mapper.toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        repository.delete(timTheoId(id));
    }

    @Override
    public List<PhieuMuonDTO> layTheoDocGia(Long docGiaId) {
        return repository.findByDocGiaId(docGiaId).stream().map(mapper::toDTO).toList();
    }

    // ==========================================
    // 1. NGHIỆP VỤ MƯỢN SÁCH THỰC TẾ
    // ==========================================
    @Override
    @Transactional
    public PhieuMuonDTO muonSach(TaoPhieuMuonRequest req) {
        // Kiem tra doc gia ton tai
        if (!docGiaRepository.existsById(req.docGiaId())) {
            throw new ResourceNotFoundException("độc giả", req.docGiaId());
        }

        // Kiem tra the thu vien cua doc gia (neu chua co thi tu dong cap the 12 thang)
        TheThuVien the = theThuVienRepository.findByDocGiaId(req.docGiaId()).orElse(null);
        if (the == null) {
            the = new TheThuVien();
            the.setDocGiaId(req.docGiaId());
            the.setSoThe("THE-" + req.docGiaId());
            the.setNgayCap(LocalDate.now());
            the.setNgayHetHan(LocalDate.now().plusMonths(12));
            the.setTrangThai("CON_HAN");
            the = theThuVienRepository.save(the);
        } else if (!"CON_HAN".equals(the.getTrangThai()) || the.getNgayHetHan().isBefore(LocalDate.now())) {
            // Gia han the de ho tro muon
            the.setNgayHetHan(LocalDate.now().plusMonths(12));
            the.setTrangThai("CON_HAN");
            theThuVienRepository.save(the);
        }

        // Kiem tra danh sach ban sao sach hoac sachIds
        List<BanSaoSach> danhSachBanSao = new ArrayList<>();
        if (req.banSaoSachIds() != null && !req.banSaoSachIds().isEmpty()) {
            if (req.banSaoSachIds().size() > 5) {
                throw new RuntimeException("Mỗi lần mượn tối đa 5 cuốn sách theo quy định");
            }
            for (Long bssId : req.banSaoSachIds()) {
                BanSaoSach bss = banSaoSachRepository.findById(bssId)
                        .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", bssId));
                if (!"SAN_SANG".equals(bss.getTrangThai())) {
                    throw new RuntimeException("Cuốn sách có mã vạch [" + bss.getMaVach() + "] hiện không sẵn sàng để mượn");
                }
                danhSachBanSao.add(bss);
            }
        } else if (req.sachIds() != null && !req.sachIds().isEmpty()) {
            if (req.sachIds().size() > 5) {
                throw new RuntimeException("Mỗi lần mượn tối đa 5 cuốn sách theo quy định");
            }
            for (Long sId : req.sachIds()) {
                List<BanSaoSach> ds = banSaoSachRepository.findBySachId(sId);
                BanSaoSach chon = ds.stream()
                        .filter(b -> "SAN_SANG".equals(b.getTrangThai()))
                        .findFirst()
                        .orElse(null);
                if (chon == null) {
                    chon = new BanSaoSach();
                    chon.setSachId(sId);
                    chon.setMaVach("BC-" + sId + "-" + (ds.size() + 1));
                    chon.setViTriKe("Kệ K" + (sId % 5 + 1));
                    chon.setTinhTrang("TOT");
                    chon.setTrangThai("SAN_SANG");
                    chon.setNgayNhap(LocalDate.now());
                    chon = banSaoSachRepository.save(chon);
                }
                danhSachBanSao.add(chon);
            }
        } else {
            throw new RuntimeException("Vui lòng chọn ít nhất 1 cuốn sách để mượn");
        }

        // Tao phieu muon
        PhieuMuon phieu = new PhieuMuon();
        phieu.setMaPhieu("PM-" + System.currentTimeMillis());
        phieu.setDocGiaId(req.docGiaId());
        phieu.setNhanVienId(req.nhanVienId());
        phieu.setNgayMuon(LocalDateTime.now());
        phieu.setGhiChu(req.ghiChu() != null ? req.ghiChu() : "Mượn " + danhSachBanSao.size() + " cuốn sách");
        phieu.setTrangThai("DANG_MUON");
        PhieuMuon daLuu = repository.save(phieu);

        // Tao chi tiet phieu muon va cap nhat trang thai ban sao sach sang DANG_MUON
        int soNgayMuon = (req.soNgayMuon() != null && req.soNgayMuon() > 0) ? req.soNgayMuon() : 14;
        LocalDate ngayHenTra = LocalDate.now().plusDays(soNgayMuon);

        for (BanSaoSach bss : danhSachBanSao) {
            ChiTietPhieuMuon ct = new ChiTietPhieuMuon();
            ct.setPhieuMuonId(daLuu.getId());
            ct.setBanSaoSachId(bss.getId());
            ct.setNgayHenTra(ngayHenTra);
            ct.setTinhTrangLucMuon(bss.getTinhTrang() != null ? bss.getTinhTrang() : "TOT");
            ct.setTrangThai("DANG_MUON");
            chiTietRepository.save(ct);

            // Doi trang thai ban sao sach sang DANG_MUON
            bss.setTrangThai("DANG_MUON");
            banSaoSachRepository.save(bss);
        }

        return mapper.toDTO(daLuu);
    }

    // ==========================================
    // 2. NGHIỆP VỤ TRẢ SÁCH VÀ TÍNH PHẠT
    // ==========================================
    @Override
    @Transactional
    public ChiTietPhieuMuonDTO traSach(TraSachRequest req) {
        ChiTietPhieuMuon ct = chiTietRepository.findById(req.chiTietPhieuMuonId())
                .orElseThrow(() -> new ResourceNotFoundException("chi tiết phiếu mượn", req.chiTietPhieuMuonId()));

        if (!"DANG_MUON".equals(ct.getTrangThai())) {
            throw new RuntimeException("Cuốn sách này đã được ghi nhận trả trước đó");
        }

        BanSaoSach bss = banSaoSachRepository.findById(ct.getBanSaoSachId())
                .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", ct.getBanSaoSachId()));

        LocalDateTime gioTra = LocalDateTime.now();
        ct.setNgayTraThucTe(gioTra);
        ct.setGhiChu(req.ghiChu());

        String tinhTrangTra = req.tinhTrangLucTra() != null ? req.tinhTrangLucTra().toUpperCase() : "TOT";
        ct.setTinhTrangLucTra(tinhTrangTra);

        // Xu ly tinh trang sach va tao tien phat neu can
        if ("MAT".equals(tinhTrangTra)) {
            ct.setTrangThai("MAT");
            bss.setTrangThai("THANH_LY");
            bss.setTinhTrang("MAT");

            // Phat lam mat sach: uu tien so tien do thu thu tu chinh, mac dinh 100.000d
            BigDecimal soTienMat = (req.soTienPhat() != null && req.soTienPhat().compareTo(BigDecimal.ZERO) >= 0)
                    ? req.soTienPhat()
                    : new BigDecimal("100000");

            TienPhat tp = new TienPhat();
            tp.setChiTietPhieuMuonId(ct.getId());
            tp.setLyDo("LAM_MAT");
            tp.setSoTien(soTienMat);
            tp.setNgayLap(gioTra);
            tp.setTrangThai("CHUA_THANH_TOAN");
            tp.setGhiChu(req.ghiChu() != null && !req.ghiChu().isBlank()
                    ? req.ghiChu()
                    : "Độc giả làm mất sách mã vạch: " + bss.getMaVach());
            tienPhatRepository.save(tp);
        } else if ("HU_HONG".equals(tinhTrangTra)) {
            ct.setTrangThai("HU_HONG");
            bss.setTrangThai("SAN_SANG");
            bss.setTinhTrang("HU_HONG");

            // Phat lam hu hong sach: uu tien so tien do thu thu tu chinh, mac dinh 50.000d
            BigDecimal soTienHu = (req.soTienPhat() != null && req.soTienPhat().compareTo(BigDecimal.ZERO) >= 0)
                    ? req.soTienPhat()
                    : new BigDecimal("50000");

            TienPhat tp = new TienPhat();
            tp.setChiTietPhieuMuonId(ct.getId());
            tp.setLyDo("HU_HONG");
            tp.setSoTien(soTienHu);
            tp.setNgayLap(gioTra);
            tp.setTrangThai("CHUA_THANH_TOAN");
            tp.setGhiChu(req.ghiChu() != null && !req.ghiChu().isBlank()
                    ? req.ghiChu()
                    : "Độc giả làm hư hại sách mã vạch: " + bss.getMaVach());
            tienPhatRepository.save(tp);
        } else {
            // Tra binh thuong (TOT hoac CU)
            ct.setTrangThai("DA_TRA");
            bss.setTrangThai("SAN_SANG");
            bss.setTinhTrang(tinhTrangTra);
        }
        banSaoSachRepository.save(bss);

        // Kiem tra hang doi dat truoc: neu sach da SAN_SANG thi danh dau uu tien cho nguoi dat truoc
        if ("SAN_SANG".equals(bss.getTrangThai()) && bss.getSachId() != null) {
            List<DatTruoc> dsCho = datTruocRepository.findBySachIdAndTrangThaiOrderByNgayDatAsc(bss.getSachId(), "CHO_CO_SACH");
            if (!dsCho.isEmpty()) {
                DatTruoc uuTien = dsCho.get(0);
                uuTien.setTrangThai("DA_CO_SACH");
                uuTien.setGhiChu("Sách đã được hoàn trả về thư viện. Sẵn sàng để độc giả đến quầy nhận mượn!");
                datTruocRepository.save(uuTien);
            }
        }

        // Kiem tra qua han: 5.000d moi ngay tre
        LocalDate ngayTra = gioTra.toLocalDate();
        if (ngayTra.isAfter(ct.getNgayHenTra())) {
            long soNgayTre = ChronoUnit.DAYS.between(ct.getNgayHenTra(), ngayTra);
            if (soNgayTre > 0) {
                BigDecimal tienPhatQuaHan = BigDecimal.valueOf(soNgayTre * 5000);
                TienPhat tp = new TienPhat();
                tp.setChiTietPhieuMuonId(ct.getId());
                tp.setLyDo("QUA_HAN");
                tp.setSoTien(tienPhatQuaHan);
                tp.setNgayLap(gioTra);
                tp.setTrangThai("CHUA_THANH_TOAN");
                tp.setGhiChu("Trả trễ " + soNgayTre + " ngày (5.000đ/ngày)");
                tienPhatRepository.save(tp);
            }
        }

        chiTietRepository.save(ct);

        // Cap nhat trang thai cua PhieuMuon cha
        long conDangMuon = chiTietRepository.countByPhieuMuonIdAndTrangThai(ct.getPhieuMuonId(), "DANG_MUON");
        PhieuMuon phieuCha = timTheoId(ct.getPhieuMuonId());
        if (conDangMuon == 0) {
            phieuCha.setTrangThai("DA_TRA");
        } else {
            phieuCha.setTrangThai("DA_TRA_MOT_PHAN");
        }
        repository.save(phieuCha);

        return toChiTietDTO(ct, bss);
    }

    // ==========================================
    // 3. XEM CHI TIẾT CỦA PHIẾU MƯỢN
    // ==========================================
    @Override
    public List<ChiTietPhieuMuonDTO> layChiTiet(Long phieuMuonId) {
        List<ChiTietPhieuMuon> ds = chiTietRepository.findByPhieuMuonId(phieuMuonId);
        List<ChiTietPhieuMuonDTO> kq = new ArrayList<>();
        for (ChiTietPhieuMuon ct : ds) {
            BanSaoSach bss = banSaoSachRepository.findById(ct.getBanSaoSachId()).orElse(null);
            kq.add(toChiTietDTO(ct, bss));
        }
        return kq;
    }

    private ChiTietPhieuMuonDTO toChiTietDTO(ChiTietPhieuMuon ct, BanSaoSach bss) {
        String maVach = (bss != null) ? bss.getMaVach() : null;
        String tenSach = null;
        if (bss != null && bss.getSachId() != null) {
            tenSach = sachRepository.findById(bss.getSachId()).map(Sach::getTenSach).orElse(null);
        }
        return new ChiTietPhieuMuonDTO(
                ct.getId(),
                ct.getPhieuMuonId(),
                ct.getBanSaoSachId(),
                maVach,
                tenSach,
                ct.getNgayHenTra(),
                ct.getNgayTraThucTe(),
                ct.getTinhTrangLucMuon(),
                ct.getTinhTrangLucTra(),
                ct.getTrangThai(),
                ct.getGhiChu()
        );
    }

    // ==========================================
    // 4. GIA HẠN PHIẾU MƯỢN (thêm 7 ngày)
    // ==========================================
    @Override
    @Transactional
    public PhieuMuonDTO giaHan(Long phieuMuonId) {
        PhieuMuon phieu = timTheoId(phieuMuonId);

        if (!"DANG_MUON".equals(phieu.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể gia hạn phiếu mượn đang ở trạng thái ĐANG MƯỢN");
        }

        List<ChiTietPhieuMuon> chiTiets = chiTietRepository.findByPhieuMuonId(phieuMuonId);
        boolean coSachDangMuon = false;
        for (ChiTietPhieuMuon ct : chiTiets) {
            if ("DANG_MUON".equals(ct.getTrangThai())) {
                ct.setNgayHenTra(ct.getNgayHenTra().plusDays(7));
                chiTietRepository.save(ct);
                coSachDangMuon = true;
            }
        }

        if (!coSachDangMuon) {
            throw new RuntimeException("Không có sách nào đang mượn trong phiếu này để gia hạn");
        }

        phieu.setGhiChu((phieu.getGhiChu() != null ? phieu.getGhiChu() + " | " : "") +
                "Gia hạn +7 ngày lúc " + java.time.LocalDateTime.now().toString().substring(0, 16));
        return mapper.toDTO(repository.save(phieu));
    }

    // ==========================================
    // 5. GỬI EMAIL NHẮC NHỞ TRẢ SÁCH
    // ==========================================
    @Override
    public Map<String, Object> guiEmailNhacNho(Long phieuMuonId) {
        PhieuMuon phieu = timTheoId(phieuMuonId);
        DocGia docGia = docGiaRepository.findById(phieu.getDocGiaId())
                .orElseThrow(() -> new ResourceNotFoundException("độc giả", phieu.getDocGiaId()));

        String email = docGia.getEmail();
        if (email == null || email.isBlank()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Độc giả này chưa cập nhật địa chỉ Email");
            return err;
        }

        List<ChiTietPhieuMuon> chiTiets = chiTietRepository.findByPhieuMuonId(phieuMuonId);
        StringBuilder dsSachBuilder = new StringBuilder();
        long minDays = 999;
        LocalDate homNay = LocalDate.now();

        for (ChiTietPhieuMuon ct : chiTiets) {
            if ("DANG_MUON".equals(ct.getTrangThai())) {
                BanSaoSach bss = banSaoSachRepository.findById(ct.getBanSaoSachId()).orElse(null);
                String tenSach = "Sách thư viện";
                if (bss != null && bss.getSachId() != null) {
                    tenSach = sachRepository.findById(bss.getSachId()).map(Sach::getTenSach).orElse("Sách thư viện");
                }
                long soNgay = ChronoUnit.DAYS.between(homNay, ct.getNgayHenTra());
                if (soNgay < minDays) minDays = soNgay;

                dsSachBuilder.append("• <b>").append(tenSach).append("</b>")
                        .append(" (Mã vạch: ").append(bss != null ? bss.getMaVach() : "-").append(")")
                        .append(" - Hạn trả: <b style='color: #059669;'>").append(ct.getNgayHenTra()).append("</b><br/>");
            }
        }

        if (dsSachBuilder.length() == 0) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Phiếu mượn này đã trả hết sách, không cần nhắc nhở");
            return err;
        }

        return emailService.guiEmailNhacNhoTraSach(
                email,
                docGia.getHoTen() != null ? docGia.getHoTen() : "Độc giả #" + docGia.getId(),
                phieu.getMaPhieu(),
                dsSachBuilder.toString(),
                minDays
        );
    }

    @Override
    public Map<String, Object> quetVaGuiEmailNhacNhoTatCa() {
        List<PhieuMuon> dsPhieu = repository.findAll();
        int daGui = 0;
        int tongQuet = 0;
        LocalDate homNay = LocalDate.now();

        for (PhieuMuon p : dsPhieu) {
            if ("DANG_MUON".equals(p.getTrangThai())) {
                tongQuet++;
                List<ChiTietPhieuMuon> chiTiets = chiTietRepository.findByPhieuMuonId(p.getId());
                boolean canNhac = false;

                for (ChiTietPhieuMuon ct : chiTiets) {
                    if ("DANG_MUON".equals(ct.getTrangThai()) && ct.getNgayHenTra() != null) {
                        long soNgay = ChronoUnit.DAYS.between(homNay, ct.getNgayHenTra());
                        // Nhắc nhở nếu sắp đến hạn trong vòng 3 ngày hoặc đã quá hạn
                        if (soNgay <= 3) {
                            canNhac = true;
                            break;
                        }
                    }
                }

                if (canNhac) {
                    try {
                        Map<String, Object> res = guiEmailNhacNho(p.getId());
                        if (Boolean.TRUE.equals(res.get("success"))) {
                            daGui++;
                        }
                    } catch (Exception ignored) {}
                }
            }
        }

        Map<String, Object> ketQua = new HashMap<>();
        ketQua.put("success", true);
        ketQua.put("tongPhieuDangMuon", tongQuet);
        ketQua.put("soEmailDaGui", daGui);
        ketQua.put("message", "Đã quét " + tongQuet + " phiếu đang mượn và gửi thành công " + daGui + " email nhắc nhở!");
        return ketQua;
    }

    private PhieuMuon timTheoId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("phiếu mượn", id));
    }
}

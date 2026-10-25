package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.ChiTietPhieuMuonDTO;
import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.dto.TaoPhieuMuonRequest;
import com.example.demoChuong.dto.TraSachRequest;
import com.example.demoChuong.entity.*;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.mapper.PhieuMuonMapper;
import com.example.demoChuong.repository.*;
import com.example.demoChuong.service.PhieuMuonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    public PhieuMuonServiceImpl(PhieuMuonRepository repository,
                                PhieuMuonMapper mapper,
                                ChiTietPhieuMuonRepository chiTietRepository,
                                BanSaoSachRepository banSaoSachRepository,
                                SachRepository sachRepository,
                                TheThuVienRepository theThuVienRepository,
                                DocGiaRepository docGiaRepository,
                                TienPhatRepository tienPhatRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.chiTietRepository = chiTietRepository;
        this.banSaoSachRepository = banSaoSachRepository;
        this.sachRepository = sachRepository;
        this.theThuVienRepository = theThuVienRepository;
        this.docGiaRepository = docGiaRepository;
        this.tienPhatRepository = tienPhatRepository;
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

        // Kiem tra the thu vien cua doc gia
        TheThuVien the = theThuVienRepository.findByDocGiaId(req.docGiaId()).orElse(null);
        if (the == null) {
            throw new RuntimeException("Độc giả chưa được cấp thẻ thư viện, không thể mượn sách");
        }
        if (!"CON_HAN".equals(the.getTrangThai()) || the.getNgayHetHan().isBefore(LocalDate.now())) {
            throw new RuntimeException("Thẻ thư viện của độc giả đã hết hạn hoặc bị khóa");
        }

        // Kiem tra so luong sach muon (toi da 5 cuon)
        if (req.banSaoSachIds() == null || req.banSaoSachIds().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất 1 cuốn sách để mượn");
        }
        if (req.banSaoSachIds().size() > 5) {
            throw new RuntimeException("Mỗi lần mượn tối đa 5 cuốn sách theo quy định");
        }

        // Kiem tra cac ban sao sach phai dang SAN_SANG
        List<BanSaoSach> danhSachBanSao = new ArrayList<>();
        for (Long bssId : req.banSaoSachIds()) {
            BanSaoSach bss = banSaoSachRepository.findById(bssId)
                    .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", bssId));
            if (!"SAN_SANG".equals(bss.getTrangThai())) {
                throw new RuntimeException("Cuốn sách có mã vạch [" + bss.getMaVach() + "] hiện không sẵn sàng để mượn");
            }
            danhSachBanSao.add(bss);
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

            // Phat lam mat sach (100.000d hoac gia tien sach)
            TienPhat tp = new TienPhat();
            tp.setChiTietPhieuMuonId(ct.getId());
            tp.setLyDo("LAM_MAT");
            tp.setSoTien(new BigDecimal("100000"));
            tp.setNgayLap(gioTra);
            tp.setTrangThai("CHUA_THANH_TOAN");
            tp.setGhiChu("Độc giả làm mất sách mã vạch: " + bss.getMaVach());
            tienPhatRepository.save(tp);
        } else if ("HU_HONG".equals(tinhTrangTra)) {
            ct.setTrangThai("HU_HONG");
            bss.setTrangThai("SAN_SANG");
            bss.setTinhTrang("HU_HONG");

            // Phat lam hu hong sach (50.000d)
            TienPhat tp = new TienPhat();
            tp.setChiTietPhieuMuonId(ct.getId());
            tp.setLyDo("HU_HONG");
            tp.setSoTien(new BigDecimal("50000"));
            tp.setNgayLap(gioTra);
            tp.setTrangThai("CHUA_THANH_TOAN");
            tp.setGhiChu("Độc giả làm hư hại sách mã vạch: " + bss.getMaVach());
            tienPhatRepository.save(tp);
        } else {
            // Tra binh thuong (TOT hoac CU)
            ct.setTrangThai("DA_TRA");
            bss.setTrangThai("SAN_SANG");
            bss.setTinhTrang(tinhTrangTra);
        }
        banSaoSachRepository.save(bss);

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

    private PhieuMuon timTheoId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("phiếu mượn", id));
    }
}

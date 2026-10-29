package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.TheThuVienDTO;
import com.example.demoChuong.entity.DocGia;
import com.example.demoChuong.entity.TheThuVien;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.DocGiaRepository;
import com.example.demoChuong.repository.TheThuVienRepository;
import com.example.demoChuong.service.TheThuVienService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TheThuVienServiceImpl implements TheThuVienService {

    private final TheThuVienRepository repository;
    private final DocGiaRepository docGiaRepository;

    public TheThuVienServiceImpl(TheThuVienRepository repository, DocGiaRepository docGiaRepository) {
        this.repository = repository;
        this.docGiaRepository = docGiaRepository;
    }

    @Override
    public List<TheThuVienDTO> layTatCa() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public TheThuVienDTO layTheoId(Long id) {
        TheThuVien e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("thẻ thư viện", id));
        return toDTO(e);
    }

    @Override
    public TheThuVienDTO layTheoDocGiaId(Long docGiaId) {
        TheThuVien e = repository.findByDocGiaId(docGiaId)
                .orElseThrow(() -> new RuntimeException("Độc giả chưa có thẻ thư viện"));
        return toDTO(e);
    }

    @Override
    public TheThuVienDTO layTheoSoThe(String soThe) {
        if (soThe == null || soThe.isBlank()) {
            throw new ResourceNotFoundException("thẻ thư viện", "rỗng");
        }
        String clean = soThe.trim();

        // 1. Tìm chính xác số thẻ (THE0001, THE-DG871337...)
        TheThuVien the = repository.findBySoTheIgnoreCase(clean).orElse(null);
        if (the == null && !clean.toUpperCase().startsWith("THE-")) {
            the = repository.findBySoTheIgnoreCase("THE-" + clean).orElse(null);
        }

        // 2. Nếu chưa thấy, tìm theo mã độc giả (ví dụ DG871337)
        if (the == null) {
            String maDg = clean.toUpperCase().startsWith("THE-") ? clean.substring(4) : clean;
            Optional<DocGia> optDg = docGiaRepository.findByMaDocGiaIgnoreCase(maDg);
            if (optDg.isEmpty()) {
                // Thử tìm theo ID độc giả nếu mã là số
                try {
                    Long idDg = Long.parseLong(maDg.replaceAll("\\D+", ""));
                    optDg = docGiaRepository.findById(idDg);
                } catch (Exception ignored) {}
            }

            if (optDg.isPresent()) {
                DocGia dg = optDg.get();
                the = repository.findByDocGiaId(dg.getId()).orElse(null);
                if (the == null) {
                    TheThuVien theMoi = new TheThuVien();
                    theMoi.setDocGiaId(dg.getId());
                    theMoi.setSoThe(clean.toUpperCase().startsWith("THE-") ? clean : "THE-" + dg.getMaDocGia());
                    theMoi.setNgayCap(LocalDate.now());
                    theMoi.setNgayHetHan(LocalDate.now().plusMonths(12));
                    theMoi.setTrangThai("CON_HAN");
                    the = repository.save(theMoi);
                }
            }
        }

        if (the == null) {
            throw new ResourceNotFoundException("thẻ thư viện", "số thẻ: " + soThe);
        }
        return toDTO(the);
    }

    @Override
    @Transactional
    public TheThuVienDTO capThe(TheThuVienDTO dto) {
        TheThuVien e = new TheThuVien();
        e.setDocGiaId(dto.docGiaId());
        e.setSoThe(dto.soThe() != null ? dto.soThe() : "THE-" + System.currentTimeMillis());
        e.setNgayCap(dto.ngayCap() != null ? dto.ngayCap() : LocalDate.now());
        // Mac dinh the co han 12 thang (1 nam)
        e.setNgayHetHan(dto.ngayHetHan() != null ? dto.ngayHetHan() : LocalDate.now().plusMonths(12));
        e.setTrangThai(dto.trangThai() != null ? dto.trangThai() : "CON_HAN");
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public TheThuVienDTO giaHan(Long id, int soThang) {
        TheThuVien e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("thẻ thư viện", id));
        LocalDate hanMoi = (e.getNgayHetHan().isAfter(LocalDate.now()) ? e.getNgayHetHan() : LocalDate.now()).plusMonths(soThang);
        e.setNgayHetHan(hanMoi);
        e.setTrangThai("CON_HAN");
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        TheThuVien e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("thẻ thư viện", id));
        repository.delete(e);
    }

    private TheThuVienDTO toDTO(TheThuVien e) {
        return new TheThuVienDTO(e.getId(), e.getDocGiaId(), e.getSoThe(), e.getNgayCap(), e.getNgayHetHan(), e.getTrangThai());
    }
}

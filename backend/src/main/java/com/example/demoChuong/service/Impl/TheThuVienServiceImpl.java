package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.TheThuVienDTO;
import com.example.demoChuong.entity.TheThuVien;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.TheThuVienRepository;
import com.example.demoChuong.service.TheThuVienService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TheThuVienServiceImpl implements TheThuVienService {

    private final TheThuVienRepository repository;

    public TheThuVienServiceImpl(TheThuVienRepository repository) {
        this.repository = repository;
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

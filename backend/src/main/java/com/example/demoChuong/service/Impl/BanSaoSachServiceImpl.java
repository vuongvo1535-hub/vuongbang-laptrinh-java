package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.BanSaoSachDTO;
import com.example.demoChuong.entity.BanSaoSach;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.BanSaoSachRepository;
import com.example.demoChuong.service.BanSaoSachService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BanSaoSachServiceImpl implements BanSaoSachService {

    private final BanSaoSachRepository repository;

    public BanSaoSachServiceImpl(BanSaoSachRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<BanSaoSachDTO> layTatCa() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public List<BanSaoSachDTO> layTheoSachId(Long sachId) {
        return repository.findBySachId(sachId).stream().map(this::toDTO).toList();
    }

    @Override
    public BanSaoSachDTO layTheoId(Long id) {
        BanSaoSach e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", id));
        return toDTO(e);
    }

    @Override
    public BanSaoSachDTO layTheoMaVach(String maVach) {
        BanSaoSach e = repository.findByMaVach(maVach)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản sao sách với mã vạch: " + maVach));
        return toDTO(e);
    }

    @Override
    @Transactional
    public BanSaoSachDTO them(BanSaoSachDTO dto) {
        BanSaoSach e = new BanSaoSach();
        e.setSachId(dto.sachId());
        e.setMaVach(dto.maVach());
        e.setViTriKe(dto.viTriKe());
        e.setTinhTrang(dto.tinhTrang() != null ? dto.tinhTrang() : "TOT");
        e.setTrangThai(dto.trangThai() != null ? dto.trangThai() : "SAN_SANG");
        e.setNgayNhap(dto.ngayNhap() != null ? dto.ngayNhap() : LocalDate.now());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public BanSaoSachDTO sua(Long id, BanSaoSachDTO dto) {
        BanSaoSach e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", id));
        if (dto.sachId() != null) e.setSachId(dto.sachId());
        if (dto.maVach() != null) e.setMaVach(dto.maVach());
        if (dto.viTriKe() != null) e.setViTriKe(dto.viTriKe());
        if (dto.tinhTrang() != null) e.setTinhTrang(dto.tinhTrang());
        if (dto.trangThai() != null) e.setTrangThai(dto.trangThai());
        if (dto.ngayNhap() != null) e.setNgayNhap(dto.ngayNhap());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        BanSaoSach e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("bản sao sách", id));
        repository.delete(e);
    }

    private BanSaoSachDTO toDTO(BanSaoSach e) {
        return new BanSaoSachDTO(
                e.getId(),
                e.getSachId(),
                e.getMaVach(),
                e.getViTriKe(),
                e.getTinhTrang(),
                e.getTrangThai(),
                e.getNgayNhap()
        );
    }
}

package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.TacGiaDTO;
import com.example.demoChuong.entity.TacGia;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.TacGiaRepository;
import com.example.demoChuong.service.TacGiaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TacGiaServiceImpl implements TacGiaService {

    private final TacGiaRepository repository;

    public TacGiaServiceImpl(TacGiaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<TacGiaDTO> layTatCa() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public TacGiaDTO layTheoId(Long id) {
        TacGia e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("tác giả", id));
        return toDTO(e);
    }

    @Override
    @Transactional
    public TacGiaDTO them(TacGiaDTO dto) {
        TacGia e = new TacGia();
        e.setTenTacGia(dto.tenTacGia());
        e.setNgaySinh(dto.ngaySinh());
        e.setQuocTich(dto.quocTich());
        e.setTieuSu(dto.tieuSu());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public TacGiaDTO sua(Long id, TacGiaDTO dto) {
        TacGia e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("tác giả", id));
        e.setTenTacGia(dto.tenTacGia());
        e.setNgaySinh(dto.ngaySinh());
        e.setQuocTich(dto.quocTich());
        e.setTieuSu(dto.tieuSu());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        TacGia e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("tác giả", id));
        repository.delete(e);
    }

    @Override
    public List<TacGiaDTO> timKiem(String tuKhoa) {
        return repository.findByTenTacGiaContainingIgnoreCase(tuKhoa).stream()
                .map(this::toDTO).toList();
    }

    private TacGiaDTO toDTO(TacGia e) {
        return new TacGiaDTO(e.getId(), e.getTenTacGia(), e.getNgaySinh(), e.getQuocTich(), e.getTieuSu());
    }
}

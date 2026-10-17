package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.SachDTO;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.mapper.SachMapper;
import com.example.demoChuong.repository.SachRepository;
import com.example.demoChuong.service.SachService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SachServiceImpl implements SachService {

    private final SachRepository repository;
    private final SachMapper mapper;

    public SachServiceImpl(SachRepository repository, SachMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<SachDTO> layTatCa() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    public SachDTO layTheoId(Long id) {
        return mapper.toDTO(timTheoId(id));
    }

    @Override
    @Transactional
    public SachDTO them(SachDTO dto) {
        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    @Transactional
    public SachDTO sua(Long id, SachDTO dto) {
        Sach e = timTheoId(id);
        mapper.capNhat(e, dto);
        return mapper.toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        repository.delete(timTheoId(id));
    }

    @Override
    public List<SachDTO> timKiem(String tuKhoa) {
        return repository.findByTenSachContainingIgnoreCase(tuKhoa).stream().map(mapper::toDTO).toList();
    }

    private Sach timTheoId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("sách", id));
    }
}

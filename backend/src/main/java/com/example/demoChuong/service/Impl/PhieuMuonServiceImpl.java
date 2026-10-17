package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.entity.PhieuMuon;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.mapper.PhieuMuonMapper;
import com.example.demoChuong.repository.PhieuMuonRepository;
import com.example.demoChuong.service.PhieuMuonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PhieuMuonServiceImpl implements PhieuMuonService {

    private final PhieuMuonRepository repository;
    private final PhieuMuonMapper mapper;

    public PhieuMuonServiceImpl(PhieuMuonRepository repository, PhieuMuonMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
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

    private PhieuMuon timTheoId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("phiếu mượn", id));
    }
}

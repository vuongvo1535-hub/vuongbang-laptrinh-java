package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.DanhMucDTO;
import com.example.demoChuong.entity.DanhMuc;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.DanhMucRepository;
import com.example.demoChuong.service.DanhMucService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DanhMucServiceImpl implements DanhMucService {

    private final DanhMucRepository repository;

    public DanhMucServiceImpl(DanhMucRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DanhMucDTO> layTatCa() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public DanhMucDTO layTheoId(Long id) {
        DanhMuc e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
        return toDTO(e);
    }

    private DanhMucDTO toDTO(DanhMuc e) {
        return new DanhMucDTO(e.getId(), e.getTenDanhMuc(), e.getMoTa(), e.getDanhMucChaId());
    }
}

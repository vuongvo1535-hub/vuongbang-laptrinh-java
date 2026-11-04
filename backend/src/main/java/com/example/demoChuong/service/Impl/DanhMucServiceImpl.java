package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.DanhMucDTO;
import com.example.demoChuong.entity.DanhMuc;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.DanhMucRepository;
import com.example.demoChuong.repository.SachRepository;
import com.example.demoChuong.service.DanhMucService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DanhMucServiceImpl implements DanhMucService {

    private final DanhMucRepository repository;
    private final SachRepository sachRepository;

    public DanhMucServiceImpl(DanhMucRepository repository, SachRepository sachRepository) {
        this.repository = repository;
        this.sachRepository = sachRepository;
    }

    @Override
    public List<DanhMucDTO> layTatCa() {
        List<DanhMuc> list = repository.findAllOrderByIdDesc();
        Map<Long, Long> demMap = new HashMap<>();
        try {
            List<Object[]> counts = sachRepository.countSoSachTheoDanhMuc();
            for (Object[] row : counts) {
                if (row != null && row.length >= 2 && row[0] != null && row[1] != null) {
                    demMap.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
                }
            }
        } catch (Exception ignored) {
        }

        return list.stream()
                .map(e -> toDTO(e, demMap.getOrDefault(e.getId(), 0L)))
                .toList();
    }

    @Override
    public DanhMucDTO layTheoId(Long id) {
        DanhMuc e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
        long count = 0;
        try {
            count = sachRepository.countByDanhMucId(id);
        } catch (Exception ignored) {
        }
        return toDTO(e, count);
    }

    @Override
    @Transactional
    public DanhMucDTO them(DanhMucDTO dto) {
        DanhMuc e = new DanhMuc();
        e.setTenDanhMuc(dto.tenDanhMuc());
        e.setMoTa(dto.moTa());
        e.setDanhMucChaId(dto.danhMucChaId());
        return toDTO(repository.save(e), 0L);
    }

    @Override
    @Transactional
    public DanhMucDTO sua(Long id, DanhMucDTO dto) {
        DanhMuc e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
        e.setTenDanhMuc(dto.tenDanhMuc());
        e.setMoTa(dto.moTa());
        e.setDanhMucChaId(dto.danhMucChaId());
        long count = 0;
        try {
            count = sachRepository.countByDanhMucId(id);
        } catch (Exception ignored) {
        }
        return toDTO(repository.save(e), count);
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        DanhMuc e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("danh mục", id));
        repository.delete(e);
    }

    private DanhMucDTO toDTO(DanhMuc e, Long soLuongSach) {
        return new DanhMucDTO(
                e.getId(),
                e.getTenDanhMuc(),
                e.getMoTa(),
                e.getDanhMucChaId(),
                soLuongSach != null ? soLuongSach : 0L
        );
    }

    private DanhMucDTO toDTO(DanhMuc e) {
        return toDTO(e, 0L);
    }
}

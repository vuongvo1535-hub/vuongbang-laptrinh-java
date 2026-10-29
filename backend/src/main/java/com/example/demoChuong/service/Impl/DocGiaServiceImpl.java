package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.DocGiaDTO;
import com.example.demoChuong.entity.DocGia;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.mapper.DocGiaMapper;
import com.example.demoChuong.repository.DocGiaRepository;
import com.example.demoChuong.service.DocGiaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocGiaServiceImpl implements DocGiaService {

    private final DocGiaRepository repository;
    private final DocGiaMapper mapper;

    public DocGiaServiceImpl(DocGiaRepository repository, DocGiaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<DocGiaDTO> layTatCa() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    public DocGiaDTO layTheoId(Long id) {
        return mapper.toDTO(timTheoId(id));
    }

    @Override
    @Transactional
    public DocGiaDTO them(DocGiaDTO dto) {
        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    @Transactional
    public DocGiaDTO sua(Long id, DocGiaDTO dto) {
        DocGia e = timTheoId(id);
        mapper.capNhat(e, dto);
        return mapper.toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        repository.delete(timTheoId(id));
    }

    @Override
    public List<DocGiaDTO> timKiem(String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return layTatCa();
        }
        String clean = tuKhoa.trim();
        if (clean.toUpperCase().startsWith("THE-")) {
            String sub = clean.substring(4).trim();
            List<DocGia> dsSub = repository.timKiemTatCa(sub);
            if (!dsSub.isEmpty()) {
                return dsSub.stream().map(mapper::toDTO).toList();
            }
        }
        return repository.timKiemTatCa(clean).stream().map(mapper::toDTO).toList();
    }

    private DocGia timTheoId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("độc giả", id));
    }
}

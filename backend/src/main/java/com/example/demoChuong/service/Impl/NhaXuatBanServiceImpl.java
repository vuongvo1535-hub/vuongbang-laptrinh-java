package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.NhaXuatBanDTO;
import com.example.demoChuong.entity.NhaXuatBan;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.NhaXuatBanRepository;
import com.example.demoChuong.service.NhaXuatBanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NhaXuatBanServiceImpl implements NhaXuatBanService {

    private final NhaXuatBanRepository repository;

    public NhaXuatBanServiceImpl(NhaXuatBanRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<NhaXuatBanDTO> layTatCa() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public NhaXuatBanDTO layTheoId(Long id) {
        NhaXuatBan e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("nhà xuất bản", id));
        return toDTO(e);
    }

    @Override
    @Transactional
    public NhaXuatBanDTO them(NhaXuatBanDTO dto) {
        NhaXuatBan e = new NhaXuatBan();
        e.setTenNhaXuatBan(dto.tenNhaXuatBan());
        e.setDiaChi(dto.diaChi());
        e.setSoDienThoai(dto.soDienThoai());
        e.setEmail(dto.email());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public NhaXuatBanDTO sua(Long id, NhaXuatBanDTO dto) {
        NhaXuatBan e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("nhà xuất bản", id));
        e.setTenNhaXuatBan(dto.tenNhaXuatBan());
        e.setDiaChi(dto.diaChi());
        e.setSoDienThoai(dto.soDienThoai());
        e.setEmail(dto.email());
        return toDTO(repository.save(e));
    }

    @Override
    @Transactional
    public void xoa(Long id) {
        NhaXuatBan e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("nhà xuất bản", id));
        repository.delete(e);
    }

    private NhaXuatBanDTO toDTO(NhaXuatBan e) {
        return new NhaXuatBanDTO(e.getId(), e.getTenNhaXuatBan(), e.getDiaChi(), e.getSoDienThoai(), e.getEmail());
    }
}

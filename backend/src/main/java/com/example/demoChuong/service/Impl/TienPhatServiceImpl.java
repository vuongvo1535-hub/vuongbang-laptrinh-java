package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.TienPhatDTO;
import com.example.demoChuong.entity.ChiTietTienPhat;
import com.example.demoChuong.entity.TienPhat;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.ChiTietTienPhatRepository;
import com.example.demoChuong.repository.TienPhatRepository;
import com.example.demoChuong.service.TienPhatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TienPhatServiceImpl implements TienPhatService {

    private final TienPhatRepository repository;
    private final ChiTietTienPhatRepository chiTietTienPhatRepository;

    public TienPhatServiceImpl(TienPhatRepository repository, ChiTietTienPhatRepository chiTietTienPhatRepository) {
        this.repository = repository;
        this.chiTietTienPhatRepository = chiTietTienPhatRepository;
    }

    @Override
    public List<TienPhatDTO> layTatCa(String trangThai) {
        List<TienPhat> ds;
        if (trangThai != null && !trangThai.isBlank()) {
            ds = repository.findByTrangThai(trangThai);
        } else {
            ds = repository.findAll();
        }
        return ds.stream().map(this::toDTO).toList();
    }

    @Override
    public TienPhatDTO layTheoId(Long id) {
        TienPhat e = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", id));
        return toDTO(e);
    }

    @Override
    @Transactional
    public TienPhatDTO thanhToan(Long id, String phuongThuc) {
        TienPhat tp = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("tiền phạt", id));

        if ("DA_THANH_TOAN".equals(tp.getTrangThai())) {
            throw new RuntimeException("Khoản phạt này đã được thanh toán rồi");
        }

        tp.setTrangThai("DA_THANH_TOAN");
        TienPhat daLuu = repository.save(tp);

        // Luu lich su thanh toan
        ChiTietTienPhat cttp = new ChiTietTienPhat();
        cttp.setTienPhatId(tp.getId());
        cttp.setSoTien(tp.getSoTien());
        cttp.setNgayThanhToan(LocalDateTime.now());
        cttp.setPhuongThuc(phuongThuc != null ? phuongThuc : "TIEN_MAT");
        cttp.setGhiChu("Thanh toán tiền phạt ID: " + tp.getId());
        chiTietTienPhatRepository.save(cttp);

        return toDTO(daLuu);
    }

    private TienPhatDTO toDTO(TienPhat e) {
        return new TienPhatDTO(
                e.getId(),
                e.getChiTietPhieuMuonId(),
                e.getNhanVienId(),
                e.getLyDo(),
                e.getSoTien(),
                e.getNgayLap(),
                e.getTrangThai(),
                e.getGhiChu()
        );
    }
}

package com.example.demoChuong.mapper;

import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.entity.PhieuMuon;
import org.springframework.stereotype.Component;

@Component
public class PhieuMuonMapper {

    public PhieuMuonDTO toDTO(PhieuMuon e) {
        return new PhieuMuonDTO(
                e.getId(),
                e.getMaPhieu(),
                e.getDocGiaId(),
                e.getNhanVienId(),
                e.getNgayMuon(),
                e.getGhiChu(),
                e.getTrangThai()
        );
    }

    public PhieuMuon toEntity(PhieuMuonDTO d) {
        PhieuMuon e = new PhieuMuon();
        capNhat(e, d);
        return e;
    }

    /** Chep du lieu tu DTO sang entity (khong doi id). */
    public void capNhat(PhieuMuon e, PhieuMuonDTO d) {
        e.setMaPhieu(d.maPhieu());
        e.setDocGiaId(d.docGiaId());
        e.setNhanVienId(d.nhanVienId());
        e.setNgayMuon(d.ngayMuon());
        e.setGhiChu(d.ghiChu());
        // Cot trang_thai co DEFAULT 'DANG_MUON' trong SQL
        e.setTrangThai(d.trangThai() == null || d.trangThai().isBlank() ? "DANG_MUON" : d.trangThai());
    }
}

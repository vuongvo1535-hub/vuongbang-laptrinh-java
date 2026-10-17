package com.example.demoChuong.mapper;

import com.example.demoChuong.dto.SachDTO;
import com.example.demoChuong.entity.Sach;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class SachMapper {

    public SachDTO toDTO(Sach e) {
        return new SachDTO(
                e.getId(),
                e.getMaSach(),
                e.getTenSach(),
                e.getDanhMucId(),
                e.getNhaXuatBanId(),
                e.getIsbn(),
                e.getNamXuatBan(),
                e.getLanTaiBan(),
                e.getNgonNgu(),
                e.getMoTa(),
                e.getGiaTien(),
                e.getSoTrang(),
                e.getAnhBia(),
                e.getTrangThai()
        );
    }

    public Sach toEntity(SachDTO d) {
        Sach e = new Sach();
        capNhat(e, d);
        return e;
    }

    /** Chep du lieu tu DTO sang entity (khong doi id). */
    public void capNhat(Sach e, SachDTO d) {
        e.setMaSach(d.maSach());
        e.setTenSach(d.tenSach());
        e.setDanhMucId(d.danhMucId());
        e.setNhaXuatBanId(d.nhaXuatBanId());
        e.setIsbn(d.isbn());
        e.setNamXuatBan(d.namXuatBan());
        // Cac cot NOT NULL co DEFAULT trong SQL: neu frontend khong gui thi lay gia tri mac dinh
        e.setLanTaiBan(d.lanTaiBan() == null || d.lanTaiBan() < 1 ? 1 : d.lanTaiBan());
        e.setNgonNgu(coGiaTri(d.ngonNgu()) ? d.ngonNgu() : "Tiếng Việt");
        e.setMoTa(d.moTa());
        e.setGiaTien(d.giaTien() == null ? BigDecimal.ZERO : d.giaTien());
        e.setSoTrang(d.soTrang());
        e.setAnhBia(d.anhBia());
        e.setTrangThai(coGiaTri(d.trangThai()) ? d.trangThai() : "DANG_LUU_HANH");
    }

    private boolean coGiaTri(String s) {
        return s != null && !s.isBlank();
    }
}

package com.example.demoChuong.mapper;

import com.example.demoChuong.dto.DocGiaDTO;
import com.example.demoChuong.entity.DocGia;
import org.springframework.stereotype.Component;

@Component
public class DocGiaMapper {

    public DocGiaDTO toDTO(DocGia e) {
        return new DocGiaDTO(
                e.getId(),
                e.getTaiKhoanId(),
                e.getMaDocGia(),
                e.getHoTen(),
                e.getNgaySinh(),
                e.getGioiTinh(),
                e.getSoDienThoai(),
                e.getEmail(),
                e.getDiaChi(),
                e.getNgayDangKy(),
                e.getTrangThai()
        );
    }

    public DocGia toEntity(DocGiaDTO d) {
        DocGia e = new DocGia();
        capNhat(e, d);
        return e;
    }

    /** Chep du lieu tu DTO sang entity (khong doi id). */
    public void capNhat(DocGia e, DocGiaDTO d) {
        e.setTaiKhoanId(d.taiKhoanId());
        e.setMaDocGia(d.maDocGia());
        e.setHoTen(d.hoTen());
        e.setNgaySinh(d.ngaySinh());
        // Cac cot co DEFAULT trong SQL: gioi_tinh = 'KHAC', trang_thai = 'HOAT_DONG'
        e.setGioiTinh(coGiaTri(d.gioiTinh()) ? d.gioiTinh() : "KHAC");
        e.setSoDienThoai(d.soDienThoai());
        e.setEmail(d.email());
        e.setDiaChi(d.diaChi());
        e.setNgayDangKy(d.ngayDangKy());
        e.setTrangThai(coGiaTri(d.trangThai()) ? d.trangThai() : "HOAT_DONG");
    }

    private boolean coGiaTri(String s) {
        return s != null && !s.isBlank();
    }
}

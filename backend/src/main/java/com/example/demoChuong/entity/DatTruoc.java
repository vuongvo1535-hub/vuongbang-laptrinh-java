package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dat_truoc")
public class DatTruoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sachId;
    private Long docGiaId;
    private String tenDocGia;
    private String tenSach;
    private String anhBia;
    private LocalDateTime ngayDat;
    private String trangThai; // CHO_CO_SACH | DA_CO_SACH | DA_NHAN | DA_HUY
    private String ghiChu;

    public DatTruoc() {}

    public DatTruoc(Long id, Long sachId, Long docGiaId, String tenDocGia, String tenSach, String anhBia, LocalDateTime ngayDat, String trangThai, String ghiChu) {
        this.id = id;
        this.sachId = sachId;
        this.docGiaId = docGiaId;
        this.tenDocGia = tenDocGia;
        this.tenSach = tenSach;
        this.anhBia = anhBia;
        this.ngayDat = ngayDat;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSachId() { return sachId; }
    public void setSachId(Long sachId) { this.sachId = sachId; }

    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }

    public String getTenDocGia() { return tenDocGia; }
    public void setTenDocGia(String tenDocGia) { this.tenDocGia = tenDocGia; }

    public String getTenSach() { return tenSach; }
    public void setTenSach(String tenSach) { this.tenSach = tenSach; }

    public String getAnhBia() { return anhBia; }
    public void setAnhBia(String anhBia) { this.anhBia = anhBia; }

    public LocalDateTime getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDateTime ngayDat) { this.ngayDat = ngayDat; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

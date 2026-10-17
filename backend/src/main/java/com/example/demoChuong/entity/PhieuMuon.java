package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_muon")
public class PhieuMuon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String maPhieu;
    private Long docGiaId;
    private Long nhanVienId;
    private LocalDateTime ngayMuon;
    private String ghiChu;
    private String trangThai;

    public PhieuMuon() {}

    public PhieuMuon(Long id, String maPhieu, Long docGiaId, Long nhanVienId, LocalDateTime ngayMuon, String ghiChu, String trangThai) {
        this.id = id;
        this.maPhieu = maPhieu;
        this.docGiaId = docGiaId;
        this.nhanVienId = nhanVienId;
        this.ngayMuon = ngayMuon;
        this.ghiChu = ghiChu;
        this.trangThai = trangThai;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMaPhieu() { return maPhieu; }
    public void setMaPhieu(String maPhieu) { this.maPhieu = maPhieu; }
    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }
    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }
    public LocalDateTime getNgayMuon() { return ngayMuon; }
    public void setNgayMuon(LocalDateTime ngayMuon) { this.ngayMuon = ngayMuon; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}

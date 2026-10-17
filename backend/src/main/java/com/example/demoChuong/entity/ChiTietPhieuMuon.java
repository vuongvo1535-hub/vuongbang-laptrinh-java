package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_phieu_muon")
public class ChiTietPhieuMuon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long phieuMuonId;
    private Long banSaoSachId;
    private LocalDate ngayHenTra;
    private LocalDateTime ngayTraThucTe;
    private String tinhTrangLucMuon;
    private String tinhTrangLucTra;
    private String trangThai;
    private String ghiChu;

    public ChiTietPhieuMuon() {}

    public ChiTietPhieuMuon(Long id, Long phieuMuonId, Long banSaoSachId, LocalDate ngayHenTra, LocalDateTime ngayTraThucTe, String tinhTrangLucMuon, String tinhTrangLucTra, String trangThai, String ghiChu) {
        this.id = id;
        this.phieuMuonId = phieuMuonId;
        this.banSaoSachId = banSaoSachId;
        this.ngayHenTra = ngayHenTra;
        this.ngayTraThucTe = ngayTraThucTe;
        this.tinhTrangLucMuon = tinhTrangLucMuon;
        this.tinhTrangLucTra = tinhTrangLucTra;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPhieuMuonId() { return phieuMuonId; }
    public void setPhieuMuonId(Long phieuMuonId) { this.phieuMuonId = phieuMuonId; }
    public Long getBanSaoSachId() { return banSaoSachId; }
    public void setBanSaoSachId(Long banSaoSachId) { this.banSaoSachId = banSaoSachId; }
    public LocalDate getNgayHenTra() { return ngayHenTra; }
    public void setNgayHenTra(LocalDate ngayHenTra) { this.ngayHenTra = ngayHenTra; }
    public LocalDateTime getNgayTraThucTe() { return ngayTraThucTe; }
    public void setNgayTraThucTe(LocalDateTime ngayTraThucTe) { this.ngayTraThucTe = ngayTraThucTe; }
    public String getTinhTrangLucMuon() { return tinhTrangLucMuon; }
    public void setTinhTrangLucMuon(String tinhTrangLucMuon) { this.tinhTrangLucMuon = tinhTrangLucMuon; }
    public String getTinhTrangLucTra() { return tinhTrangLucTra; }
    public void setTinhTrangLucTra(String tinhTrangLucTra) { this.tinhTrangLucTra = tinhTrangLucTra; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

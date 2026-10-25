package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tien_phat")
public class TienPhat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long chiTietPhieuMuonId;
    private Long nhanVienId;
    private String lyDo; // QUA_HAN, HU_HONG, LAM_MAT, KHAC
    private BigDecimal soTien;
    private LocalDateTime ngayLap;
    private String trangThai; // CHUA_THANH_TOAN, DA_THANH_TOAN, MIEN_GIAM
    private String ghiChu;

    public TienPhat() {}

    public TienPhat(Long id, Long chiTietPhieuMuonId, Long nhanVienId, String lyDo, BigDecimal soTien, LocalDateTime ngayLap, String trangThai, String ghiChu) {
        this.id = id;
        this.chiTietPhieuMuonId = chiTietPhieuMuonId;
        this.nhanVienId = nhanVienId;
        this.lyDo = lyDo;
        this.soTien = soTien;
        this.ngayLap = ngayLap;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getChiTietPhieuMuonId() { return chiTietPhieuMuonId; }
    public void setChiTietPhieuMuonId(Long chiTietPhieuMuonId) { this.chiTietPhieuMuonId = chiTietPhieuMuonId; }
    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }
    public String getLyDo() { return lyDo; }
    public void setLyDo(String lyDo) { this.lyDo = lyDo; }
    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
    public LocalDateTime getNgayLap() { return ngayLap; }
    public void setNgayLap(LocalDateTime ngayLap) { this.ngayLap = ngayLap; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

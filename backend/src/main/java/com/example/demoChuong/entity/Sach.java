package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sach")
public class Sach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String maSach;
    private String tenSach;
    private Long danhMucId;
    private Long nhaXuatBanId;
    private String isbn;
    private Integer namXuatBan;
    private Integer lanTaiBan;
    private String ngonNgu;
    private String moTa;
    private BigDecimal giaTien;
    private Integer soTrang;
    private String anhBia;
    private String trangThai;

    public Sach() {}

    public Sach(Long id, String maSach, String tenSach, Long danhMucId, Long nhaXuatBanId, String isbn, Integer namXuatBan, Integer lanTaiBan, String ngonNgu, String moTa, BigDecimal giaTien, Integer soTrang, String anhBia, String trangThai) {
        this.id = id;
        this.maSach = maSach;
        this.tenSach = tenSach;
        this.danhMucId = danhMucId;
        this.nhaXuatBanId = nhaXuatBanId;
        this.isbn = isbn;
        this.namXuatBan = namXuatBan;
        this.lanTaiBan = lanTaiBan;
        this.ngonNgu = ngonNgu;
        this.moTa = moTa;
        this.giaTien = giaTien;
        this.soTrang = soTrang;
        this.anhBia = anhBia;
        this.trangThai = trangThai;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMaSach() { return maSach; }
    public void setMaSach(String maSach) { this.maSach = maSach; }
    public String getTenSach() { return tenSach; }
    public void setTenSach(String tenSach) { this.tenSach = tenSach; }
    public Long getDanhMucId() { return danhMucId; }
    public void setDanhMucId(Long danhMucId) { this.danhMucId = danhMucId; }
    public Long getNhaXuatBanId() { return nhaXuatBanId; }
    public void setNhaXuatBanId(Long nhaXuatBanId) { this.nhaXuatBanId = nhaXuatBanId; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public Integer getNamXuatBan() { return namXuatBan; }
    public void setNamXuatBan(Integer namXuatBan) { this.namXuatBan = namXuatBan; }
    public Integer getLanTaiBan() { return lanTaiBan; }
    public void setLanTaiBan(Integer lanTaiBan) { this.lanTaiBan = lanTaiBan; }
    public String getNgonNgu() { return ngonNgu; }
    public void setNgonNgu(String ngonNgu) { this.ngonNgu = ngonNgu; }
    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public BigDecimal getGiaTien() { return giaTien; }
    public void setGiaTien(BigDecimal giaTien) { this.giaTien = giaTien; }
    public Integer getSoTrang() { return soTrang; }
    public void setSoTrang(Integer soTrang) { this.soTrang = soTrang; }
    public String getAnhBia() { return anhBia; }
    public void setAnhBia(String anhBia) { this.anhBia = anhBia; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}

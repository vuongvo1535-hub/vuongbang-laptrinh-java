package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_tien_phat")
public class ChiTietTienPhat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tienPhatId;
    private BigDecimal soTien;
    private LocalDateTime ngayThanhToan;
    private String phuongThuc;
    private String ghiChu;

    public ChiTietTienPhat() {}

    public ChiTietTienPhat(Long id, Long tienPhatId, BigDecimal soTien, LocalDateTime ngayThanhToan, String phuongThuc, String ghiChu) {
        this.id = id;
        this.tienPhatId = tienPhatId;
        this.soTien = soTien;
        this.ngayThanhToan = ngayThanhToan;
        this.phuongThuc = phuongThuc;
        this.ghiChu = ghiChu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTienPhatId() { return tienPhatId; }
    public void setTienPhatId(Long tienPhatId) { this.tienPhatId = tienPhatId; }
    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
    public LocalDateTime getNgayThanhToan() { return ngayThanhToan; }
    public void setNgayThanhToan(LocalDateTime ngayThanhToan) { this.ngayThanhToan = ngayThanhToan; }
    public String getPhuongThuc() { return phuongThuc; }
    public void setPhuongThuc(String phuongThuc) { this.phuongThuc = phuongThuc; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

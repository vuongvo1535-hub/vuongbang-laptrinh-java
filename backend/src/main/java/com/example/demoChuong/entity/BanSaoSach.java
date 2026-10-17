package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ban_sao_sach")
public class BanSaoSach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long sachId;
    private String maVach;
    private String viTriKe;
    private String tinhTrang;
    private String trangThai;
    private LocalDate ngayNhap;

    public BanSaoSach() {}

    public BanSaoSach(Long id, Long sachId, String maVach, String viTriKe, String tinhTrang, String trangThai, LocalDate ngayNhap) {
        this.id = id;
        this.sachId = sachId;
        this.maVach = maVach;
        this.viTriKe = viTriKe;
        this.tinhTrang = tinhTrang;
        this.trangThai = trangThai;
        this.ngayNhap = ngayNhap;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSachId() { return sachId; }
    public void setSachId(Long sachId) { this.sachId = sachId; }
    public String getMaVach() { return maVach; }
    public void setMaVach(String maVach) { this.maVach = maVach; }
    public String getViTriKe() { return viTriKe; }
    public void setViTriKe(String viTriKe) { this.viTriKe = viTriKe; }
    public String getTinhTrang() { return tinhTrang; }
    public void setTinhTrang(String tinhTrang) { this.tinhTrang = tinhTrang; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
    public LocalDate getNgayNhap() { return ngayNhap; }
    public void setNgayNhap(LocalDate ngayNhap) { this.ngayNhap = ngayNhap; }
}

package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "the_thu_vien")
public class TheThuVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long docGiaId;
    private String soThe;
    private LocalDate ngayCap;
    private LocalDate ngayHetHan;
    private String trangThai;

    public TheThuVien() {}

    public TheThuVien(Long id, Long docGiaId, String soThe, LocalDate ngayCap, LocalDate ngayHetHan, String trangThai) {
        this.id = id;
        this.docGiaId = docGiaId;
        this.soThe = soThe;
        this.ngayCap = ngayCap;
        this.ngayHetHan = ngayHetHan;
        this.trangThai = trangThai;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }
    public String getSoThe() { return soThe; }
    public void setSoThe(String soThe) { this.soThe = soThe; }
    public LocalDate getNgayCap() { return ngayCap; }
    public void setNgayCap(LocalDate ngayCap) { this.ngayCap = ngayCap; }
    public LocalDate getNgayHetHan() { return ngayHetHan; }
    public void setNgayHetHan(LocalDate ngayHetHan) { this.ngayHetHan = ngayHetHan; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}

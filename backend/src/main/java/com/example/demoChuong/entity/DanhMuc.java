package com.example.demoChuong.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "danh_muc")
public class DanhMuc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tenDanhMuc;
    private String moTa;
    private Long danhMucChaId;

    public DanhMuc() {}

    public DanhMuc(Long id, String tenDanhMuc, String moTa, Long danhMucChaId) {
        this.id = id;
        this.tenDanhMuc = tenDanhMuc;
        this.moTa = moTa;
        this.danhMucChaId = danhMucChaId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTenDanhMuc() { return tenDanhMuc; }
    public void setTenDanhMuc(String tenDanhMuc) { this.tenDanhMuc = tenDanhMuc; }
    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public Long getDanhMucChaId() { return danhMucChaId; }
    public void setDanhMucChaId(Long danhMucChaId) { this.danhMucChaId = danhMucChaId; }
}

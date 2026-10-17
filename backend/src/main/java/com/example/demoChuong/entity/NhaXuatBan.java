package com.example.demoChuong.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "nha_xuat_ban")
public class NhaXuatBan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tenNhaXuatBan;
    private String diaChi;
    private String soDienThoai;
    private String email;

    public NhaXuatBan() {}

    public NhaXuatBan(Long id, String tenNhaXuatBan, String diaChi, String soDienThoai, String email) {
        this.id = id;
        this.tenNhaXuatBan = tenNhaXuatBan;
        this.diaChi = diaChi;
        this.soDienThoai = soDienThoai;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTenNhaXuatBan() { return tenNhaXuatBan; }
    public void setTenNhaXuatBan(String tenNhaXuatBan) { this.tenNhaXuatBan = tenNhaXuatBan; }
    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

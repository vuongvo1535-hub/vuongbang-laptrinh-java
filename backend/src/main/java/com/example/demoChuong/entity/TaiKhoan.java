package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tai_khoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tenDangNhap;
    private String matKhau;
    private String vaiTro; // QUAN_TRI, THU_THU, DOC_GIA
    private String trangThai; // HOAT_DONG, KHOA
    private LocalDateTime ngayTao;

    public TaiKhoan() {}

    public TaiKhoan(Long id, String tenDangNhap, String matKhau, String vaiTro, String trangThai, LocalDateTime ngayTao) {
        this.id = id;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.vaiTro = vaiTro;
        this.trangThai = trangThai;
        this.ngayTao = ngayTao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTenDangNhap() { return tenDangNhap; }
    public void setTenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }
    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }
    public String getVaiTro() { return vaiTro; }
    public void setVaiTro(String vaiTro) { this.vaiTro = vaiTro; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}

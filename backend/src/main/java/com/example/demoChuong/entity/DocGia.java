package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "doc_gia")
public class DocGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long taiKhoanId;
    private String maDocGia;
    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private LocalDate ngayDangKy;
    private String trangThai;

    public DocGia() {}

    public DocGia(Long id, Long taiKhoanId, String maDocGia, String hoTen, LocalDate ngaySinh, String gioiTinh, String soDienThoai, String email, String diaChi, LocalDate ngayDangKy, String trangThai) {
        this.id = id;
        this.taiKhoanId = taiKhoanId;
        this.maDocGia = maDocGia;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.diaChi = diaChi;
        this.ngayDangKy = ngayDangKy;
        this.trangThai = trangThai;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTaiKhoanId() { return taiKhoanId; }
    public void setTaiKhoanId(Long taiKhoanId) { this.taiKhoanId = taiKhoanId; }
    public String getMaDocGia() { return maDocGia; }
    public void setMaDocGia(String maDocGia) { this.maDocGia = maDocGia; }
    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }
    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }
    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}

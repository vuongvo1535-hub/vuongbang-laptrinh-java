package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tac_gia")
public class TacGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tenTacGia;
    private LocalDate ngaySinh;
    private String quocTich;
    private String tieuSu;

    public TacGia() {}

    public TacGia(Long id, String tenTacGia, LocalDate ngaySinh, String quocTich, String tieuSu) {
        this.id = id;
        this.tenTacGia = tenTacGia;
        this.ngaySinh = ngaySinh;
        this.quocTich = quocTich;
        this.tieuSu = tieuSu;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTenTacGia() { return tenTacGia; }
    public void setTenTacGia(String tenTacGia) { this.tenTacGia = tenTacGia; }
    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }
    public String getQuocTich() { return quocTich; }
    public void setQuocTich(String quocTich) { this.quocTich = quocTich; }
    public String getTieuSu() { return tieuSu; }
    public void setTieuSu(String tieuSu) { this.tieuSu = tieuSu; }
}

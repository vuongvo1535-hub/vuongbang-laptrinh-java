package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "danh_gia")
public class DanhGia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sachId;
    private Long docGiaId;
    private String hoTen;
    private Integer soSao; // 1 -> 5
    @Column(columnDefinition = "TEXT")
    private String noiDung;
    private LocalDateTime ngayTao;

    public DanhGia() {}

    public DanhGia(Long id, Long sachId, Long docGiaId, String hoTen, Integer soSao, String noiDung, LocalDateTime ngayTao) {
        this.id = id;
        this.sachId = sachId;
        this.docGiaId = docGiaId;
        this.hoTen = hoTen;
        this.soSao = soSao;
        this.noiDung = noiDung;
        this.ngayTao = ngayTao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSachId() { return sachId; }
    public void setSachId(Long sachId) { this.sachId = sachId; }

    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public Integer getSoSao() { return soSao; }
    public void setSoSao(Integer soSao) { this.soSao = soSao; }

    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}

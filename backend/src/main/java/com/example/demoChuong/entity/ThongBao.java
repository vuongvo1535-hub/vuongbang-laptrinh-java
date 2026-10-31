package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "thong_bao")
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // docGiaId = null có nghĩa là thông báo chung cho toàn hệ thống
    private Long docGiaId;

    @Column(nullable = false)
    private String tieuDe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String noiDung;

    // DAT_TRUOC (Sách về kệ) | HAN_TRA (Nhắc hẹn trả) | GIA_HAN (Gia hạn) | TIEN_PHAT (Phạt/Thanh toán) | HE_THONG (Chung)
    private String loaiThongBao;

    private String lienKet;

    private Boolean daDoc;

    private LocalDateTime ngayTao;

    public ThongBao() {}

    public ThongBao(Long id, Long docGiaId, String tieuDe, String noiDung, String loaiThongBao, String lienKet, Boolean daDoc, LocalDateTime ngayTao) {
        this.id = id;
        this.docGiaId = docGiaId;
        this.tieuDe = tieuDe;
        this.noiDung = noiDung;
        this.loaiThongBao = loaiThongBao;
        this.lienKet = lienKet;
        this.daDoc = daDoc;
        this.ngayTao = ngayTao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }

    public String getTieuDe() { return tieuDe; }
    public void setTieuDe(String tieuDe) { this.tieuDe = tieuDe; }

    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }

    public String getLoaiThongBao() { return loaiThongBao; }
    public void setLoaiThongBao(String loaiThongBao) { this.loaiThongBao = loaiThongBao; }

    public String getLienKet() { return lienKet; }
    public void setLienKet(String lienKet) { this.lienKet = lienKet; }

    public Boolean getDaDoc() { return daDoc; }
    public void setDaDoc(Boolean daDoc) { this.daDoc = daDoc; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}

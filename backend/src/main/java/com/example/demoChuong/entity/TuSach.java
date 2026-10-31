package com.example.demoChuong.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tu_sach")
public class TuSach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long docGiaId;
    private Long sachId;
    private String tenSach;
    private String anhBia;
    private String tacGia;
    
    // YEU_THICH (Yêu thích) | MUON_DOC (Muốn đọc) | DANG_DOC (Đang đọc) | DA_DOC (Đã đọc xong)
    private String trangThaiDoc;
    
    @Column(columnDefinition = "TEXT")
    private String ghiChu;
    
    private LocalDateTime ngayThem;

    public TuSach() {}

    public TuSach(Long id, Long docGiaId, Long sachId, String tenSach, String anhBia, String tacGia, String trangThaiDoc, String ghiChu, LocalDateTime ngayThem) {
        this.id = id;
        this.docGiaId = docGiaId;
        this.sachId = sachId;
        this.tenSach = tenSach;
        this.anhBia = anhBia;
        this.tacGia = tacGia;
        this.trangThaiDoc = trangThaiDoc;
        this.ghiChu = ghiChu;
        this.ngayThem = ngayThem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocGiaId() { return docGiaId; }
    public void setDocGiaId(Long docGiaId) { this.docGiaId = docGiaId; }

    public Long getSachId() { return sachId; }
    public void setSachId(Long sachId) { this.sachId = sachId; }

    public String getTenSach() { return tenSach; }
    public void setTenSach(String tenSach) { this.tenSach = tenSach; }

    public String getAnhBia() { return anhBia; }
    public void setAnhBia(String anhBia) { this.anhBia = anhBia; }

    public String getTacGia() { return tacGia; }
    public void setTacGia(String tacGia) { this.tacGia = tacGia; }

    public String getTrangThaiDoc() { return trangThaiDoc; }
    public void setTrangThaiDoc(String trangThaiDoc) { this.trangThaiDoc = trangThaiDoc; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public LocalDateTime getNgayThem() { return ngayThem; }
    public void setNgayThem(LocalDateTime ngayThem) { this.ngayThem = ngayThem; }
}

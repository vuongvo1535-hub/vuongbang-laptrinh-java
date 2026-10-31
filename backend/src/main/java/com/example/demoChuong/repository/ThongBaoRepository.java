package com.example.demoChuong.repository;

import com.example.demoChuong.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Long> {

    @Query("SELECT t FROM ThongBao t WHERE t.docGiaId = :docGiaId OR t.docGiaId IS NULL ORDER BY t.ngayTao DESC")
    List<ThongBao> layThongBaoCuaDocGia(@Param("docGiaId") Long docGiaId);

    @Query("SELECT COUNT(t) FROM ThongBao t WHERE (t.docGiaId = :docGiaId OR t.docGiaId IS NULL) AND (t.daDoc = false OR t.daDoc IS NULL)")
    long demChuaDoc(@Param("docGiaId") Long docGiaId);

    @Modifying
    @Query("UPDATE ThongBao t SET t.daDoc = true WHERE t.docGiaId = :docGiaId OR t.docGiaId IS NULL")
    void danhDauTatCaDaDoc(@Param("docGiaId") Long docGiaId);
}

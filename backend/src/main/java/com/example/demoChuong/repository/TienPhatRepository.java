package com.example.demoChuong.repository;

import com.example.demoChuong.entity.TienPhat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TienPhatRepository extends JpaRepository<TienPhat, Long> {

    List<TienPhat> findByChiTietPhieuMuonId(Long chiTietPhieuMuonId);

    List<TienPhat> findByTrangThai(String trangThai);

    long countByTrangThai(String trangThai);

    @Query(value = "SELECT tp.* FROM tien_phat tp " +
                   "JOIN chi_tiet_phieu_muon ct ON tp.chi_tiet_phieu_muon_id = ct.id " +
                   "JOIN phieu_muon pm ON ct.phieu_muon_id = pm.id " +
                   "WHERE pm.doc_gia_id = :docGiaId " +
                   "AND (:trangThai IS NULL OR :trangThai = '' OR tp.trang_thai = :trangThai)",
           nativeQuery = true)
    List<TienPhat> findByDocGiaIdAndTrangThai(@Param("docGiaId") Long docGiaId, @Param("trangThai") String trangThai);
}

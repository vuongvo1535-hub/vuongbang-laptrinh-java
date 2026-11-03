package com.example.demoChuong.repository;

import com.example.demoChuong.entity.PhieuMuon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuMuonRepository extends JpaRepository<PhieuMuon, Long> {

    @Query("SELECT p FROM PhieuMuon p WHERE p.docGiaId = :docGiaId ORDER BY p.id DESC")
    List<PhieuMuon> findByDocGiaId(@Param("docGiaId") Long docGiaId);

    @Query("SELECT p FROM PhieuMuon p ORDER BY p.id DESC")
    List<PhieuMuon> findAllOrderByIdDesc();

    long countByTrangThai(String trangThai);
}

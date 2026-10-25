package com.example.demoChuong.repository;

import com.example.demoChuong.entity.PhieuMuon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuMuonRepository extends JpaRepository<PhieuMuon, Long> {

    List<PhieuMuon> findByDocGiaId(Long docGiaId);

    long countByTrangThai(String trangThai);
}

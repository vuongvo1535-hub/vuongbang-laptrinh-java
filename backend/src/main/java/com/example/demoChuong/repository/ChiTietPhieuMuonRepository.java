package com.example.demoChuong.repository;

import com.example.demoChuong.entity.ChiTietPhieuMuon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietPhieuMuonRepository extends JpaRepository<ChiTietPhieuMuon, Long> {

    List<ChiTietPhieuMuon> findByPhieuMuonId(Long phieuMuonId);

    List<ChiTietPhieuMuon> findByBanSaoSachId(Long banSaoSachId);

    long countByPhieuMuonIdAndTrangThai(Long phieuMuonId, String trangThai);
}

package com.example.demoChuong.repository;

import com.example.demoChuong.entity.TienPhat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TienPhatRepository extends JpaRepository<TienPhat, Long> {

    List<TienPhat> findByChiTietPhieuMuonId(Long chiTietPhieuMuonId);

    List<TienPhat> findByTrangThai(String trangThai);

    long countByTrangThai(String trangThai);
}

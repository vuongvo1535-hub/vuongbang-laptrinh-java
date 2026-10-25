package com.example.demoChuong.repository;

import com.example.demoChuong.entity.BanSaoSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BanSaoSachRepository extends JpaRepository<BanSaoSach, Long> {

    List<BanSaoSach> findBySachId(Long sachId);

    List<BanSaoSach> findBySachIdAndTrangThai(Long sachId, String trangThai);

    Optional<BanSaoSach> findByMaVach(String maVach);

    long countByTrangThai(String trangThai);

    long countBySachIdAndTrangThaiNot(Long sachId, String trangThai);

    long countBySachIdAndTrangThai(Long sachId, String trangThai);
}

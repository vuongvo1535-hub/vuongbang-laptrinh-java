package com.example.demoChuong.repository;

import com.example.demoChuong.entity.BanSaoSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BanSaoSachRepository extends JpaRepository<BanSaoSach, Long> {

    long countBySachIdAndTrangThaiNot(Long sachId, String trangThai);

    long countBySachIdAndTrangThai(Long sachId, String trangThai);
}

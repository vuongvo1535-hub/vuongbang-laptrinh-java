package com.example.demoChuong.repository;

import com.example.demoChuong.entity.DatTruoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatTruocRepository extends JpaRepository<DatTruoc, Long> {

    List<DatTruoc> findByDocGiaIdOrderByNgayDatDesc(Long docGiaId);

    List<DatTruoc> findBySachIdAndTrangThaiOrderByNgayDatAsc(Long sachId, String trangThai);

    List<DatTruoc> findAllByOrderByNgayDatDesc();

    boolean existsByDocGiaIdAndSachIdAndTrangThai(Long docGiaId, Long sachId, String trangThai);
}

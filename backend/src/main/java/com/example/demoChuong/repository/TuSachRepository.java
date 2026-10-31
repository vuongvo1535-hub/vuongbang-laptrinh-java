package com.example.demoChuong.repository;

import com.example.demoChuong.entity.TuSach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuSachRepository extends JpaRepository<TuSach, Long> {

    List<TuSach> findByDocGiaIdOrderByNgayThemDesc(Long docGiaId);

    List<TuSach> findByDocGiaIdAndTrangThaiDocOrderByNgayThemDesc(Long docGiaId, String trangThaiDoc);

    Optional<TuSach> findByDocGiaIdAndSachId(Long docGiaId, Long sachId);

    boolean existsByDocGiaIdAndSachId(Long docGiaId, Long sachId);

    void deleteByDocGiaIdAndSachId(Long docGiaId, Long sachId);
}

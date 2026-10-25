package com.example.demoChuong.repository;

import com.example.demoChuong.entity.TheThuVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TheThuVienRepository extends JpaRepository<TheThuVien, Long> {

    Optional<TheThuVien> findByDocGiaId(Long docGiaId);

    Optional<TheThuVien> findBySoThe(String soThe);
}

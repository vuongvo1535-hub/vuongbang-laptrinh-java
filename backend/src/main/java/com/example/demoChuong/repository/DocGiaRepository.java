package com.example.demoChuong.repository;

import com.example.demoChuong.entity.DocGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocGiaRepository extends JpaRepository<DocGia, Long> {

    List<DocGia> findByHoTenContainingIgnoreCase(String tuKhoa);

    Optional<DocGia> findByTaiKhoanId(Long taiKhoanId);

    Optional<DocGia> findByMaDocGia(String maDocGia);

    Optional<DocGia> findByMaDocGiaIgnoreCase(String maDocGia);

    @Query("SELECT d FROM DocGia d WHERE " +
           "LOWER(d.hoTen) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) OR " +
           "LOWER(d.maDocGia) LIKE LOWER(CONCAT('%', :tuKhoa, '%')) OR " +
           "(d.soDienThoai IS NOT NULL AND d.soDienThoai LIKE CONCAT('%', :tuKhoa, '%')) OR " +
           "(d.email IS NOT NULL AND LOWER(d.email) LIKE LOWER(CONCAT('%', :tuKhoa, '%')))")
    List<DocGia> timKiemTatCa(@Param("tuKhoa") String tuKhoa);
}

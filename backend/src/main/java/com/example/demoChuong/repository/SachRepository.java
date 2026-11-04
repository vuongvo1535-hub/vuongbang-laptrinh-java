package com.example.demoChuong.repository;

import com.example.demoChuong.entity.Sach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SachRepository extends JpaRepository<Sach, Long> {

    List<Sach> findByTenSachContainingIgnoreCase(String tuKhoa);

    @Query("SELECT s FROM Sach s ORDER BY s.id DESC")
    List<Sach> findAllOrderByIdDesc();

    @Query("SELECT s.danhMucId, COUNT(s) FROM Sach s WHERE s.danhMucId IS NOT NULL GROUP BY s.danhMucId")
    List<Object[]> countSoSachTheoDanhMuc();

    long countByDanhMucId(Long danhMucId);
}

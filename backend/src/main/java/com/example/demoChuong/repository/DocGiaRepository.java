package com.example.demoChuong.repository;

import com.example.demoChuong.entity.DocGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocGiaRepository extends JpaRepository<DocGia, Long> {

    List<DocGia> findByHoTenContainingIgnoreCase(String tuKhoa);
}

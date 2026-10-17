package com.example.demoChuong.repository;

import com.example.demoChuong.entity.Sach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SachRepository extends JpaRepository<Sach, Long> {

    List<Sach> findByTenSachContainingIgnoreCase(String tuKhoa);
}

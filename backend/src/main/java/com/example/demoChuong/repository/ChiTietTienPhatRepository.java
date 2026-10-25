package com.example.demoChuong.repository;

import com.example.demoChuong.entity.ChiTietTienPhat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietTienPhatRepository extends JpaRepository<ChiTietTienPhat, Long> {
    List<ChiTietTienPhat> findByTienPhatId(Long tienPhatId);
}

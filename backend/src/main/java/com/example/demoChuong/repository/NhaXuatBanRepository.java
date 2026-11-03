package com.example.demoChuong.repository;

import com.example.demoChuong.entity.NhaXuatBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhaXuatBanRepository extends JpaRepository<NhaXuatBan, Long> {

    @Query("SELECT n FROM NhaXuatBan n ORDER BY n.id DESC")
    List<NhaXuatBan> findAllOrderByIdDesc();
}

package com.example.demoChuong.repository;

import com.example.demoChuong.entity.TacGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TacGiaRepository extends JpaRepository<TacGia, Long> {

    List<TacGia> findByTenTacGiaContainingIgnoreCase(String tuKhoa);

    /** Lay cac tac gia cua mot sach thong qua bang sach_tac_gia. */
    @Query(value = "SELECT tg.* FROM tac_gia tg JOIN sach_tac_gia stg ON stg.tac_gia_id = tg.id WHERE stg.sach_id = ?1 ORDER BY tg.id",
            nativeQuery = true)
    List<TacGia> timTheoSachId(Long sachId);
}

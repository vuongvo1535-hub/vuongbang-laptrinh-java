package com.example.demoChuong.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

/** Kiem tra ket noi MySQL: can chay file db/quan_ly_thu_vien.sql truoc. */
@SpringBootTest
class SachRepositoryTest {

    @Autowired
    private SachRepository sachRepository;

    @Test
    void ketNoiMySQL_docDuocBangSach() {
        assertTrue(sachRepository.count() >= 0);
    }
}

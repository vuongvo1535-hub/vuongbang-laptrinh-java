package com.example.demoChuong.service;

import com.example.demoChuong.dto.TheThuVienDTO;
import java.util.List;

public interface TheThuVienService {
    List<TheThuVienDTO> layTatCa();
    TheThuVienDTO layTheoId(Long id);
    TheThuVienDTO layTheoDocGiaId(Long docGiaId);
    TheThuVienDTO layTheoSoThe(String soThe);
    TheThuVienDTO capThe(TheThuVienDTO dto);
    TheThuVienDTO giaHan(Long id, int soThang);
    void xoa(Long id);
}
